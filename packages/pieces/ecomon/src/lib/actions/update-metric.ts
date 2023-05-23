import { Property, createAction } from "@activepieces/pieces-framework";
import { authProp } from "../common/auth";
import { AuthenticationType, HttpMethod, HttpRequest, httpClient } from "@activepieces/pieces-common";
import { ecomonBaseUrlProp, manageBaseUrlProp } from "../common/baseUrl";
import { organizationProp } from "../common/organization";
import { metricProp } from "../common/metric";

export const updateMetricValue = createAction({
	name: 'update_metric_value',
    displayName:'Update metric value',
    description: 'Update existing metric value',
	props: {
        authentication: authProp,
        manageBaseUrl: manageBaseUrlProp,
        ecomonBaseUrl: ecomonBaseUrlProp,
        organizationUuid: organizationProp,
        metricUuid: metricProp,
        metricValue: Property.Number({
			displayName: 'Metric Value',
			description: 'New Decimal value to send to the specific metric',
			required: true,
		}),
	},
	async run(context) {
        const { authentication, metricUuid, ecomonBaseUrl, organizationUuid, metricValue } = context.propsValue;
        const updated_at = undefined;
        const request: HttpRequest = {
            method: HttpMethod.POST,
            url: `${ecomonBaseUrl}/api/organizations/${organizationUuid}/metrics/${metricUuid}/value`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            authentication: {
                type: AuthenticationType.BEARER_TOKEN,
                token: authentication,
            },
            queryParams: {},
            body: {
                value: +metricValue,
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

