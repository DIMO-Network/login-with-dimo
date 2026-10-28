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
| `language`         | Language of the login screens: `'en'`, `'ja'` or `'es'` (`'ja-JP'`, `'es-MX'` and similar also work).             | browser      |
| `tosUrl`           | Your Terms of Service, linked from the login screens instead of DIMO's.                                          | DIMO's       |
| `privacyPolicyUrl` | Your Privacy Policy, linked from the login screens instead of DIMO's.                                            | DIMO's       |

```
  initializeDimoSDK({
    ...
    options: {
      emailRequest: 'required', // 'optional' by default; 'none' never asks
      language: 'ja',
    },
  });
```

When `language` isn't set, the login shows Japanese or Spanish to users whose browser lists that language, Japanese to users whose time zone is in Japan, and English otherwise. Users can switch language on the login screens, and their choice is remembered for your app. Every button also takes a `language` prop that overrides the option for the screens it opens.

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

### The Separate DIMO Modes

With the DIMO SDK, developers have the ability to control how their users interact with DIMO.

We offer two options
- Popup Mode (best for allowing users to see both the app, as well as DIMO)
- Redirect Mode (best for developers that want to avoid popups)

**Redirect mode returns only to the page that started it.** Each redirect carries a one-time `dimoState`, and the login sends it back. The SDK accepts the returned `token`, `walletAddress`, `email` or `logout` only when `dimoState` matches what this browser tab sent. Anyone can link to your redirect URI with values of their choosing, so a link without the right `dimoState` changes nothing. That includes a console `?configurationId=` link: read its query yourself if you use one. So:

- Put your redirect URI on the same origin as the button, and open it in the same tab (the default).
- The SDK removes those values from the address bar once it has read them. Other values (`error`, `transactionHash`, `signature`, …) stay for you to read.
- This needs a Login with DIMO build that returns `dimoState`; release the login before this SDK version.

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
| `language`             | Language of the login screens it opens       | the `language` option | `'en' \| 'ja' \| 'es'` | No |
| `emailRequest`         | Whether to ask for the user's email          | the `emailRequest` option | `'none' \| 'optional' \| 'required'` | No |

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
| `language`           | Language of the login screens it opens                                      | the `language` option                   | `'en' \| 'ja' \| 'es'`         | No        |
| `emailRequest`       | Whether to ask for the user's email                                         | the `emailRequest` option               | `'none' \| 'optional' \| 'required'` | No        |

`onSuccess` receives:

| Field              | When                                                                                         |
|--------------------|----------------------------------------------------------------------------------------------|
| `token`            | Always.                                                                                      |
| `email`            | Only when the user shares their email with your app.                                        |
| `sharedVehicles`   | Token IDs of the vehicles the user shared or updated.                                       |
| `extendedVehicles` | Token IDs of vehicles whose sharing the user extended by a year (from the vehicle's Manage screen). |
| `revokedVehicles`  | Token IDs of vehicles the user stopped sharing with your app (from the vehicle's Manage screen). |

In redirect mode the same fields arrive as query parameters on your redirect URI. Repeated values are joined with commas. The SDK stores the session from a return it started (see redirect mode above) and removes `token`, `walletAddress`, `email`, `logout` and `dimoState` from the address bar; the other fields stay.

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

### LogoutWithDimo

The `LogoutWithDimo` component allows users to log out of their DIMO session. It clears the session data, including cookies and local storage, and updates the authentication state.

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
| `language`  | `'en' \| 'ja' \| 'es'` | Language of the login screens it opens. |

This component is fully configurable and integrates seamlessly with the SDK.
