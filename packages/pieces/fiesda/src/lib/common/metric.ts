import { AuthenticationType, HttpMethod, HttpRequest, httpClient } from "@activepieces/pieces-common";
import { Property } from "@activepieces/pieces-framework"

export const metricProp = Property.Dropdown({
  displayName: 'Metric',
  description: 'Select metric to update value for',
  required: false,
  refreshers: ['fiesdaBaseUrl', 'organizationUuid', 'authentication'],
  async options(propsValue) {
    const fiesdaBaseUrl = propsValue['fiesdaBaseUrl']
    const auth = propsValue['authentication']
    if (!fiesdaBaseUrl || !auth) {
      return {
        disabled: true,
        placeholder: 'Auth/BaseUrl required',
        options: [],
      }
    }
    const organizationUuid = propsValue['organizationUuid']
    const options: { label: string; value: string; }[] = [];
    const { responseBody } = await getMetricList({
      token: `sa=${auth}`,
      url: `${fiesdaBaseUrl}/api/organizations/${organizationUuid}/metrics`,
    });
    if (responseBody.items) {
      responseBody.items.forEach(item => {
        options.push({
          label: item.title,
          value: item.aggregateUuid,
        })
      })
    }
    return {
      disabled: false,
      placeholder: 'Metrics',
      options,
    }
  },
});

type GetMetricListParams = {
  token: string
  url: string
};

type MetricListResponse = {
    items: {
      aggregateUuid:    string
      title: string
      description: string
      unit: string
    }[]
};

export const getMetricList = async ( { token, url }: GetMetricListParams ) => {
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
  const response = await httpClient.sendRequest<MetricListResponse>(request);
  return {
    success: true,
    requestBody: request.body,
    responseBody: response.body,
  };
};

