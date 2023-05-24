import { AuthenticationType, HttpMethod, HttpRequest, httpClient } from "@activepieces/pieces-common";

export type SubscribeWebhookParams = {
    newAggregateUuid: string
    serviceUrl: string
    webhookUrl: string
    eventType: string
    bearerToken: string
};

type WebhookPostRequestBody = {
    enabled: boolean
    newAggregateUuid: string
    webhookUrl: string
    eventType: string
};

export type UnsubscribeWebhookParams = {
    serviceUrl: string
    bearerToken: string
};

export const subscribeWebhook = async ( { newAggregateUuid, serviceUrl, webhookUrl, eventType, bearerToken } : SubscribeWebhookParams) => {
    const request: HttpRequest<WebhookPostRequestBody> = {
        method: HttpMethod.POST,
        url: serviceUrl,
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            enabled: true,
            newAggregateUuid: newAggregateUuid,
            webhookUrl: webhookUrl,
            eventType: eventType,
        },
        authentication: {
            type: AuthenticationType.BEARER_TOKEN,
            token: bearerToken,
        },
        queryParams: {},
    }
    const response = await httpClient.sendRequest(request)
    return {
        success: true,
        request_body: request.body,
        response_body: response.body,
    }
};

export const unsubscribeWebhook = async ( { serviceUrl, bearerToken } : UnsubscribeWebhookParams) => {
    const request: HttpRequest = {
        method: HttpMethod.DELETE,
        url: serviceUrl,
        headers: {
            'Content-Type': 'application/json'
        },
        authentication: {
            type: AuthenticationType.BEARER_TOKEN,
            token: bearerToken,
        },
        queryParams: {},
    }
    const response = await httpClient.sendRequest(request)
    return {
        success: true,
        request_body: request.body,
        response_body: response.body,
    }
};
