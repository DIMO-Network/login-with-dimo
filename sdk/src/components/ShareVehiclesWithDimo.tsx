import React from "react";

import BaseDimoButton from "./BaseDimoButton";
import { EntryState, EventTypes } from "../enums";
import {
  DynamicButtonLabels,
  ShareBaseDimoButton,
  RedirectAuth,
} from "../types";

interface ShareVehiclesWithDimoProps
  extends ShareBaseDimoButton,
    DynamicButtonLabels,
    RedirectAuth {}

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
  utm = null,
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
        eventType: EventTypes.SHARE_VEHICLES_DATA,
        utm,
      }}
    />
  );
};

export default ShareVehiclesWithDimo;
