import { createAction, OAuth2PropertyValue, Property } from '@activepieces/pieces-framework';
import { HttpMethod, AuthenticationType, httpClient, HttpRequest } from "@activepieces/pieces-common";
import { ecomonCommon } from '../common';
import { ecomonAuth } from '../common/props'

type MetricListResponse = {
    items: {
        aggregateUuid:  string
        keyResultUuids: string[]
        kpiUuids:       string[]
        title:          string
        description:    string
        unit:           string
        decimals:       number
        createdAt:      number
        updatedAt:      number
    }[]
}

export const updateMetric = createAction({
	name: 'update_metric',
    displayName:'Update specific metric',
    description: 'Update specific metric by using metric`s unique id',
	props: {
        authentication: ecomonAuth,
		metric_uuid: Property.ShortText({
			displayName: 'Metric Uuid',
			description: 'Uuid of the metric to send updates to',
			required: true,
		}),
        metric_value: Property.Number({
			displayName: 'Metric Value',
			description: 'New Decimal value to send to the specific metric',
			required: true,
		}),
        metric: Property.Dropdown<string>({
            displayName: 'Metric',
            description: 'Metric to update',
            required: true,
            refreshers: ['authentication'],
            async options(propsValue) {
              const auth = propsValue['authentication'] as OAuth2PropertyValue
              if (!auth) {
                return {
                  disabled: true,
                  placeholder: 'connect slack account',
                  options: [],
                }
              }
              const accessToken = auth.access_token
              const request: HttpRequest = {
                method: HttpMethod.GET,
                url: `${ecomonCommon.ecoBaseUrl}/api/metrics`,
                authentication: {
                  type: AuthenticationType.BEARER_TOKEN,
                  token: accessToken,
                },
              }
              const response = await httpClient.sendRequest<MetricListResponse>(request)
              const options = response.body.items.map(item => ({
                label: item.title,
                value: item.aggregateUuid,
              }))
              return {
                disabled: false,
                placeholder: 'Select metric',
                options,
              }
            },
        }),
        updated_at: Property.Number({
			displayName: 'Updated At',
			description: 'Timestamp for new value',
			required: false,
		}),
	},
	async run(context) {
        const {metric_uuid, metric_value, updated_at} = context.propsValue;
        const request: HttpRequest = {
            method: HttpMethod.POST,
            url: `${ecomonCommon.ecoBaseUrl}/api/metrics/${metric_uuid}/value`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            authentication: {
                type: AuthenticationType.BEARER_TOKEN,
                token: context.propsValue.authentication,
            },
            queryParams: {},
            body: {
                value: +metric_value, 
                updatedAt: updated_at ? +updated_at : undefined,
            }
        };
        const response = await httpClient.sendRequest(request);
        return {
            success: true,
            request_body: request.body,
            response_body: response.body,
        }
	},
});