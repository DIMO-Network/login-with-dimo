import { AuthPayload, DimoActionPayload } from '@dimo-types/index';
import { handleMessageForPopup } from '@utils/eventHandler';

// The popup still waiting for an answer. A second click while it is open
// focuses it: two popups would share the button's callbacks, and closing the
// stray one after finishing in the other would report an error to the app.
let current: { popup: Window; stop: () => void } | undefined;

export const popupAuth = (
  basePayload: AuthPayload,
  data?: DimoActionPayload
) => {
  if (current && !current.popup.closed) {
    current.popup.focus();
    return;
  }
  // The previous popup is closed by now; drop its listener and close poll.
  current?.stop();
  current = undefined;

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
    
    const entry = {
      popup,
      stop: () => {},
    };
    entry.stop = handleMessageForPopup(basePayload, data, dimoLogin, popup, () => {
      if (current === entry) current = undefined;
    });
    current = entry;
  } catch (error: unknown) {
    if (error instanceof Error) {
      basePayload.onError(error);
    } else {
      basePayload.onError(new Error('An unknown error occurred'));
    }
  }
};
