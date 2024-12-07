import React from "react";
import BaseDimoButton from "./BaseDimoButton";
import { EntryState } from "../enums/globalEnums";

interface LoginWithDimoProps {
  mode: "popup" | "embed" | "redirect";
  onSuccess: (authData: { token: string }) => void; // Success callback
  onError: (error: Error) => void; // Error callback
  permissionTemplateId?: string; // Optional: Permissions template
  vehicles?: string[]; // Optional: List of vehicles  
  vehicleMakes?: string[];
}

const LoginWithDimo: React.FC<LoginWithDimoProps> = ({
  mode,
  onSuccess,
  onError,
  permissionTemplateId,
  vehicles,  
  vehicleMakes,
}) => {
  return (
    <BaseDimoButton
      mode={mode}
      entryState={permissionTemplateId ? EntryState.VEHICLE_MANAGER : EntryState.EMAIL_INPUT} // Go to vehicle sharing if permissions are toggled, otherwise only login
      onSuccess={onSuccess}
      onError={onError}
      buttonLabel={(authenticated) =>
        authenticated ? "Manage DIMO Account" : "Continue with DIMO"
      } // Dynamic label based on auth state
      disableIfAuthenticated={false} // Disable button when authenticated
      payload={{ permissionTemplateId, vehicles, vehicleMakes, eventType: "SHARE_VEHICLES_DATA" }}
    />
  );
};

export default LoginWithDimo;
