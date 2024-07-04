import { createPiece, PieceAuth } from '@activepieces/pieces-framework';
import { updateMetricValue } from './lib/actions/update-metric';
import { newOnEventTrigger } from './lib/triggers/on-event';

export const ecomon = createPiece({
  displayName: 'Ecomon',
  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.20.0',
  logoUrl: 'https://ecomon.gradient0.com/public/ecomon.png',
  authors: [],
  actions: [updateMetricValue],
  triggers: [newOnEventTrigger],
});
