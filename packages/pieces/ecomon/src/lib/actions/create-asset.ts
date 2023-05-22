import { createAction, OAuth2PropertyValue, Property } from '@activepieces/pieces-framework';
import { authProp } from '../common';
/*import { HttpMethod, AuthenticationType, httpClient, HttpRequest } from "@activepieces/pieces-common";
import { BaseUrl } from '../shared';
import { AuthProp } from '../props/auth';
*/
export const createAsset = createAction({
	name: 'create_asset',
    displayName:'Create New Asset',
    description: 'uploads new asset to the platform',
	props: {
        authentication: authProp,
		metric_uuid: Property.ShortText({
			displayName: 'Metric Uuid',
			description: 'Uuid of the metric to send updates to',
			required: true,
		}),
        metricId: Property.Dropdown({
			displayName: 'Metric',
            description: 'Select a metric',
			required: true,
            refreshers: ['authentication'],
            options: async ({ authentication }) => {
                if (!authentication) {
                    return {
                        disabled: true,
                        options: [],
                        placeholder: 'Authentication is required'
                    }
                }
                try {
                    const opts: { label: string; value: string; }[] = [
                        {
                            label: 'Manage (Organizational Service)',
                            value: 'manage'
                        },
                        {
                            label: 'Ecomon (Domain-Specific Service)',
                            value: 'ecomon'
                        }
                    ];

                    return {
                        disabled: false,
                        placeholder: 'Select Service',
                        options: opts,
                    }
                } catch (e) {
                    console.error(e);
                    return {
                        disabled: false,
                        options: [],
                        placeholder: 'Select Service',
                    }
                }
            },
		}),
	},
	async run(context) {
        const {metric_uuid, } = context.propsValue;
        /*
        const request: HttpRequest = {
            method: HttpMethod.POST,
            url: `${BaseUrl}/api/metrics/${metric_uuid}/value`,
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
        */
        return {
          success: true
        }
	},
});


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
};
