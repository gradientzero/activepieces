import {
  AuthenticationType,
  HttpMethod,
  HttpRequest,
  httpClient,
} from '@activepieces/pieces-common';
import { Property } from '@activepieces/pieces-framework';

export const fiesdaCommon = {
  fiesdaBaseUrl: Property.ShortText({
    displayName: 'Fiesda Base Url',
    required: true,
    defaultValue: 'http://127.0.0.1:8090',
    description: 'Base Url of the fiesda service to connect to',
  }),
  tenantUuid: Property.Dropdown<string>({
    displayName: 'Tenant',
    description: 'Tenant to use',
    required: true,
    refreshers: ['fiesdaBaseUrl'],
    options: async ({ auth, fiesdaBaseUrl }) => {
      if (!auth) {
        return {
          disabled: true,
          placeholder: 'Connect your account first',
          options: [],
        };
      }
      if (!fiesdaBaseUrl) {
        return {
          disabled: true,
          placeholder: 'Select fiesda url first',
          options: [],
        };
      }
  
      const request: HttpRequest = {
        method: HttpMethod.GET,
        url: `${fiesdaBaseUrl}/api/tenants`,
        authentication: {
          type: AuthenticationType.BEARER_TOKEN,
          token: `sa=${auth}`,
        },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      };
  
      const { body } = await httpClient.sendRequest(request);
      const options: { label: string; value: string }[] = [];
      if (body.items) {
        body.items.forEach((item: GetTenantsResponse) => {
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
  }),
  groupUuid: Property.Dropdown<string>({
    displayName: 'Group',
    description: 'Select group',
    required: true,
    refreshers: ['fiesdaBaseUrl', 'tenantUuid'],
    options: async ({ auth, fiesdaBaseUrl,tenantUuid }) => {
      if (!auth) {
        return {
          disabled: true,
          placeholder: 'Connect your account first',
          options: [],
        };
      }
      if (!fiesdaBaseUrl) {
        return {
          disabled: true,
          placeholder: 'Select fiesda url first',
          options: [],
        };
      }
      if (!tenantUuid) {
        return {
          disabled: true,
          placeholder: 'Select a tenant first',
          options: [],
        };
      }
  
      const request: HttpRequest = {
        method: HttpMethod.GET,
        url: `${fiesdaBaseUrl}/api/tenants/${tenantUuid}/groups`,
        authentication: {
          type: AuthenticationType.BEARER_TOKEN,
          token: `sa=${auth}`,
        },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      };
  
      const { body } = await httpClient.sendRequest(request);
      const options: { label: string; value: string }[] = [];
      if (body.items) {
        body.items.forEach((item: GetGroupsResponse) => {
          options.push({
            label: item.name,
            value: item.groupUuid,
          })
          
        })
      }
      return {
        disabled: false,
        placeholder: 'Group',
        options,
      };
    },
  }),
  identityUuid: Property.Dropdown<string>({
    displayName: 'Identity UUID',
    description: 'Select an identity UUID',
    required: true,
    refreshers: ['fiesdaBaseUrl', 'tenantUuid'],
    options: async ({ auth, fiesdaBaseUrl,tenantUuid }) => {
      if (!auth) {
        return {
          disabled: true,
          placeholder: 'Connect your account first',
          options: [],
        };
      }
      if (!fiesdaBaseUrl) {
        return {
          disabled: true,
          placeholder: 'Select fiesda url first',
          options: [],
        };
      }
      if (!tenantUuid) {
        return {
          disabled: true,
          placeholder: 'Select a tenant first',
          options: [],
        };
      }
  
      const request: HttpRequest = {
        method: HttpMethod.GET,
        url: `${fiesdaBaseUrl}/api/tenants/${tenantUuid}/identities`,
        authentication: {
          type: AuthenticationType.BEARER_TOKEN,
          token: `sa=${auth}`,
        },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      };
  
      const { body } = await httpClient.sendRequest(request);
      const options: { label: string; value: string }[] = [];
      if (body.items) {
        body.items.forEach((item: GetIdentitiesResponse) => {
          options.push({
            label: item.identityUuid,
            value: item.identityUuid,
          })
          
        })
      }
      return {
        disabled: false,
        placeholder: 'Identity',
        options,
      };
    },
  }),
};

type GetTenantsResponse = {
  tenantUuid: string;
  name: string;
};

type GetGroupsResponse = {
  groupUuid: string;
  name: string;
};

type GetIdentitiesResponse = {
  identityUuid: string;
  name: string;
};
