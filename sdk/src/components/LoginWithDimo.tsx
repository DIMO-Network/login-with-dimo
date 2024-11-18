import React from "react";
import BaseDimoButton from "./BaseDimoButton";
import { EntryState } from "../enums/globalEnums";

interface LoginWithDimoProps {
  mode: "popup" | "embed" | "redirect";
  onSuccess: (authData: { token: string }) => void; // Success callback
  onError: (error: Error) => void; // Error callback
  permissionTemplateId?: string; // Optional: Permissions template
  vehicles?: string[]; // Optional: List of vehicles  
}

const LoginWithDimo: React.FC<LoginWithDimoProps> = ({
  mode,
  onSuccess,
  onError,
  permissionTemplateId,
  vehicles,  
}) => {
  return (
    <BaseDimoButton
      mode={mode}
      entryState={EntryState.EMAIL_INPUT} // Default state for login
      onSuccess={onSuccess}
      onError={onError}
      buttonLabel={(authenticated) =>
        authenticated ? "Connected with DIMO" : "Continue with DIMO"
      } // Dynamic label based on auth state
      disableIfAuthenticated={true} // Disable button when authenticated
      permissionTemplateId={permissionTemplateId} // Pass permissionTemplateId if provided
      vehicles={vehicles} // Pass vehicles if provided      
    />
  );
};

export default LoginWithDimo;
