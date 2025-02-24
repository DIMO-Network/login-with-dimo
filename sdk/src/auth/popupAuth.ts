import { BasePayload } from '@dimo-types/index';
import { handleMessageForPopup } from '@utils/eventHandler';

export const popupAuth = (
  basePayload: BasePayload,
  data?: Record<string, any> // Component-specific data
) => {
  try {
    const { dimoLogin } = basePayload;
    const popup = window.open(
      dimoLogin,
      '_blank',
      'width=500,height=600' //Allow popup to be customized by the developer
    );

    if (!popup) {
      throw new Error('Popup failed to open');
    }

    // Set up message handler for popup auth
    const cleanup = handleMessageForPopup(basePayload, data, dimoLogin, popup);
  } catch (error: unknown) {
    if (error instanceof Error) {
      basePayload.onError(error);
    } else {
      basePayload.onError(new Error('An unknown error occurred'));
    }
  }
};
