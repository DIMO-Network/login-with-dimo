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
            // Optionally, specify vehicles (uncomment the line below to use it)
            // vehicles={["585","586"]}  // Specify the vehicles to be accessed after login            
          />

          <ShareVehiclesWithDimo
            mode="popup"
            onSuccess={(authData) => console.log("Success:", authData)}
            onError={(error) => console.error("Error:", error)}
            permissionTemplateId={"1"} //REQUIRED: "1" is the template for all SACD permissions
            // Optionally, specify vehicles (uncomment the line below to use it)
            // vehicles={["585","586"]}  // Specify the vehicles to be accessed when triggered   
          />         

        <ExecuteAdvancedTransactionWithDimo
          mode="popup"
          onSuccess={(transactionHash: any) =>
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
2. Show the Share Vehicles and Execute Advanced Transaction button, when authenticed

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
  />

  <ExecuteAdvancedTransactionWithDimo
    mode="popup"
    onSuccess={(transactionHash: any) =>
      console.log("Success:", transactionHash)
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
    // vehicles={["585","586"]}
  />
)}
```