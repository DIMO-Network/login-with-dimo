# Login with DIMO Button

This repository includes two components:

1. **SDK**: A custom SDK for the "Login with DIMO" button.
2. **Example React App**: A React application demonstrating the use of the SDK for user authentication.

### Prerequisites
The example app assumes that the DIMO auth flow (https://github.com/DIMO-Network/dimo-login) is running on http://localhost:3000. Ensure that the auth service is up and running before starting the example app to enable the full login flow.

## Getting Started

The project currently uses a file import setup for the SDK in the example app. To get everything running, follow these steps:

### Step 1: Live Build the SDK

First, navigate to the `sdk` directory and start a live build of the SDK using the following command:

```bash
npm i
```

and then

```bash
npm run watch
```

### Step 2: Run the Example App
Once the SDK is live-building, navigate to the example-dimo-auth directory and run the React app:

```
npm i
```

 and then 

```
npm start
```

This will start the example app on http://localhost:3001.


### Usage
The SDK enables the "Login with DIMO" button for user authentication.
The example app demonstrates how to integrate the SDK into a React project.
