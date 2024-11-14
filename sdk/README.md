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

### Example

```
import { LoginWithDimo } from "@dimo-network/login-with-dimo";

const YourComponent = () => {
  const permissionsEnabled = true;  // Set permissions flag based on your app's requirements

  return (
    <LoginWithDimo
      mode="redirect" //can be set to "redirect", "popup", or "embed"
      onSuccess={(authData) => console.log("Success:", authData)}  // Success callback, will only trigger on "embed" or "popup" modes, authData is an object, with a "token" param which represents the users JWT
      onError={(error) => console.error("Error:", error)}  // Error callback
      clientId={process.env.REACT_APP_DIMO_CLIENT_ID}  // Your Dimo Client ID
      redirectUri={process.env.REACT_APP_DIMO_REDIRECT_URI}  // Your redirect URI after login, this is relevant for the "redirect" mode
      apiKey={process.env.REACT_APP_DIMO_API_KEY}  // Your Dimo API Key (optional)
      permissionTemplateId={permissionsEnabled ? "1" : undefined}  // Permission template ID (optional, default to 1 if need to request permissions)
      environment={process.env.REACT_APP_DIMO_ENV}  // Environment setting (e.g., "production" or "development"), de
      // Optionally, specify vehicles (uncomment the line below to use it)
      // vehicles={["585","586"]}  // Specify the vehicles to be accessed after login
    />
  );
};
```


