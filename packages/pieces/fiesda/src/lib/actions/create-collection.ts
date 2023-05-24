import { Property, createAction } from "@activepieces/pieces-framework";
import { authProp } from "../common/auth";
import { AuthenticationType, HttpMethod, HttpRequest, httpClient } from "@activepieces/pieces-common";
import { fiesdaBaseUrlProp, manageBaseUrlProp } from "../common/baseUrl";
import { organizationProp } from "../common/organization";
import { newUuid } from "../common/uuid";

export const createCollection = createAction({
	name: 'create_collection',
    displayName:'New collection',
    description: 'Creates new collection',
	props: {
        authentication: authProp,
        manageBaseUrl: manageBaseUrlProp,
        fiesdaBaseUrl: fiesdaBaseUrlProp,
        organizationUuid: organizationProp,
        label: Property.Number({
			displayName: 'Collection name',
			description: 'name of the new collection to create',
			required: true,
		}),
	},
	async run(context) {
        const { authentication, fiesdaBaseUrl, organizationUuid, label } = context.propsValue;
        const request: HttpRequest = {
            method: HttpMethod.POST,
            url: `${fiesdaBaseUrl}/api/organizations/${organizationUuid}/collections`,
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
                aggregateUuid: newUuid(),
                label: label,
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

