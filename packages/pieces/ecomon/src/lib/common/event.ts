import { ecomonCommon } from "../shared";
import { AuthenticationType, HttpMethod, HttpRequest, httpClient } from "@activepieces/pieces-common";
import { OAuth2PropertyValue, Property, DropdownState } from "@activepieces/pieces-framework"


export const eventTypeProp = Property.Dropdown<string>({
    displayName: 'Manage Event Type',
    description: 'Manage Event Type',
    required: true,
    refreshers: ['authentication'],
    async options(propsValue) {
      const auth = propsValue['authentication'] as OAuth2PropertyValue
      if (!auth) {
        return {
          disabled: true,
          placeholder: 'Select Event Type',
          options: [],
        }
      }
      const options: { label: string; value: string; }[] = [];
      // request from manage api
      {
        const { responseBody } = await getEventTypes({
          token: `sa=${propsValue.authentication}`,
          url: `${ecomonCommon.manageBaseUrl}/api/webhooks/eventTypes`,
        });
        if (responseBody.items) {
          responseBody.items.forEach(item => {
            options.push({
              label: item.eventType + ' (manage)',
              value: item.eventType,
            })
          })
        }
      }
      // request from ecomon api
      {
        const { responseBody } = await getEventTypes({
          token: `sa=${propsValue.authentication}`,
          url: `${ecomonCommon.ecomonBaseUrl}/api/webhooks/eventTypes`,
        });
        if (responseBody.items) {
          responseBody.items.forEach(item => {
            options.push({
              label: item.eventType + ' (manage)',
              value: item.eventType,
            })
          })
        }
      }
      return {
        disabled: false,
        placeholder: 'EventType',
        options,
      }
    },
});

type GetEventTypesParams = {
  token: string
  url: string
};

type EventTypeListResponse = {
    items: {
        domain:    string
        eventType: string
    }[]
};

export const getEventTypes = async ( { token, url }: GetEventTypesParams ) => {
  const request: HttpRequest = {
    method: HttpMethod.GET,
    url: url,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: token,
    },
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  };
  const response = await httpClient.sendRequest<EventTypeListResponse>(request);
  return {
    success: true,
    requestBody: request.body,
    responseBody: response.body,
  };
};

