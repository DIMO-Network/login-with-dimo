import React from "react";
import BaseDimoButton from "./BaseDimoButton";
import { EntryState } from "../enums/globalEnums";

interface ShareVehiclesWithDimoProps {
  mode: "popup" | "embed" | "redirect";
  onSuccess: (authData: { token: string }) => void; // Success callback
  onError: (error: Error) => void; // Error callback
  permissionTemplateId: string; // Permissions template required for sharing
  vehicles?: string[]; // List of vehicles to share
  vehicleMakes?: string[];
  expirationDate?: string;
  authenticatedLabel?: string;
  unAuthenticatedLabel?: string;
}

const ShareVehiclesWithDimo: React.FC<ShareVehiclesWithDimoProps> = ({
  mode,
  onSuccess,
  onError,
  permissionTemplateId,
  vehicles,
  vehicleMakes,
  expirationDate,
  authenticatedLabel = "Share Vehicles with DIMO",
  unAuthenticatedLabel = "Sign in to Share Vehicles with DIMO",
}) => {
  return (
    <BaseDimoButton
      mode={mode}
      entryState={EntryState.VEHICLE_MANAGER} // Set entry state for permissions flow
      onSuccess={onSuccess}
      onError={onError}
      buttonLabel={(authenticated) =>
        authenticated ? authenticatedLabel : unAuthenticatedLabel
      }
      payload={{
        permissionTemplateId,
        vehicles,
        vehicleMakes,
        expirationDate,
        eventType: "SHARE_VEHICLES_DATA",
      }}
    />
  );
};

export default ShareVehiclesWithDimo;
