import React, { useState } from 'react';

import {
  DimoSDKModes,
  ExecuteAdvancedTransactionWithDimo,
  initializeDimoSDK,
  LoginWithDimo,
  LogoutWithDimo,
  Permissions,
  ShareVehiclesWithDimo,
  SignMessageWithDimo,
  useDimoAuthState,
} from '@dimo-network/login-with-dimo';

import { sampleAbi } from './abi/sample-abi';

import './App.css';

// A year from when the page loads. The login app takes the date as sent, so
// a date in the past makes a share that has already expired.
const sampleExpirationDate = new Date();
sampleExpirationDate.setFullYear(sampleExpirationDate.getFullYear() + 1);

// What "Share Vehicles with DIMO" asks for. To show an app without location:
// untick the location permissions and share. To grant it: tick them and share
// again; the login app lists the vehicle as needing an update and the new
// grant adds them. Unticking never takes access away from a vehicle that's
// already shared: stop sharing it in the login app first.
const PERMISSION_OPTIONS: { permission: Permissions; label: string }[] = [
  { permission: Permissions.GetNonLocationHistory, label: 'Vehicle data' },
  { permission: Permissions.GetCurrentLocation, label: 'Current location' },
  { permission: Permissions.GetLocationHistory, label: 'All-time location' },
  {
    permission: Permissions.GetApproximateLocation,
    label: 'Approximate location',
  },
  { permission: Permissions.GetVINCredential, label: 'VIN credential' },
  { permission: Permissions.GetLiveData, label: 'Live data' },
  { permission: Permissions.GetRawData, label: 'Raw data' },
  { permission: Permissions.ExecuteCommands, label: 'Commands' },
];

const LOCATION_PERMISSIONS: Permissions[] = [
  Permissions.GetCurrentLocation,
  Permissions.GetLocationHistory,
  Permissions.GetApproximateLocation,
];

const DEFAULT_SHARE_PERMISSIONS: Permissions[] = [
  Permissions.GetNonLocationHistory,
  Permissions.GetCurrentLocation,
  Permissions.GetLocationHistory,
  Permissions.GetVINCredential,
  Permissions.GetLiveData,
];

// Kept across reloads so a redirect comes back with the same boxes ticked.
const SHARE_PERMISSIONS_KEY = 'example-dimo-auth.sharePermissions';

const loadSharePermissions = (): Permissions[] => {
  try {
    const saved = JSON.parse(
      localStorage.getItem(SHARE_PERMISSIONS_KEY) ?? 'null'
    );
    if (Array.isArray(saved)) {
      return PERMISSION_OPTIONS.map((o) => o.permission).filter((p) =>
        saved.includes(p)
      );
    }
  } catch {
    // No storage or a bad value: use the defaults.
  }
  return DEFAULT_SHARE_PERMISSIONS;
};

const saveSharePermissions = (permissions: Permissions[]) => {
  try {
    localStorage.setItem(SHARE_PERMISSIONS_KEY, JSON.stringify(permissions));
  } catch {
    // Not saved; the choice still applies until the page reloads.
  }
};

function App() {
  const [permissionsEnabled, setPermissionsEnabled] = useState(false);
  const [forceEmail, setForceEmail] = useState(false);
  const [sharePermissions, setSharePermissionsState] =
    useState<Permissions[]>(loadSharePermissions);
  const setSharePermissions = (permissions: Permissions[]) => {
    // Keep the enum's order, which is the order the SDK encodes them in.
    const ordered = PERMISSION_OPTIONS.map((o) => o.permission).filter((p) =>
      permissions.includes(p)
    );
    setSharePermissionsState(ordered);
    saveSharePermissions(ordered);
  };
  initializeDimoSDK({
    clientId: process.env.REACT_APP_DIMO_CLIENT_ID!,
    redirectUri: process.env.REACT_APP_DIMO_REDIRECT_URI!,
    environment: process.env.REACT_APP_DIMO_ENV! as
      | 'production'
      | 'development',
    apiKey: process.env.REACT_APP_DIMO_API_KEY!,
    options: {
      forceEmail,
    },
  });

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>Testing Dimo Login Button</h1>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={permissionsEnabled}
              onChange={() => setPermissionsEnabled(!permissionsEnabled)}
            />
            Enable Vehicle Manager as entry state
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={forceEmail}
              onChange={() => setForceEmail(!forceEmail)}
            />
            Force Email
          </label>
        </div>
        <SharePermissionsPicker
          selected={sharePermissions}
          onChange={setSharePermissions}
        />
        <UserData />
        <Examples
          loginType={DimoSDKModes.POPUP}
          permissionsEnabled={permissionsEnabled}
          sharePermissions={sharePermissions}
        />
        <Examples
          loginType={DimoSDKModes.REDIRECT}
          permissionsEnabled={permissionsEnabled}
          sharePermissions={sharePermissions}
        />
      </header>
    </div>
  );
}

interface Props {
  loginType: DimoSDKModes;
  permissionsEnabled?: boolean;
  sharePermissions: Permissions[];
}

const SharePermissionsPicker = ({
  selected,
  onChange,
}: {
  selected: Permissions[];
  onChange: (permissions: Permissions[]) => void;
}) => {
  const toggle = (permission: Permissions) =>
    onChange(
      selected.includes(permission)
        ? selected.filter((p) => p !== permission)
        : selected.concat(permission)
    );
  const withoutLocation = selected.filter(
    (p) => !LOCATION_PERMISSIONS.includes(p)
  );

  return (
    <fieldset className="Share-permissions">
      <legend>Permissions for "Share Vehicles with DIMO"</legend>
      {PERMISSION_OPTIONS.map(({ permission, label }) => (
        <label key={permission}>
          <input
            type="checkbox"
            checked={selected.includes(permission)}
            onChange={() => toggle(permission)}
          />
          {label} <code>{permission}</code>
        </label>
      ))}
      <div className="Share-permissions-actions">
        <button type="button" onClick={() => onChange(withoutLocation)}>
          No location
        </button>
        <button
          type="button"
          onClick={() => onChange(withoutLocation.concat(LOCATION_PERMISSIONS))}
        >
          All location
        </button>
      </div>
    </fieldset>
  );
};

const UserData = () => {
  const { isAuthenticated, email, walletAddress } = useDimoAuthState();
  if (!isAuthenticated) return null;
  return (
    <div>
      <p>Connected User</p>
      <p>Wallet Address:{walletAddress}</p>
      {!!email && <p>{email}</p>}
    </div>
  );
};

const Examples = (props: Props) => {
  const { loginType, permissionsEnabled, sharePermissions } = props;
  const onSuccess = (data: unknown) => console.log('Success:', data);
  const onError = (error: unknown) => console.log('Error:', error);
  const { isAuthenticated } = useDimoAuthState();

  return (
    <div>
      <h3>
        {loginType === DimoSDKModes.POPUP ? 'Popup' : 'Redirect'} Examples
      </h3>
      <LoginWithDimo
        mode={loginType}
        onSuccess={onSuccess}
        onError={onError}
        permissionTemplateId={permissionsEnabled ? '1' : undefined}
        utm="dimo"
      />
      {isAuthenticated && (
        <>
          {/* The SDK reads an empty list as "the default set", location
              included, so there's no button until something is ticked. */}
          {sharePermissions.length > 0 ? (
            <ShareVehiclesWithDimo
              mode={loginType}
              onSuccess={onSuccess}
              onError={onError}
              permissions={sharePermissions}
              expirationDate={sampleExpirationDate.toISOString()}
            />
          ) : (
            <p className="Share-permissions-empty">
              Tick at least one permission to share vehicles.
            </p>
          )}
          <ShareVehiclesWithDimo
            mode={loginType}
            onSuccess={onSuccess}
            onError={onError}
            authenticatedLabel={'Connect a Tesla'}
            permissionTemplateId={'2'}
            onboarding={['tesla']}
          />
          <ShareVehiclesWithDimo
            mode={loginType}
            onSuccess={onSuccess}
            onError={onError}
            authenticatedLabel={'Share ICE vehicles only'}
            permissionTemplateId={'2'}
            powertrainTypes={['ICE']}
          />
          <ShareVehiclesWithDimo
            mode={loginType}
            onSuccess={onSuccess}
            onError={onError}
            authenticatedLabel={'Share BEV vehicles only'}
            permissionTemplateId={'2'}
            powertrainTypes={['BEV']}
          />
          <AdvancedTransactionButton loginType={loginType} />
          <SignMessageButton loginType={loginType} />
          <SignHashButton loginType={loginType} />
          <LogoutWithDimo
            mode={loginType}
            onSuccess={onSuccess}
            onError={onError}
          />
        </>
      )}
    </div>
  );
};

const AdvancedTransactionButton = (props: Pick<Props, 'loginType'>) => {
  const onSuccess = (data: any) => {
    console.log(data);
    console.log('Transaction Hash:', data.transactionHash);
  };
  const onError = (error: unknown) => console.error('Error:', error);
  return (
    <ExecuteAdvancedTransactionWithDimo
      mode={props.loginType}
      onSuccess={onSuccess}
      onError={onError}
      address="0x21cFE003997fB7c2B3cfe5cf71e7833B7B2eCe10"
      abi={sampleAbi}
      functionName="transfer"
      args={['0x62b98e019e0d3e4A1Ad8C786202e09017Bd995e1', '0']}
    />
  );
};

const SignMessageButton = (props: Pick<Props, 'loginType'>) => {
  const onSuccess = (data: any) => {
    console.log('Signature:', data.signature);
    console.log('Signer:', data.signer);
  };
  const onError = (error: unknown) => console.error('Error:', error);
  return (
    <SignMessageWithDimo
      mode={props.loginType}
      onSuccess={onSuccess}
      onError={onError}
      message={`Sign in to example-dimo-auth at ${Math.floor(Date.now() / 1000)}`}
      authenticatedLabel="Sign Message"
    />
  );
};

const SignHashButton = (props: Pick<Props, 'loginType'>) => {
  const onSuccess = (data: any) => {
    console.log('Hash signature:', data.signature);
    console.log('Signer:', data.signer);
  };
  const onError = (error: unknown) => console.error('Error:', error);
  return (
    <SignMessageWithDimo
      mode={props.loginType}
      onSuccess={onSuccess}
      onError={onError}
      message={{
        raw: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
      }}
      authenticatedLabel="Sign 32-byte Hash"
    />
  );
};

export default App;
