# Login with DIMO Button

1. **SDK**: A custom SDK for the "Login with DIMO" button.

## Usage

```
          <LoginWithDimo
            mode="embed"
            onSuccess={(authData) => console.log("Success:", authData)} //auth data is an object that contains token
            onError={(error) => console.error("Error:", error)}
            clientId={process.env.REACT_APP_DIMO_CLIENT_ID}
            redirectUri={process.env.REACT_APP_DIMO_REDIRECT_URI}
            apiKey={process.env.REACT_APP_DIMO_API_KEY}
            permissionTemplateId={permissionsEnabled ? "1" : undefined} // Note, not triggering re-render
            environment={process.env.REACT_APP_DIMO_ENV}
            // vehicles={["585","586"]}
          />
```

