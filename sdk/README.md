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
    clientId: "YOUR CLIENT ID",
    redirectUri: "YOUR REDIRECT URI",
    apiKey: "YOUR API KEY",
    environment: "development" | "production",
  });
```

In addition to setting the dev credentials/environments, you can also set global options.

We currently support the `forceEmail` option, which means - anytime a user will be on a register/login page, they will be forced to check the email box before registering

```
  initializeDimoSDK({
    ...
    options: {
      forceEmail: true, //BY DEFAULT, this is False - users won't have to share email
    },
  });
```

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
            // omboarding={["tesla"]}  // Specify the vehicles to be accessed after login
          />

          <ShareVehiclesWithDimo
            mode="popup"
            onSuccess={(authData) => console.log("Success:", authData)} //authData will include the sharedVehicles
            onError={(error) => console.error("Error:", error)}
            permissionTemplateId={"1"} //REQUIRED: "1" is the template for all SACD permissions
            //expirationDate={} //OPTIONAL ISO STRING
            // Optionally, specify vehicles/onboarding oracles (uncomment the line below to use it)
            // vehicles={["585","586"]}  // Specify the vehicles to be accessed when triggered
            // omboarding={["tesla"]}  // Specify the vehicles to be accessed after login
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

```
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
    //expirationDate={} //OPTIONAL ISO STRING
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
    //expirationDate={} //OPTIONAL ISO STRING
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

### ShareVehiclesWithDimo

The `ShareVehiclesWithDimo` component allows users to share their vehicles data with DIMO.

| Parameter             | Description                                                                 | Default Value                           | Type                           | Mandatory |
|-----------------------|-----------------------------------------------------------------------------|-----------------------------------------|--------------------------------|-----------|
| `mode`                | Mode of the button (`popup`, `redirect`)                                    | N/A                                     | `"popup" \| "redirect"`        | Yes       |
| `onSuccess`           | Callback function to handle success                                         | N/A                                     | `(authData: AuthData) => void` | Yes       |
| `onError`             | Callback function to handle errors                                          | N/A                                     | `(error: Error) => void`       | Yes       |
| `permissionTemplateId`| Permissions template ID                                                     | N/A                                     | `string`                       | Yes       |
| `vehicles`            | List of vehicles                                                            | `undefined`                             | `string[]`                     | No        |
| `vehicleMakes`        | List of vehicle makes                                                       | `undefined`                             | `string[]`                     | No        |
| `powertrainTypes`      | List of vehicle powertrain types             | `undefined`                  | `string[]`                     | No        |
| `onboarding`        | List of oracles for onboarding                                                       | `undefined`                  | `string[]`                     | No        |
| `expirationDate`      | Expiration date for permissions                                             | `undefined`                             | `string`                       | No        |
| `authenticatedLabel`  | Label when the user is authenticated                                        | `"Share Vehicles with DIMO"`            | `string`                       | No        |
| `unAuthenticatedLabel`| Label when the user is not authenticated                                    | `"Sign in to Share Vehicles with DIMO"` | `string`                       | No        |
| `utm`                 | UTM parameters for tracking (a query string)                                                 | `null`                                  | `string`                       | No        |
| `altTitle` | Alternative title for the button | `false` | `boolean` | No |

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
