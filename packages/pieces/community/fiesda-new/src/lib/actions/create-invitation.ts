import { Property, createAction } from '@activepieces/pieces-framework';
import { authProp } from '../common/auth';
import {
  AuthenticationType,
  HttpMethod,
  HttpRequest,
  httpClient,
} from '@activepieces/pieces-common';
import { fiesdaBaseUrlProp } from '../common/baseUrl';
import { tenantProp } from '../common/tenant';
import { newUuid } from '../common/uuid';

export const sendInvitation = createAction({
  name: 'send_invitation',
  displayName: 'Send invitation',
  description: 'Send new invitation',
  auth: authProp,
  props: {
    fiesdaBaseUrl: fiesdaBaseUrlProp,
    tenantUuid: tenantProp,
    label: Property.ShortText({
      displayName: 'Email',
      description: 'Email to invite',
      required: true,
    }),
  },
  async run(context) {
    const personalToken = context.auth;
    const { label, tenantUuid } = context.propsValue;
    const request: HttpRequest = {
      method: HttpMethod.POST,
      url: `http://127.0.0.1:8090/api/tenants/${tenantUuid}/invitations`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      authentication: {
        type: AuthenticationType.BEARER_TOKEN,
        token: personalToken,
      },
      queryParams: {},
      body: {
        aggregateUuid: newUuid(),
        label: label,
      },
    };
    const response = await httpClient.sendRequest(request);
    return {
      success: true,
      request_body: request.body,
      response_body: response.body,
    };
  },
});
