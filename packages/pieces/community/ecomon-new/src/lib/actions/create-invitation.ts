import { Property, createAction } from '@activepieces/pieces-framework';
import { authProp } from '../common/auth';
import {
  AuthenticationType,
  HttpMethod,
  HttpRequest,
  httpClient,
} from '@activepieces/pieces-common';
import { ecomonCommon } from '../common';
import { newUuid } from '../common/uuid';

export const sendInvitation = createAction({
  name: 'send_invitation',
  displayName: 'Send invitation',
  description: 'Send new invitation',
  auth: authProp,
  props: {
    ecomonBaseUrl: ecomonCommon.ecomonBaseUrl,
    tenantUuid: ecomonCommon.tenantUuid,
    groupUuid: ecomonCommon.groupUuid,
    identityUuid: ecomonCommon.identityUuid,
    email: Property.ShortText({
      displayName: 'Email',
      description: 'Email to invite',
      required: true,
    }),
  },
  async run(context) {
    const { ecomonBaseUrl, email, tenantUuid, groupUuid, identityUuid } = context.propsValue;
    const request: HttpRequest = {
      method: HttpMethod.POST,
      url: `${ecomonBaseUrl}/api/tenants/${tenantUuid}/invitations`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      authentication: {
        type: AuthenticationType.BEARER_TOKEN,
        token: `sa=${context.auth}`
      },
      queryParams: {},
      body: {
        email,
        groupUuids: [groupUuid],
        identityUuid,
        invitationUuid: newUuid()
      },
    };
    await httpClient.sendRequest(request);
    return {
      success: true,
    };
  },
});
