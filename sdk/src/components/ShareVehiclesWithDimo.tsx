import React from "react";
import BaseDimoButton from "./BaseDimoButton";
import { EntryState } from "../enums/globalEnums";

interface ShareVehiclesWithDimoProps {
  mode: "popup" | "embed" | "redirect";
  onSuccess: (authData: { token: string }) => void; // Success callback
  onError: (error: Error) => void; // Error callback
  permissionTemplateId: string; // Permissions template required for sharing
  vehicles?: string[]; // List of vehicles to share
}

const ShareVehiclesWithDimo: React.FC<ShareVehiclesWithDimoProps> = ({
  mode,
  onSuccess,
  onError,
  permissionTemplateId,
  vehicles,
}) => {
  return (
    <BaseDimoButton
      mode={mode}
      entryState={EntryState.VEHICLE_MANAGER} // Set entry state for permissions flow
      onSuccess={onSuccess}
      onError={onError}
      buttonLabel={() => "Share Vehicles with DIMO"}
      permissionTemplateId={permissionTemplateId} // Pass permissions template
      vehicles={vehicles} // Pass vehicle IDs
    />
  );
};

export default ShareVehiclesWithDimo;
