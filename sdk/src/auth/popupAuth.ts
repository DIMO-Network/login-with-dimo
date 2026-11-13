import { AuthPayload, DimoActionPayload } from '@dimo-types/index';
import { handleMessageForPopup } from '@utils/eventHandler';

// A second click this soon after a popup opened is a double click: it focuses
// that popup rather than open another. Two popups would share the button's
// callbacks, and closing the stray one after finishing in the other would
// report an error to the app.
export const POPUP_DOUBLE_CLICK_MS = 1000;

// The popup still waiting for an answer.
let current:
  | { popup: Window; stop: () => void; openedAt: number }
  | undefined;

export const popupAuth = (
  basePayload: AuthPayload,
  data?: DimoActionPayload
) => {
  if (
    current &&
    !current.popup.closed &&
    Date.now() - current.openedAt < POPUP_DOUBLE_CLICK_MS
  ) {
    current.popup.focus();
    return;
  }
  // A later click opens a fresh login, as every click did before. The old
  // popup is let go silently: its listener and close poll stop first, so
  // closing it reports nothing to the app. Focusing it instead would leave the
  // button looking dead where focus() can't switch to it (a popup opened as a
  // tab on a phone, left open behind the app).
  const previous = current;
  current = undefined;
  previous?.stop();
  if (previous && !previous.popup.closed) previous.popup.close();

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
      openedAt: Date.now(),
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
