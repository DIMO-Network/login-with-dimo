# Login with DIMO Button

This repository includes two components:

1. **SDK**: A custom SDK for the "Login with DIMO" button.
2. **Example React App**: A React application demonstrating the use of the SDK for user authentication.

### Prerequisites
The example app embeds/frames the DIMO auth flow (login.dimo). To test both sides locally, please make sure (https://github.com/DIMO-Network/dimo-login) is running locally, and set the BaseDimoButton endpoint to point to that port

## Getting Started

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
"@dimo-network/login-with-dimo": "file:./dimo-network-login-with-dimo-0.0.14.tgz",
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


## Publishing and Development

We recommend the following steps for pushing updates, and releasing new versions
1. Make changes on a new branch, an update the package version
2. Merge changes into development, and test on https://sample.dev.drivedimo.com
3. Merge changes into main, test on https://sample.drivedimo.com
4. Create a new release, with the new version tag
5. The new version will automatically be deployed to npm
