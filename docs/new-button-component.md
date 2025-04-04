# 🧱 Guide: Creating a New SDK Button Component

This guide explains how to create a new SDK button component that launches the DIMO Webapp in either **popup**, **redirect**, or (deprecated) **embed** mode using the shared `BaseDimoButton` abstraction.

---

## 🧠 Overview

All SDK button components are wrappers around a common `BaseDimoButton` which:

- Reads credentials from SDK config
- Handles popup/redirect/embed mode
- Accepts an `eventPayload` and `entryState`
- Launches the webapp with the provided data

Your custom component:

- Defines the UI-facing props (e.g. `vehicleIds`, `templateId`)
- Constructs a payload based on those props
- Passes that payload to `BaseDimoButton` with the correct entry state + event type

---

## 🪟 Step 1 — Define Your Component Props

Create a new file in `sdk/components/`, e.g. `MyNewComponent.tsx`

At the top, import base types:

```tsx
import {
  BaseButtonProps,
  DynamicButtonLabels,
  YourCustomPayloadType,
} from "@dimo-types/index";
```

Define your component's prop type:

```tsx
type MyNewComponentProps = BaseButtonProps &
  DynamicButtonLabels & {
    myCustomData: string;
    anotherParam?: boolean;
  };
```

## 🧱 Step 2 — Create the Component

Inside your file:

Have the new component accept all props needed for the base component, and then render the BaseDimoButton with the new data

```tsx
import React from "react";
import BaseDimoButton from "./BaseDimoButton";
import { EntryState, EventTypes } from "@enums/index";

const MyNewComponent: React.FC<MyNewComponentProps> = ({
  mode,
  onSuccess,
  onError,
  myCustomData,
  anotherParam,
  authenticatedLabel = "Continue with DIMO",
  unAuthenticatedLabel = "Sign in with DIMO",
  altTitle,
}) => {
  const payload = {
    eventType: EventTypes.MY_CUSTOM_EVENT,
    myCustomData,
    anotherParam,
  };

  return (
    <BaseDimoButton
      mode={mode}
      entryState={EntryState.MY_CUSTOM_VIEW}
      onSuccess={onSuccess}
      onError={onError}
      buttonLabel={(authenticated) =>
        authenticated ? authenticatedLabel : unAuthenticatedLabel
      }
      altTitle={altTitle}
      payload={payload}
    />
  );
};

export default MyNewComponent;
```

## 🧩 Step 3 — Add Types and Enums

Within `sdk/src/enums`

Define any event types, or entry states for the new component

Example

in `BaseDimo.ts`

```export enum EventTypes {
  EXECUTE_ADVANCED_TRANSACTION = "EXECUTE_ADVANCED_TRANSACTION",
  SHARE_VEHICLES_DATA = "SHARE_VEHICLES_DATA",
}
```


or in `globalEnums.ts`

```
export enum EntryState {
EMAIL_INPUT = 'EMAIL_INPUT',
OTP_INPUT = 'OTP_INPUT',
SUCCESS = 'SUCCESS',
VEHICLE_MANAGER = 'VEHICLE_MANAGER',
ADVANCED_TRANSACTION = 'ADVANCED_TRANSACTION',
ERROR = 'ERROR',
LOADING = 'LOADING',
}
```

Within `sdk/src/types`

Define your new components additional props

Example

`base.ts`

```
export interface ExecuteAdvancedTransactionButtonProps {
address: string;
value?: string;
abi: any;
functionName: string;
args: string[];
}
```


## ✅ Step 4 — Test It
You can now test the new component by rendering it in the example-dimo-auth app or in your own integration.

```tsx
<MyNewComponent
  mode="popup"
  myCustomData="1234"
  onSuccess={(res) => console.log('Success!', res)}
  onError={(err) => console.error('Error', err)}
/>
```