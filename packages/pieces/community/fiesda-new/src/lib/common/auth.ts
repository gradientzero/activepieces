import { PieceAuth } from '@activepieces/pieces-framework';

export const authProp = PieceAuth.SecretText({
  displayName: 'Service Account Secret Token',
  required: true,
  description: 'Secret Token generated for a specific identity',
});
