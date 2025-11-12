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

The SDK exports sample React Button Components (LoginWithDimo, ShareWithDimo, ExecuteAdvancedTransactionWithDimo), as well as configuration functions (initializeDimoSDK)

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

All SDK components (e.g., <LoginWithDimo />, <ShareWithDimo />) follow the same pattern:

1. The developer initializes the SDK with credentials (clientId, redirectUri, etc).

2. The component accepts flow-specific props (e.g., vehicles, permissionTemplateId).

3. The properties are passed from the specific components to a BaseDimoButton component, where they are split into a basePayload, and an event payload

4. Both payloads, are then sent to the respective handlers based on the mode specified in the top-level components (LoginWithDimo, Share etc)

## 🧪 Local Testing Tips

1. Since the redirect flow relies entirely on url Params, it can easily be tested without actually implementing new logic, by simply appending a query param.