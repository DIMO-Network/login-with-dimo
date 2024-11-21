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

The Dimo Auth Provider is used to get the auth state value from the SDK, as well as to keep track of the JWT

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

const { isAuthenticated, getValidJWT() } = useDimoAuthState();
```

Based on this authenticated state, you can render the necessary Dimo components

### Using the Button Components

The following example shows both buttons being rendered, with no auth state checking
```
import {
  LoginWithDimo,
  ShareVehiclesWithDimo,
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
```

### Putting it all together

In many cases - developers may want to couple/decouple usage of these components

A common flow is
1. Show the login button, when in authenticated
2. Show the Share Vehicles button, when authenticed

This can be achieved by simply wrapping those buttons in a conditional as follows, to create a full example as follows

```
import {
  LoginWithDimo,
  ShareVehiclesWithDimo,
  initializeDimoSDK,
  useDimoAuthState,
} from "@dimo-network/login-with-dimo";

const { isAuthenticated, getValidJWT() } = useDimoAuthState();

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