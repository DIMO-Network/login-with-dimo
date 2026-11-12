# Login with DIMO

Login with DIMO is a React component SDK, providing developers with a set of pre-built, customizable building blocks for applications that integrate with DIMO. These components simplify the process of integrating Accounts API and Transactions SDK in React applications.

## Installation

To install the SDK, use npm or yarn to add the package to your project:

```
npm i @dimo-network/login-with-dimo
```

or

```
yarn add @dimo-network/login-with-dimo
```

## Usage

You can integrate the LoginWithDimo component into your React application to allow users to authenticate with Dimo. The component handles the authentication process in a popup window and triggers the appropriate callback functions upon success or error.

### Initialize DIMO SDK

```
import {
  initializeDimoSDK,
} from "@dimo-network/login-with-dimo";

  initializeDimoSDK({
    clientId: "YOUR_CLIENT_ID",
    redirectUri: "YOUR_REDIRECT_URI",
    apiKey: "YOUR_API_KEY",
    environment: "development" | "production",
  });
```

In addition to setting the dev credentials/environments, you can also set global options.

| Option             | Description                                                                                                       | Default      |
|--------------------|-------------------------------------------------------------------------------------------------------------------|--------------|
| `emailRequest`     | Whether to ask for the user's email: `'none'`, `'optional'` or `'required'`.                                      | `'optional'` |
| `forceEmail`       | Deprecated: same as `emailRequest: 'required'`. Still honoured.                                                   | `false`      |
| `language`         | Language of the login screens: `'en'` or `'ja'` (`'ja-JP'` and similar also work).                                | browser      |
| `redirectResponseMode` | Redirect mode only: where the login returns the session, `'query'` or `'fragment'`. See [redirect mode](#the-separate-dimo-modes). | `'query'` |
| `tosUrl`           | Your Terms of Service, linked from the login screens instead of DIMO's.                                          | DIMO's       |
| `privacyPolicyUrl` | Your Privacy Policy, linked from the login screens instead of DIMO's.                                            | DIMO's       |

```
  initializeDimoSDK({
    ...
    options: {
      emailRequest: 'required', // 'optional' by default; 'none' never asks
      language: 'ja',
      redirectResponseMode: 'fragment', // optional; 'query' by default
    },
  });
```

When `language` isn't set, the login shows Japanese to users whose browser language is Japanese or whose time zone is in Japan, and English otherwise. Users can switch language on the login screens, and their choice is remembered for your app. Every button also takes a `language` prop that overrides the option for the screens it opens.

The email is asked for after sign-in, with the rest of your request: on the vehicle or document sharing screen, or, for a plain login, on a short "Continue to {app}" step. It's asked once per app and account and the answer is remembered. With `required`, the user shares it to continue; cancelling before it's shared ends the login with `User declined to share their email` (`onError` in popup mode; in redirect mode your redirect URI gets `error=…`, which the SDK doesn't pass to `onError` yet, so read it from the query). Every button also takes an `emailRequest` prop that overrides the option.

When the user shares their email, it arrives with the login: `onSuccess` receives it as `authData.email`, and `getEmail()` / `email` from `useDimoAuthState()` return it right away, including inside `onSuccess`. When a login doesn't share it, `authData.email` is absent, `email` is `null`, and `getEmail()` throws `No permission to access email`; an email stored by an earlier login is cleared. A button with `emailRequest: 'none'` never includes an email and leaves a stored one as it was.

### The Dimo Auth Provider

The Dimo Auth Provider is used to get values of an authenticated state from the SDK. This includes, a boolean "authenticated" property, a method to get the currently valid JWT, an email property, a method to get email, and the wallet address

Any components that require this value should be wrapped in the DimoAuthProvider, as follows

```
<DimoAuthProvider>
    <SomeComponentThatNeedsDimoState/>
</DimoAuthProvider/>
```

Now, in the component the auth state can be fetched as follows

```
import {,
  useDimoAuthState,
} from "@dimo-network/login-with-dimo";

const { isAuthenticated, getValidJWT, getEmail, email, walletAddress } = useDimoAuthState();
```

Based on this authenticated state, you can render the necessary Dimo components

#### Logging out

`useDimoAuthState()` also returns `logout()`. It ends your app's session without opening a popup: it clears the stored token, wallet address and email, and sets `isAuthenticated` to `false`. Every login or share button (not `LogoutWithDimo`) then asks DIMO login for the account chooser (`prompt: 'select_account'`) until a login completes, so the user can switch accounts instead of being signed straight back in. A closed popup or abandoned redirect doesn't end this. Set `prompt` on a button to choose this yourself.

```
const { logout } = useDimoAuthState();

<button onClick={logout}>Log out</button>
```

`logout()` doesn't end the session inside DIMO login itself. On a shared device anyone at the browser can still pick "Continue as …", so use `LogoutWithDimo` (below) there.

**Logging out does not revoke the token.** It clears what the SDK and the login have stored, but a token that was already issued stays valid until it expires, up to 14 days. Anything that still holds a copy (your server, a log, another tab or device) can keep using it until then. If you need a hard cut-off, enforce your own session lifetime and don't treat a token that is still valid as a signed-in user.

### The Separate DIMO Modes

With the DIMO SDK, developers have the ability to control how their users interact with DIMO.

We offer two options
- Popup Mode (best for allowing users to see both the app, as well as DIMO)
- Redirect Mode (best for developers that want to avoid popups)

In popup mode, every button calls `onError` with `User closed the login window` when the user closes the popup without finishing. The message is exported as `POPUP_CLOSED_MESSAGE` if you want to filter it out. A second click while a popup is open focuses it instead of opening another.

**Redirect mode returns only to the page that started it.** Each redirect carries a one-time `dimoState`, and the login sends it back. The SDK accepts the returned `token`, `walletAddress`, `email` or `logout` only when `dimoState` matches what this browser tab sent. Anyone can link to your redirect URI with values of their choosing, so a link without the right `dimoState` changes nothing. That includes a console `?configurationId=` link: read its query yourself if you use one. So:

- Put your redirect URI on the same origin as the button, and open it in the same tab (the default).
- The SDK removes those values from the address bar once it has read them. Other values (`error`, `transactionHash`, `signature`, …) stay for you to read.
- This needs a Login with DIMO build that returns `dimoState`; release the login before this SDK version.

**Keeping the token out of your server's logs (optional).** By default the login puts the session in your redirect URI's query, so the token reaches your server, CDN and any logs in front of them. Set `redirectResponseMode: 'fragment'` in `options` and the login puts `token`, `walletAddress`, `email`, `logout` and `dimoState` in the URL fragment (`#…`) instead, which browsers don't send to servers or in `Referer` headers. Everything you read yourself (`error`, `transactionHash`, `signature`, …) stays in the query.

- The SDK always reads both places. It uses the fragment only when it carries the matching `dimoState`, and prefers it when both do. A fragment that doesn't match is ignored.
- If your app uses a hash router, the fragment is never touched unless it contains a `dimoState=` parameter of the login's own. Fragment mode can't be used with a redirect URI that already contains a `#`; the login then answers in the query.
- Fragment mode doesn't hide the token from scripts running on your page, and the fragment stays in browser history until the SDK has read and removed it.
- A Login with DIMO build that doesn't know the option answers in the query, so the SDK works either way. If your server reads `?token=` itself, switch to the fragment only knowingly.

### Using the Button Components

The following example shows all buttons being rendered, with no auth state checking

```
import {
  LoginWithDimo,
  ShareVehiclesWithDimo,
  ExecuteAdvancedTransactionWithDimo,
} from "@dimo-network/login-with-dimo";

<LoginWithDimo
  mode="popup"
  onSuccess={(authData) => console.log("Success:", authData)}
  onError={(error) => console.error("Error:", error)}
  permissionTemplateId={permissionsEnabled ? "1" : undefined} //This will control if your users are asked to share vehicles, as part of the login flow. "1" is the template for all SACD permissions
  utm="utm_campaign=dimo"
  // Optionally, specify vehicles/onboarding oracles (uncomment the line below to use it)
  // vehicles={["585","586"]}  // Specify the vehicles to be accessed after login
  // onboarding={["tesla"]}  // Specify the vehicles to be accessed after login
  />

<ShareVehiclesWithDimo
  mode="popup"
  onSuccess={(authData) => console.log("Success:", authData)} //authData will include the sharedVehicles
  onError={(error) => console.error("Error:", error)}
  permissionTemplateId={"1"} //REQUIRED: "1" is the template for all SACD permissions
  // expirationDate={} // Optional ISO string
  // Optionally, specify vehicles/onboarding oracles (uncomment the line below to use it)
  // vehicles={["585","586"]}  // Specify the vehicles to be accessed when triggered
  // onboarding={["tesla"]}  // Specify the vehicles to be accessed after login
  />

<ExecuteAdvancedTransactionWithDimo
  mode="popup"
  onSuccess={(transactionData: any) =>
    console.log("Success:", transactionHash)
  }
  onError={(error: any) => console.error("Error:", error)}
  address="0x21cFE003997fB7c2B3cfe5cf71e7833B7B2eCe10"
  value="0"
  abi={sampleAbi} //Some sample ABI required
  functionName="transfer"
  args={["0x62b98e019e0d3e4A1Ad8C786202e09017Bd995e1", "0"]}
/>
```

### Putting it all together

In many cases - developers may want to couple/decouple usage of these components

A common flow is

1. Show the login button, when in authenticated
2. Show the Share Vehicles and Execute Advanced Transaction button, when authenticated

This can be achieved by simply wrapping those buttons in a conditional as follows, to create a full example as follows

```javascript
import {
  LoginWithDimo,
  ShareVehiclesWithDimo,
  ExecuteAdvancedTransactionWithDimo,
  initializeDimoSDK,
  useDimoAuthState,
} from "@dimo-network/login-with-dimo";

const { isAuthenticated, getValidJWT, email, walletAddress, getEmail } = useDimoAuthState();

useEffect(()=>{
  if ( isAuthenticated ) {
    //makeAuthenticatedRequest(getValidJWT())
    console.log(email);
    console.log(walletAddress);
  }
},[isAuthenticated])

// isAuthenticated and getValidJWT() only say a token is stored and not
// expired: the SDK can't check its signature. Verify the JWT on your server
// (signature against DIMO's signing keys, issuer, audience = your client ID,
// expiry) before trusting it for anything.

initializeDimoSDK({
  clientId: process.env.REACT_APP_DIMO_CLIENT_ID!,
  redirectUri: process.env.REACT_APP_DIMO_REDIRECT_URI!,
});

...


{isAuthenticated ? (
  <ShareVehiclesWithDimo
    mode="popup"
    onSuccess={(authData) => console.log("Success:", authData)}
    onError={(error) => console.error("Error:", error)}
    permissionTemplateId={"1"}
    // expirationDate={} // Optional ISO string
  />

  <ExecuteAdvancedTransactionWithDimo
    mode="popup"
    onSuccess={(transactionData: any) =>
      console.log("Transaction Hash:", transactionData.transactionHash)
    }
    onError={(error: any) => console.error("Error:", error)}
    address="0x21cFE003997fB7c2B3cfe5cf71e7833B7B2eCe10"
    value="0"
    abi={sampleAbi}
    functionName="transfer"
    args={["0x62b98e019e0d3e4A1Ad8C786202e09017Bd995e1", "0"]}
  />
) : (
  <LoginWithDimo
    mode="popup"
    onSuccess={(authData) => console.log("Success:", authData)}
    onError={(error) => console.error("Error:", error)}
    permissionTemplateId={permissionsEnabled ? "1" : undefined}
    // expirationDate={} // Optional ISO string
    // vehicles={["585","586"]}
  />
)}
```

## Component Descriptions and Parameters

### LoginWithDimo

The `LoginWithDimo` component allows users to authenticate with DIMO.

| Parameter              | Description                                  | Default Value                | Type                           | Mandatory |
|------------------------|----------------------------------------------|------------------------------|--------------------------------|-----------|
| `mode`                 | Mode of the button (`popup`, `redirect`)     | N/A                          | `"popup" \| "redirect"`        | Yes       |
| `onSuccess`            | Callback function to handle success          | N/A                          | `(authData: AuthData) => void` | Yes       |
| `onError`              | Callback function to handle errors           | N/A                          | `(error: Error) => void`       | Yes       |
| `permissionTemplateId` | Permissions template ID                      | `undefined`                  | `string`                       | No        |
| `vehicles`             | List of vehicles                             | `undefined`                  | `string[]`                     | No        |
| `vehicleMakes`         | List of vehicle makes                        | `undefined`                  | `string[]`                     | No        |
| `powertrainTypes`      | List of vehicle powertrain types             | `undefined`                  | `string[]`                     | No        |
| `onboarding`           | List of oracles for onboarding               | `undefined`                  | `string[]`                     | No        |
| `expirationDate`       | Expiration date for permissions              | `undefined`                  | `string`                       | No        |
| `authenticatedLabel`   | Label when the user is authenticated         | `"Manage DIMO Account"`      | `string`                       | No        |
| `unAuthenticatedLabel` | Label when the user is not authenticated     | `"Continue with DIMO"`       | `string`                       | No        |
| `utm`                  | UTM parameters for tracking (a query string) | `null`                       | `string`                       | No        |
| `altTitle`             | Alternative title for the button             | `false` | `boolean` | No |
| `language`             | Language of the login screens it opens       | the `language` option | `'en' \| 'ja'` | No |
| `emailRequest`         | Whether to ask for the user's email          | the `emailRequest` option | `'none' \| 'optional' \| 'required'` | No |
| `prompt`               | `'select_account'` shows the account chooser; `'login'` requires a fresh sign-in | none (the chooser after `logout()`, until a login completes) | `'select_account' \| 'login'` | No |
| `loginHint`            | Pre-fills the email on the sign-in step. In redirect mode it travels in the login URL. | `undefined` | `string` | No |

### ShareVehiclesWithDimo

The `ShareVehiclesWithDimo` component allows users to share their vehicles data with DIMO.

| Parameter             | Description                                                                 | Default Value                           | Type                           | Mandatory |
|-----------------------|-----------------------------------------------------------------------------|-----------------------------------------|--------------------------------|-----------|
| `mode`                | Mode of the button (`popup`, `redirect`)                                    | N/A                                     | `"popup" \| "redirect"`        | Yes       |
| `onSuccess`           | Callback function to handle success                                         | N/A                                     | `(authData: AuthData) => void` | Yes       |
| `onError`             | Callback function to handle errors                                          | N/A                                     | `(error: Error) => void`       | Yes       |
| `permissionTemplateId`| Permissions template ID                                                     | N/A                                     | `string`                       | Yes       |
| `permissions`         | Array of permission strings to request specific access (see below)          | `undefined`                             | `string[]`                     | No        |
| `vehicles`            | List of vehicles                                                            | `undefined`                             | `string[]`                     | No        |
| `vehicleMakes`        | List of vehicle makes                                                       | `undefined`                             | `string[]`                     | No        |
| `powertrainTypes`     | List of vehicle powertrain types                                            | `undefined`                             | `string[]`                     | No        |
| `onboarding`          | List of oracles for onboarding                                              | `undefined`                             | `string[]`                     | No        |
| `expirationDate`      | Expiration date for permissions                                | `undefined`                             | `string`                       | No        |
| `authenticatedLabel`  | Label when the user is authenticated                                        | `"Share Vehicles with DIMO"`            | `string`                       | No        |
| `unAuthenticatedLabel`| Label when the user is not authenticated                                    | `"Sign in to Share Vehicles with DIMO"` | `string`                       | No        |
| `utm`                | UTM parameters for tracking (a query string)                                | `null`                                  | `string`                       | No        |
| `altTitle`           | Alternative title for the button                                            | `false`                                 | `boolean`                      | No        |
| `language`           | Language of the login screens it opens                                      | the `language` option                   | `'en' \| 'ja'`                 | No        |
| `emailRequest`       | Whether to ask for the user's email                                         | the `emailRequest` option               | `'none' \| 'optional' \| 'required'` | No        |
| `prompt`             | `'select_account'` shows the account chooser; `'login'` requires a fresh sign-in | none (the chooser after `logout()`, until a login completes) | `'select_account' \| 'login'` | No |
| `loginHint`          | Pre-fills the email on the sign-in step. In redirect mode it travels in the login URL. | `undefined` | `string` | No |

`onSuccess` receives:

| Field              | When                                                                                         |
|--------------------|----------------------------------------------------------------------------------------------|
| `token`            | Always.                                                                                      |
| `email`            | Only when the user shares their email with your app.                                        |
| `sharedVehicles`   | Token IDs of the vehicles the user shared or updated.                                       |
| `extendedVehicles` | Token IDs of vehicles whose sharing the user extended by a year (from the vehicle's Manage screen). |
| `revokedVehicles`  | Token IDs of vehicles the user stopped sharing with your app (from the vehicle's Manage screen). |

In redirect mode the same fields arrive as query parameters on your redirect URI. Repeated values are joined with commas. The SDK stores the session from a return it started (see redirect mode above) and removes `token`, `walletAddress`, `email`, `logout` and `dimoState` from the address bar, from the query and from the fragment alike (other query parameters and other fragment content stay). With `redirectResponseMode: 'fragment'` those session fields arrive in the fragment instead; the other fields stay in the query.

### Available Permissions

When using the `permissions` prop, you can include either string literals or use the `Permissions` enum for better type safety. The available permissions are:

- `NONLOCATION_TELEMETRY`: Access to non-location vehicle telemetry
- `COMMANDS`: Execute vehicle commands
- `CURRENT_LOCATION`: Access to current vehicle location
- `ALLTIME_LOCATION`: Access to historical location data
- `CREDENTIALS`: Access to VIN credentials
- `STREAMS`: Access to live data streams
- `RAW_DATA`: Access to raw vehicle data
- `APPROXIMATE_LOCATION`: Access to approximate location data

#### Example Usage:

Using string literals:
```typescript
<ShareVehiclesWithDimo
  permissions={[
    'NONLOCATION_TELEMETRY',
    'CURRENT_LOCATION',
    'STREAMS'
  ]}
  // other props...
/>
```

Using the `Permissions` enum (recommended for TypeScript projects):
```typescript
import { Permissions } from '@dimo-network/login-with-dimo';

// ...

<ShareVehiclesWithDimo
  permissions={[
    Permissions.GetNonLocationHistory,
    Permissions.GetCurrentLocation,
    Permissions.GetLocationHistory,
    Permissions.GetVINCredential,
    Permissions.GetLiveData
  ]}
  // other props...
/>
```

### ExecuteAdvancedTransactionWithDimo

The `ExecuteAdvancedTransactionWithDimo` component allows users to execute advanced web3 transactions with DIMO.

| Parameter             | Description                                                                 | Default Value                                | Type                             | Mandatory |
|-----------------------|-----------------------------------------------------------------------------|----------------------------------------------|----------------------------------|-----------|
| `mode`                | Mode of the button (`popup`, `redirect`)                                    | N/A                                          | `"popup" \| "redirect"`          | Yes       |
| `onSuccess`           | Callback function to handle success                                         | N/A                                          | `(transactionData: any) => void` | Yes       |
| `onError`             | Callback function to handle errors                                          | N/A                                          | `(error: Error) => void`         | Yes       |
| `address`             | Address for the transaction                                                 | N/A                                          | `string`                         | Yes       |
| `value`               | Value for the transaction                                                   | `""`                                         | `string`                         | No        |
| `abi`                 | ABI for the transaction                                                     | N/A                                          | `any`                            | Yes       |
| `functionName`        | Function name for the transaction                                           | N/A                                          | `string`                         | Yes       |
| `args`                | Arguments for the transaction                                               | N/A                                          | `string[]`                       | Yes       |
| `authenticatedLabel`  | Label when the user is authenticated                                        | `"Execute Advanced Transaction with Dimo"`   | `string`                         | No        |
| `unAuthenticatedLabel`| Label when the user is not authenticated                                    | `"Sign in to Execute Transaction"`           | `string`                         | No        |
| `altTitle` | Alternative title for the button | `false` | `boolean` | No |
| `prompt`               | `'select_account'` shows the account chooser; `'login'` requires a fresh sign-in | none (the chooser after `logout()`, until a login completes) | `'select_account' \| 'login'` | No |
| `loginHint`            | Pre-fills the email on the sign-in step. In redirect mode it travels in the login URL. | `undefined` | `string` | No |

### ShareAccountWithDimo, SignMessageWithDimo and ProvisionDeveloperLicenseWithDimo

These buttons have no props table of their own here; like the buttons above they also take:

| Parameter | Description | Default Value | Type | Mandatory |
|-----------|-------------|---------------|------|-----------|
| `prompt`    | `'select_account'` shows the account chooser; `'login'` requires a fresh sign-in | none (the chooser after `logout()`, until a login completes) | `'select_account' \| 'login'` | No |
| `loginHint` | Pre-fills the email on the sign-in step. In redirect mode it travels in the login URL. | `undefined` | `string` | No |

### LogoutWithDimo

The `LogoutWithDimo` component allows users to log out of their DIMO session. It clears the session data, including cookies and local storage, and updates the authentication state.

**It does not revoke tokens.** It clears the session stored by the SDK and by the login, but a token that was already issued stays valid until it expires, up to 14 days. Apps that need a hard cut-off must enforce their own session lifetime.

It remains the way to also end the session inside the login (login.dimo.org). If you only need to sign the user out of your app, call `logout()` from `useDimoAuthState()` instead; it opens no popup.

#### Example Usage

```jsx
import { LogoutWithDimo } from "@dimo-network/login-with-dimo";

<LogoutWithDimo
  mode="popup" // or "redirect"
  onSuccess={() => {}} // not called on logout; watch isAuthenticated
  onError={(error) => console.error('Logout error:', error)}
/>
```

#### Parameters

| Parameter   | Type       | Description                                      |
|-------------|------------|--------------------------------------------------|
| `mode`      | `string`   | The mode of the button (`popup` or `redirect`). |
| `onSuccess` | `function` | Required by the button type, but not called on logout yet; watch `isAuthenticated` from `useDimoAuthState()` instead.|
| `onError`   | `function` | Callback function triggered on logout error.     |
| `label`     | `string`   | Button text. Defaults to `"Logout"`.             |
| `language`  | `'en' \| 'ja'` | Language of the login screens it opens.     |

This component is fully configurable and integrates seamlessly with the SDK.
