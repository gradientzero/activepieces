import { AuthenticationType, HttpMethod, HttpRequest, httpClient } from "@activepieces/pieces-common";
import { Property } from "@activepieces/pieces-framework"

export const manageEventTypeProp = Property.Dropdown({
  displayName: 'EventType (manage)',
  description: 'Select event for this trigger',
  required: false,
  refreshers: ['manageBaseUrl', 'authentication'],
  async options(propsValue) {
    const manageBaseUrl = propsValue['manageBaseUrl']
    const auth = propsValue['authentication']
    if (!manageBaseUrl || !auth) {
      return {
        disabled: true,
        placeholder: 'Select Event Type',
        options: [],
      }
    }
    const options: { label: string; value: string; }[] = [];
    const { responseBody } = await getEventTypes({
      token: `sa=${auth}`,
      url: `${manageBaseUrl}/api/webhooks/eventTypes`,
    });
    if (responseBody.items) {
      responseBody.items.forEach(item => {
        options.push({
          label: item.eventType,
          value: item.eventType,
        })
      })
    }
    return {
      disabled: false,
      placeholder: 'EventType',
      options,
    }
  },
});

export const fiesdaEventTypeProp = Property.Dropdown({
    displayName: 'EventType (fiesda)',
    description: 'Select event for this trigger',
    required: false,
    refreshers: ['fiesdaBaseUrl', 'authentication'],
    async options(propsValue) {
      const fiesdaBaseUrl = propsValue['fiesdaBaseUrl']
      const auth = propsValue['authentication']
      if (!fiesdaBaseUrl || !auth) {
        return {
          disabled: true,
          placeholder: 'Select Event Type',
          options: [],
        }
      }
      const options: { label: string; value: string; }[] = [];
      const { responseBody } = await getEventTypes({
        token: `sa=${auth}`,
        url: `${fiesdaBaseUrl}/api/webhooks/eventTypes`,
      });
      if (responseBody.items) {
        responseBody.items.forEach(item => {
          options.push({
            label: item.eventType,
            value: item.eventType,
          })
        })
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

