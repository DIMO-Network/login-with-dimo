import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  LoginWithDimo,
  ShareVehiclesWithDimo,
  ExecuteAdvancedTransactionWithDimo,
  initializeDimoSDK,
  useDimoAuthState,
} from "@dimo-network/login-with-dimo";
import { Abi } from "viem";

function App() {
  const [permissionsEnabled, setPermissionsEnabled] = useState(false);
  const { isAuthenticated, getValidJWT } = useDimoAuthState();

  const sampleAbi: Abi = [
    {
      type: "function",
      name: "transfer",
      stateMutability: "nonpayable",
      inputs: [
        { name: "to", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      outputs: [],
    },
  ];

  // Toggle handler
  const handleToggle = () => {
    setPermissionsEnabled(!permissionsEnabled);
  };

  initializeDimoSDK({
    clientId: process.env.REACT_APP_DIMO_CLIENT_ID!,
    redirectUri: process.env.REACT_APP_DIMO_REDIRECT_URI!,
    environment: process.env.REACT_APP_DIMO_ENV! as
      | "production"
      | "development",
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
              onChange={handleToggle}
            />
            Enable Permissions
          </label>
        </div>

        <div>
          <h3>Popup Example</h3>

          {isAuthenticated ? (
            <>
              <ShareVehiclesWithDimo
                mode="popup"
                onSuccess={(authData: any) => console.log("Success:", authData)}
                onError={(error: any) => console.error("Error:", error)}
                permissionTemplateId={"1"}
              />

              <ExecuteAdvancedTransactionWithDimo
                mode="popup"
                onSuccess={(transactionHash: any) => console.log("Success:", transactionHash)}
                onError={(error: any) => console.error("Error:", error)}
                address="0x21cFE003997fB7c2B3cfe5cf71e7833B7B2eCe10"
                value="0"
                abi={sampleAbi}
                functionName="balanceOf"
                args={["0x62b98e019e0d3e4A1Ad8C786202e09017Bd995e1", "0"]}
              />
            </>
          ) : (
            <LoginWithDimo
              mode="popup"
              onSuccess={(authData: any) => console.log("Success:", authData)}
              onError={(error: any) => console.error("Error:", error)}
              permissionTemplateId={permissionsEnabled ? "1" : undefined}
              // vehicles={["585","586"]}
            />
          )}
        </div>

        <div>
          <h3>Embed Example</h3>
          <LoginWithDimo
            mode="embed"
            onSuccess={(authData: any) => console.log("Success:", authData)}
            onError={(error: any) => console.error("Error:", error)}
            permissionTemplateId={permissionsEnabled ? "1" : undefined} // Note, not triggering re-render
            // vehicles={["585","586"]}
          />
        </div>

        <div>
          <h3>Redirect Example</h3>
          <LoginWithDimo
            mode="redirect"
            onSuccess={(authData: any) => console.log("Success:", authData)}
            onError={(error: any) => console.error("Error:", error)}
            permissionTemplateId={permissionsEnabled ? "1" : undefined}
            // vehicles={["585","586"]}
          />

          <ShareVehiclesWithDimo
            mode="redirect"
            onSuccess={(authData: any) => console.log("Success:", authData)}
            onError={(error: any) => console.error("Error:", error)}
            permissionTemplateId={"1"}
          />

          <ExecuteAdvancedTransactionWithDimo
            mode="redirect"
            onSuccess={(authData: any) => console.log("Success:", authData)}
            onError={(error: any) => console.error("Error:", error)}
            address="0x21cFE003997fB7c2B3cfe5cf71e7833B7B2eCe10"
            value="0"
            abi={sampleAbi}
            functionName="transfer"
            args={["0x62b98e019e0d3e4A1Ad8C786202e09017Bd995e1", "0"]}
          />
        </div>
      </header>
    </div>
  );
}

export default App;
