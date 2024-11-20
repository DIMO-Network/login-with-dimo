import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  LoginWithDimo,
  ShareVehiclesWithDimo,
  initializeDimoSDK,
} from "@dimo-network/login-with-dimo";

function App() {
  const [permissionsEnabled, setPermissionsEnabled] = useState(false);

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
          <LoginWithDimo
            mode="popup"
            onSuccess={(authData) => console.log("Success:", authData)}
            onError={(error) => console.error("Error:", error)}
            permissionTemplateId={permissionsEnabled ? "1" : undefined}
            // vehicles={["585","586"]}
          />

          <ShareVehiclesWithDimo
            mode="popup"
            onSuccess={(authData) => console.log("Success:", authData)}
            onError={(error) => console.error("Error:", error)}
            permissionTemplateId={"1"}
          />
        </div>

        <div>
          <h3>Embed Example</h3>
          {/* <LoginWithDimo
            mode="embed"
            onSuccess={(authData) => console.log("Success:", authData)}
            onError={(error) => console.error("Error:", error)}
            permissionTemplateId={permissionsEnabled ? "1" : undefined} // Note, not triggering re-render
            // vehicles={["585","586"]}
          /> */}
        </div>

        <div>
          <h3>Redirect Example</h3>
          <LoginWithDimo
            mode="redirect"
            onSuccess={(authData) => console.log("Success:", authData)}
            onError={(error) => console.error("Error:", error)}
            permissionTemplateId={permissionsEnabled ? "1" : undefined}
            // vehicles={["585","586"]}
          />

          <ShareVehiclesWithDimo
            mode="redirect"
            onSuccess={(authData) => console.log("Success:", authData)}
            onError={(error) => console.error("Error:", error)}
            permissionTemplateId={"1"}
          />
        </div>
      </header>
    </div>
  );
}

export default App;
