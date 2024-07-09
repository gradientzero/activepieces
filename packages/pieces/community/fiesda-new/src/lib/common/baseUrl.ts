import { Property } from '@activepieces/pieces-framework';

export const fiesdaBaseUrlProp = Property.ShortText({
  displayName: 'Fiesda Base Url',
  required: true,
  defaultValue: 'http://127.0.0.1:8090',
  description: 'Base Url of the fiesda service to connect to',
});
