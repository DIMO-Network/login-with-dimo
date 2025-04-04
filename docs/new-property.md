# 🔄 Guide: Adding a New Property to an SDK Button Component (Multi-Repo)

This guide outlines the full process of adding a new property (e.g. `altTitle`) to an SDK button component and ensuring it is correctly supported across both the **DIMO SDK** and the **DIMO Webapp**.

> ⚠️ This is a multi-repo update and touches:
> - **SDK**: Button props, payload, and message handlers
> - **Webapp**: Payload parsing, credential storage, and redirect handling

> 🧠 Note: This is an area we should aim to simplify in the future.

---

## 🧭 Why It’s Complex

Adding a new property requires updating both:
- The **SDK**, to ensure the prop is typed, passed, and sent through popup/redirect handlers
- The **Webapp**, to receive the new property and ensure it's preserved across:
  - Message events
  - URL-based flows
  - External redirects (e.g., Smartcar, Tesla)

Two previous PRs that introduced support for `altTitle` are great references.
- https://github.com/DIMO-Network/dimo-login/pull/166
- https://github.com/DIMO-Network/login-with-dimo/pull/64

---

## 📦 SDK-Side Changes

### ✅ Step 1: Update the Types

- In `sdx/src/types`, extend:
  - The relevant `PayloadParams` type (BasePayload, if it's to be used across all components)
  - The `BaseButtonProps` type (for top-level button props)

```ts
interface BaseButtonProps {
  ...
  altTitle?: boolean;
}
```

### ✅ Step 2: Update `BaseDimoButton`

- Accept the new prop (e.g. `altTitle`)
- Pass it through to the relevant handlers (`popupAuth`, `redirectAuth`, etc.) by simply extracting it

### ✅ Step 3: Support in Other Buttons (if needed)

- If the new property applies globally (like a UI config), you may want to add it to all components like `LoginWithDimo`, `ShareVehiclesWithDimo`, etc.

### ✅ Step 4: Pass to Messaging Handlers

- Ensure it's sent in the `basePayload` for popup or redirect modes:

In `sdk/src/auth/redirectAuth.ts`

Update the `addParams` call to include the new param, in the array

In `sdk/src/utils/eventHandler.ts`

If this is a base property, Update the `basePayload` to include the new param, and add it to the initial message

### ✅ Step 5: Update Example App & Docs

- Add usage of the new property in the sample app (`example-dimo-auth`)
- Update README or relevant guide to reflect the new config option

---

## 🌐 Webapp-Side Changes

### ✅ Step 1: Parse the Property on Init

Depending on the type of property:

- If it's **global/non-event-specific**, parse it in `DevCredentialsContext`
- If it's passed via postMessage (popup), extract it from the message
- If it's passed via query (redirect), extract it from `window.location.search`
- If it’s encoded in a `stateUrl` (e.g. for OAuth/redirect round-trips), extract it from there too


### ✅ Step 2: Pass It into External Redirects

If any part of your flow involves:
- OAuth (e.g. Tesla, Google, Apple)
- External services

…you must update:

1. `AuthUrlParams` to support the new param
2. `buildStateParams()` to include the param
3. The receiving handler to re-parse and reintegrate the param into context

---

## ✅ Summary

To add a new property across SDK and Webapp:

### SDK
- [ ] Update prop types
- [ ] Pass into `BaseDimoButton`
- [ ] Include in payload (popup/redirect)
- [ ] Update example app and docs

### Webapp
- [ ] Parse from message or URL
- [ ] Add to context (if global)
- [ ] Ensure external redirects carry it forward

