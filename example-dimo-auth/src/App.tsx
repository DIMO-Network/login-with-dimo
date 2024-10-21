import React from "react";
import logo from "./logo.svg";
import { LoginWithDimo } from "dimo-login-button-sdk";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>Testing Dimo Login Button</h1>
        </div>

        <div>
          <h3>Popup Example</h3>
          <LoginWithDimo
            mode="popup"
            onSuccess={(authData) => console.log("Success:", authData)}
            onError={(error) => console.error("Error:", error)}
          />
        </div>

        <div>
          <h3>Embed Example</h3>
          <LoginWithDimo
            mode="embed"
            onSuccess={(authData) => console.log("Success:", authData)}
            onError={(error) => console.error("Error:", error)}
          />
        </div>

        <div>
          <h3>Redirect Example</h3>
          <LoginWithDimo
            mode="redirect"
            onSuccess={(authData) => console.log("Success:", authData)}
            onError={(error) => console.error("Error:", error)}
          />
        </div>
      </header>
    </div>
  );
}

export default App;
