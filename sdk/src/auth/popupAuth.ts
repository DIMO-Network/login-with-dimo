import { AuthPayload, DimoActionPayload } from '@dimo-types/index';
import { handleMessageForPopup } from '@utils/eventHandler';

export const popupAuth = (
  basePayload: AuthPayload,
  data?: DimoActionPayload
) => {
  try {
    const { dimoLogin } = basePayload;
    const popup = window.open(
      dimoLogin,
      '_blank',
      'width=500,height=600'
    );

    if (!popup) {
      throw new Error('Popup failed to open');
    }
    
    handleMessageForPopup(basePayload, data, dimoLogin, popup);
  } catch (error: unknown) {
    if (error instanceof Error) {
      basePayload.onError(error);
    } else {
      basePayload.onError(new Error('An unknown error occurred'));
    }
  }
};
