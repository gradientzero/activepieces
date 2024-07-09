import {
  AuthenticationType,
  HttpMethod,
  HttpRequest,
  httpClient,
} from '@activepieces/pieces-common';
import { Property } from '@activepieces/pieces-framework';

export const tenantProp = Property.Dropdown<string>({
  displayName: 'Tenant',
  description: 'Tenant to use',
  required: true,
  refreshers: ['auth'],
  refreshOnSearch: true,
  options: async (propsValue) => {
    const auth = propsValue['auth'];
    const fiesdaBaseUrlProp = propsValue['fiesdaBaseUrlProp'];    
    if (!auth) {
      return {
        disabled: true,
        placeholder: 'Connect specific tenant',
        options: [],
      };
    }
    const { responseBody } = await getTenants({
      token: `sa=${auth}`,
      url: `${fiesdaBaseUrlProp}/api/tenants`,
    });
    console.log('respbody: ', responseBody)
    const options: { label: string; value: string }[] = [];
    if (responseBody.items) {
      responseBody.items.forEach((item: GetTenantsResponse) => {
        options.push({
          label: item.name,
          value: item.tenantUuid,
        })
      })
    }
    return {
      disabled: false,
      placeholder: 'Tenant',
      options,
    };
  },
});

type GetTenantsParams = {
  token: string;
  url: string;
};

type GetTenantsResponse = {
  tenantUuid: string;
  name: string;
};

export const getTenants = async ({
  token,
  url,
}: GetTenantsParams) => {
  const request: HttpRequest = {
    method: HttpMethod.GET,
    url: url,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: token,
    },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const response = await httpClient.sendRequest(
    request
  );
  return {
    success: true,
    requestBody: request.body,
    responseBody: response.body,
  };
};
