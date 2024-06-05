import { Property, createAction } from "@activepieces/pieces-framework";
import { authProp } from "../common/auth";
import { AuthenticationType, HttpMethod, HttpRequest, httpClient } from "@activepieces/pieces-common";
import { ecomonBaseUrlProp, manageBaseUrlProp } from "../common/baseUrl";
import { organizationProp } from "../common/organization";
import { metricProp } from "../common/metric";
import { newUuid } from "../common/uuid";

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
        metricTimestamp: Property.Number({
			displayName: 'Metric Timestamp (in nanoseconds)',
			description: 'Integer timestamp in nano-seconds when new metric value was recorded',
			required: false,
		}),
	},
	async run(context) {
        const { authentication, metricUuid, ecomonBaseUrl, organizationUuid, metricValue, metricTimestamp } = context.propsValue;
        const valueUid = newUuid()
        const request: HttpRequest = {
            method: HttpMethod.POST,
            url: `${ecomonBaseUrl}/api/organizations/${organizationUuid}/metrics/${metricUuid}/values`,
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
                valueUid: valueUid,
                value: +metricValue,
                recordedAt: metricTimestamp ? +metricTimestamp : undefined,
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

