import React, { useState } from 'react';
import {
  LoginWithDimo,
  ShareVehiclesWithDimo,
  ExecuteAdvancedTransactionWithDimo,
  initializeDimoSDK,
  useDimoAuthState,
} from '@dimo-network/login-with-dimo';

import { sampleAbi } from './abi/sample-abi';
import './App.css';

function App() {
  const [permissionsEnabled, setPermissionsEnabled] = useState(false);
  const [forceEmail, setForceEmail] = useState(false);
  const { isAuthenticated, email, walletAddress } = useDimoAuthState();

  const sampleExpirationDate = new Date(Date.UTC(2025, 11, 11, 18, 51)); // Note: Month is zero-based

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
            Enable Permissions
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

        {isAuthenticated && (
          <div>
            <p>Connected User</p>
            <p>Wallet Address:{walletAddress}</p>
            {email && <p>{email}</p>}
          </div>
        )}

        <div>
          <h3>Popup Example</h3>

          <LoginWithDimo
            mode="popup"
            onSuccess={(authData: any) => console.log('Success:', authData)}
            onError={(error: any) => console.error('Error:', error)}
            permissionTemplateId={permissionsEnabled ? '2' : undefined}
            unAuthenticatedLabel="Sign In with DIMO"
            // vehicles={["752", "742", "738", "722"]}
            // vehicles={["585","586"]}
            // Optional: Change the sign in title to the alternative text
            // altTitle={true}
          />

          {isAuthenticated && (
            <>
              <ShareVehiclesWithDimo
                mode="popup"
                onSuccess={(authData: any) => console.log('Success:', authData)}
                onError={(error: any) => console.error('Error:', error)}
                permissionTemplateId={'2'}
                // altTitle={true}
              />

              <ExecuteAdvancedTransactionWithDimo
                mode="popup"
                onSuccess={(transactionData: any) => {
                  console.log(transactionData);
                  console.log(
                    'Transaction Hash:',
                    transactionData.transactionHash
                  );
                }}
                onError={(error: any) => console.error('Error:', error)}
                address="0x21cFE003997fB7c2B3cfe5cf71e7833B7B2eCe10"
                abi={sampleAbi}
                functionName="transfer"
                args={['0x62b98e019e0d3e4A1Ad8C786202e09017Bd995e1', '0']}
                // altTitle={true}
              />
            </>
          )}
        </div>

        <div>
          <h3>Redirect Example</h3>
          <LoginWithDimo
            mode="redirect"
            onSuccess={(authData: any) => console.log('Success:', authData)}
            onError={(error: any) => console.error('Error:', error)}
            permissionTemplateId={permissionsEnabled ? '1' : undefined}
            // altTitle={true}
          />

          {isAuthenticated && (
            <ShareVehiclesWithDimo
              mode="redirect"
              onSuccess={(authData: any) => console.log('Success:', authData)}
              onError={(error: any) => console.error('Error:', error)}
              permissionTemplateId={'2'}
              expirationDate={sampleExpirationDate.toISOString()}
              vehicles={['752', '742']}
              // altTitle={true}
            />
          )}

          <ExecuteAdvancedTransactionWithDimo
            mode="redirect"
            onSuccess={(transactionData: any) =>
              console.log('Transaction Hash:', transactionData.transactionHash)
            }
            onError={(error: any) => console.error('Error:', error)}
            address="0x21cFE003997fB7c2B3cfe5cf71e7833B7B2eCe10"
            value="0"
            abi={sampleAbi}
            functionName="transfer"
            args={['0x62b98e019e0d3e4A1Ad8C786202e09017Bd995e1', '0']}
            authenticatedLabel="Execute Transaction"
            unAuthenticatedLabel="Sign In to Execute Transaction with DIMO"
            // Optional: Change the sign in title to the alternative text
            // altTitle={true}
          />
        </div>
      </header>
    </div>
  );
}

export default App;
