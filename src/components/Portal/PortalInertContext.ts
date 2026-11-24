import * as React from 'react';

/**
 * Whether the subtree sits behind an open modal, such as the screen behind a
 * `Dialog`.
 *
 * On the web the portal layer is `inert`, and `aria-hidden` hides it from
 * TalkBack and VoiceOver. On Android neither stops a hardware keyboard or D-pad
 * from focusing and pressing views inside it, so Paper's pressables read this
 * to step out of keyboard focus themselves.
 */
export const PortalInertContext = React.createContext(false);
