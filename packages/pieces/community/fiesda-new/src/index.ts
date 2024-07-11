import { createPiece } from '@activepieces/pieces-framework';
import { sendInvitation } from './lib/actions/create-invitation';
import { newOnEventTrigger } from './lib/triggers/on-event';
import { authProp } from './lib/common/auth';

export const fiesdaNew = createPiece({
  displayName: 'Fiesda-new',
  auth: authProp,
  minimumSupportedRelease: '0.20.0',
  logoUrl: 'https://fiesda.gradient0.com/public/fiesda.png',
  authors: [],
  actions: [sendInvitation],
  triggers: [newOnEventTrigger],
});
