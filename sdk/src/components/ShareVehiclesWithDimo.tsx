import React from "react";

import BaseDimoButton from "./BaseDimoButton";
import { EntryState, EventTypes } from "../enums";
import {
  DynamicButtonLabels,
  BaseButtonProps,
  BaseLoginButtonProps,
} from "../types";

type ShareVehiclesWithDimoProps = BaseButtonProps &
  BaseLoginButtonProps &
  DynamicButtonLabels;

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
  altTitle,
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
      altTitle={altTitle}
      payload={{
        permissionTemplateId,
        vehicles,
        vehicleMakes,
        expirationDate,
        eventType: EventTypes.SHARE_VEHICLES_DATA,
      }}
    />
  );
};

export default ShareVehiclesWithDimo;
