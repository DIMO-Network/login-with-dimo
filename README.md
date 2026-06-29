# Login with DIMO Button

This repository includes two components:

1. **SDK**: A custom SDK for the "Login with DIMO" button.
2. **Example React App**: A React application demonstrating the use of the SDK for user authentication.

###  🚧 Prerequisites
The example app handles buttons for the DIMO auth flow (login.dimo). To test both sides locally, please make sure (https://github.com/DIMO-Network/dimo-login) is running locally, and set the BaseDimoButton endpoint to point to that port

## ⚙️ Getting Started

The project currently uses a file import setup for the SDK in the example app. To get everything running, follow these steps:

Note: We currently don't have live build/reload support

### Step 1: Build the SDK

First, navigate to the `sdk` directory and start a live build of the SDK using the following command:

```bash
npm i
```

and then

```bash
npm run build
```

### Step 2: Pack the SDK

We want to create a .tgz file that our app can use

```bash
npm pack
```

This will create a .tgz file with the version of the SDK mentioned in package.json

### Step 3: Verifying import

Move the .tgz file from sdk, to example-dimo-auth

In example-dimo-auth, verify that the package.json is importing the correct .tgz file

Example
```bash
"@dimo-network/login-with-dimo": "file:./dimo-network-login-with-dimo-0.0.21.tgz", 
```

### Step 4: Run the Example App
Once the SDK is live-building, navigate to the example-dimo-auth directory and run the React app:

```
npm i
```

 and then 

```
npm start
```

This will start the example app on http://localhost:3001.

## Required Environment Variables

> ⚠️ To ensure the sample app runs correctly, configure the relevant environment variables.  
> Please make sure to create a `.env` file before running the app.

Create `example-dimo-auth/.env` with the following keys:

```env
REACT_APP_DIMO_CLIENT_ID=your-client-id
REACT_APP_DIMO_REDIRECT_URI=the corresponding redirect uri for your client id
REACT_APP_DIMO_ENV=development | production (development will open login.dev.dimo.org, production will open login.dimo.org)
REACT_APP_DIMO_API_KEY=your-api-key (not directly used, so can put any value here)
```

### Localhost Support

By default, the SDK opens hosted login environments (dev/prod). If you're running a local version of the Login with DIMO app, you’ll need to modify the SDK source to point to your local server:

1. Open sdk/components/BaseDimoButton.tsx

2. Replace this block:

```const dimoLogin =
    environment === 'development'
      ? 'https://login.dev.dimo.org'
      : 'https://login.dimo.org';
```

3. With your local override

```const dimoLogin =
    environment === 'development'
      ? 'http://localhost:{PORT_WITH_APP_RUNNING}'
      : 'https://login.dimo.org';
```

4. Rebuild/package the SDK


## 🚀 Publishing and Releasing

We recommend the following steps for pushing updates, and releasing new versions
1. Make changes on a new branch, an update the package version
2. Merge changes into development, and test on https://sample.dev.drivedimo.com
3. Merge changes into main, test on https://sample.drivedimo.com
4. Create a new release, with the new version tag
5. The new version will automatically be deployed to npm

## 🧠 How It Works

The SDK exports sample React Button Components (LoginWithDimo, ShareVehiclesWithDimo, ExecuteAdvancedTransactionWithDimo), as well as configuration functions (initializeDimoSDK)

The SDK then takes the properties provided within the components, and configuration, and drills them into the LIWD app, through the following launch modes
1. Popup: Opens the DIMO app in a new window and communicates via postMessage.
2. Redirect: Redirects the user to the DIMO app with data in query params.

## 🔄 Flow Overview

[ Dev App ]
   └── renders SDK Component
         ├── basePayload (credentials, config)
         └── payload (flow/eventspecific data)
                ↓
     [ popupAuth.ts / redirectAuth.ts ]
         ↓
→ popup: opens window + sends postMessage
→ redirect: builds URL with full payload
         ↓
[ DIMO Webapp ]
   └── parses payload → starts UI flow


## 📦 Component Design

All SDK components (e.g., <LoginWithDimo />, <ShareVehiclesWithDimo />) follow the same pattern:

1. The developer initializes the SDK with credentials (clientId, redirectUri, etc).

2. The component accepts flow-specific props (e.g., vehicles, permissionTemplateId).

3. The properties are passed from the specific components to a BaseDimoButton component, where they are split into a basePayload, and an event payload

4. Both payloads, are then sent to the respective handlers based on the mode specified in the top-level components (LoginWithDimo, Share etc)

## 🔑 Developer License Provisioning

`ProvisionDeveloperLicenseWithDimo` lets your app request a new DIMO developer license — or reconnect an existing one — without the user leaving your UI. It opens a popup (or redirect) to `login.dimo.org`, which handles wallet creation, on-chain registration, and key generation, then posts the result back to your app.

### When to use it

Use this component in the onboarding flow for any app that requires a DIMO developer license to operate — typically shown when a freshly logged-in user doesn't have credentials stored yet.

### Props

```tsx
<ProvisionDeveloperLicenseWithDimo
  mode={DimoSDKModes.POPUP}   // POPUP or REDIRECT
  domain="https://yourapp.com"  // your app's origin — recorded on-chain against the license
  onSuccess={(result) => { /* store credentials */ }}
  onError={(error) => { /* handle error */ }}

  // Optional — pass both to reconnect an existing license instead of minting a new one
  existingTokenId={123}
  existingClientId="0xabc…"
/>
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `mode` | `DimoSDKModes` | yes | `POPUP` or `REDIRECT` |
| `domain` | `string` | yes | Your app's origin URL — recorded on the developer license NFT |
| `onSuccess` | `(result: ProvisionResult) => void` | yes | Called with credentials when provisioning completes |
| `onError` | `(error: Error) => void` | yes | Called on any failure |
| `existingTokenId` | `number` | no | Token ID of a license to reconnect (skip mint) |
| `existingClientId` | `string` | no | Client ID of a license to reconnect (skip mint) |

### Response shape

```ts
interface ProvisionResult {
  clientId: string;  // DIMO client ID (0x-prefixed address)
  privateKey: string; // raw hex private key — no 0x prefix
  domain: string;    // the domain prop echoed back
  tokenId: number;   // on-chain token ID of the developer license NFT
}
```

### Complete example

```tsx
import {
  initializeDimoSDK,
  DimoSDKModes,
  ProvisionDeveloperLicenseWithDimo,
} from '@dimo-network/login-with-dimo';
import type { ProvisionResult } from '@dimo-network/login-with-dimo';

// Initialize once at app startup — clientId + redirectUri must already be
// registered in the DIMO Developer Console before provisioning works.
initializeDimoSDK({
  clientId: process.env.REACT_APP_DIMO_CLIENT_ID!,
  redirectUri: process.env.REACT_APP_DIMO_REDIRECT_URI!,
  environment: 'production',
});

function OnboardingPage() {
  const handleSuccess = async (result: ProvisionResult) => {
    // Persist the credentials — warn the user to save the key; it cannot
    // be retrieved again after this point
    await myApi.saveTenantCredentials({
      clientId: result.clientId,
      apiKey: result.privateKey, // raw hex, ready to use
    });

    navigate('/dashboard');
  };

  return (
    <ProvisionDeveloperLicenseWithDimo
      mode={DimoSDKModes.POPUP}
      domain="https://yourapp.com"
      onSuccess={handleSuccess}
      onError={(err) => console.error('Provision failed', err)}
    />
  );
}
```

### Reconnecting an existing license

If the user already has a developer license (e.g., they're switching devices or re-authorizing), pass the existing token ID and client ID to skip the mint step:

```tsx
<ProvisionDeveloperLicenseWithDimo
  mode={DimoSDKModes.POPUP}
  domain="https://yourapp.com"
  onSuccess={handleSuccess}
  onError={handleError}
  existingTokenId={user.licenseTokenId}
  existingClientId={user.clientId}
/>
```

### How the flow works

```
[ Your App ]
   └── renders <ProvisionDeveloperLicenseWithDimo>
         └── user clicks button
               ↓
      SDK opens popup → login.dimo.org
      (entryState=PROVISION_DEVELOPER_LICENSE)
               ↓
      [ DIMO Login popup ]
         └── authenticates user
         └── creates or reconnects developer license NFT
         └── generates private key for the license
               ↓
      popup posts { eventType: "provisionResponse", clientId, tokenId, privateKey }
               ↓
      SDK message handler validates origin, calls onSuccess(ProvisionResult)
               ↓
[ Your App ]
   └── onSuccess receives { clientId, privateKey, tokenId, domain }
   └── store credentials, close onboarding
```

### Security notes

- The private key is generated inside the DIMO popup and transmitted only via `postMessage` with strict origin validation — it never touches your server during provisioning.
- Store the private key encrypted at rest. Once the popup closes it cannot be retrieved from DIMO again.
- The `domain` prop is recorded on-chain against the license NFT — use your app's canonical origin, not `localhost`.

## 🧪 Local Testing Tips

1. Since the redirect flow relies entirely on url Params, it can easily be tested without actually implementing new logic, by simply appending a query param.