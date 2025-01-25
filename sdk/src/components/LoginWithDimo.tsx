import React from "react";

import BaseDimoButton from "./BaseDimoButton";
import { EntryState, EventTypes } from "../enums";
import {
  DynamicButtonLabels,
  ShareBaseDimoButton,
  RedirectAuth,
} from "../types";

interface LoginWithDimoProps
  extends ShareBaseDimoButton,
    DynamicButtonLabels,
    RedirectAuth {}

const LoginWithDimo: React.FC<LoginWithDimoProps> = ({
  mode,
  onSuccess,
  onError,
  permissionTemplateId,
  vehicles,
  vehicleMakes,
  expirationDate,
  authenticatedLabel = "Manage DIMO Account",
  unAuthenticatedLabel = "Continue with DIMO",
}) => {
  return (
    <BaseDimoButton
      mode={mode}
      entryState={
        permissionTemplateId
          ? EntryState.VEHICLE_MANAGER
          : EntryState.EMAIL_INPUT
      } // Go to vehicle sharing if permissions are toggled, otherwise only login
      onSuccess={onSuccess}
      onError={onError}
      buttonLabel={(authenticated) =>
        authenticated ? authenticatedLabel : unAuthenticatedLabel
      } // Dynamic label based on auth state
      disableIfAuthenticated={false} // Disable button when authenticated
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

export default LoginWithDimo;
