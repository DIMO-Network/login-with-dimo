// src/components/LoginWithDimo.tsx
import React, { useState } from "react";

import { popupAuth } from "../auth/popupAuth";
import { embedAuth } from "../auth/embedAuth";
import { redirectAuth } from "../auth/redirectAuth";
import "../styles/LoginWithDimo.css";

interface LoginWithDimoProps {
  mode: "popup" | "embed" | "redirect"; // The mode of login
  onSuccess: (authData: { token: string }) => void; // Success callback
  onError: (error: Error) => void; // Error callback
  clientId?: string;
  redirectUri?: string;
  apiKey?: string;
  permissionTemplateId?: string;
  vehicles?: string[];
}

const LoginWithDimo: React.FC<LoginWithDimoProps> = ({
  mode,
  onSuccess,
  onError,
  clientId,
  redirectUri,
  apiKey,
  permissionTemplateId,
  vehicles,
}) => {
  const dimoLogin = "https://ddc7c4f59158.ngrok.app/"; //TODO: Pull from ENV
  const [name, setName] = useState(false);
  const handleButtonClick = () => {
    switch (mode) {
      case "popup":
        popupAuth(
          onSuccess,
          onError,
          dimoLogin,
          clientId,
          redirectUri,
          apiKey,
          permissionTemplateId,
          vehicles
        );
        break;
      case "redirect":
        redirectAuth(
          onSuccess,
          onError,
          dimoLogin,
          clientId,
          redirectUri,
          apiKey,
          permissionTemplateId,
          vehicles
        );
        break;
      default:
        console.error("Unsupported mode for button click");
    }
  };

  // Trigger embedAuth only once the iframe has fully loaded
  const handleIframeLoad = () => {
    if (mode === "embed") {
      embedAuth(
        onSuccess,
        onError,
        dimoLogin,
        clientId,
        redirectUri,
        apiKey,
        permissionTemplateId,
        vehicles
      );
    }
  };

  // Renders iframe for embed mode
  const renderEmbedIframe = () => (
    <iframe
      id="dimo-iframe"
      src={dimoLogin} // Pull Dimo Login URL from ENV
      allow="publickey-credentials-create; publickey-credentials-get" //Note: This is used to allow passkey creation and retrieval
      width="600px"
      height="300px" //Allow this to be customized by developer
      title="Dimo Login"
      style={{ border: "4px solid white" }}
      frameBorder="0"
      onLoad={handleIframeLoad} // Trigger embedAuth when the iframe loads
    />
  );

  return (
    <div>
      {mode === "embed" ? (
        renderEmbedIframe()
      ) : (
        <button className="custom-button" onClick={handleButtonClick}>
<svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 13.0041H11.077C13.4042 13.0041 15.2272 11.2785 15.2272 9.07558C15.2272 6.87266 13.3665 4.99755 11.0787 4.99755H5.4982C4.97342 4.99755 4.54296 5.42387 4.54296 5.9436V11.8169H0V5.75847C0 2.85918 2.3821 0.5 5.30955 0.5H11.3102C16.1019 0.5 20 4.34704 20 9.07388C20 13.8007 16.1825 17.5 11.3102 17.5H0V13.0024V13.0041Z" fill="black"/>
</svg>

          <span className="button-label">Continue With DIMO</span>
        </button>
      )}
    </div>
  );
};

export default LoginWithDimo;
