import { createPiece, PieceAuth } from '@activepieces/pieces-framework';
import { createCollection } from './lib/actions/create-collection';
import { newOnEventTrigger } from './lib/triggers/on-event';

export const fiesdaNew = createPiece({
  displayName: 'Fiesda-new',
  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.20.0',
  logoUrl: 'https://fiesda.gradient0.com/public/fiesda.png',
  authors: [],
  actions: [createCollection],
  triggers: [newOnEventTrigger],
});
