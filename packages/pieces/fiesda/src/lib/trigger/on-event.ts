import { TriggerStrategy, createTrigger } from "@activepieces/pieces-framework";
import { authProp } from "../common/auth";
import { organizationProp } from "../common/organization";
import { fiesdaEventTypeProp, manageEventTypeProp } from "../common/event";
import { newUuid } from "../common/uuid";
import { SubscribeWebhookParams, UnsubscribeWebhookParams, subscribeWebhook, unsubscribeWebhook } from "../common/webhook";
import { fiesdaBaseUrlProp, manageBaseUrlProp } from "../common/baseUrl";

const STORE_KEY = '_new_event_trigger'
export const newOnEventTrigger = createTrigger({
    name: 'new_on_event_trigger',
    displayName: 'New Events Trigger',
    description: 'Triggers when new Events were created',
    sampleData: {
        "enabled": true,
        "organizationUuid": "879d7307-b1df-4945-a219-7f3ea3495364",
        "webhookUrl": "http://localhost:8050/api/organizations/879d7307-b1df-4945-a219-7f3ea3495364/webhooks",
        "eventType": "OrganizationAddedEvent",
    },
    props: {
        authentication: authProp,
        manageBaseUrl: manageBaseUrlProp,
        fiesdaBaseUrl: fiesdaBaseUrlProp,
        organizationUuid: organizationProp,
        manageEventType: manageEventTypeProp,
        fiesdaEventType: fiesdaEventTypeProp
    },
    type: TriggerStrategy.WEBHOOK,
    onEnable: async (context) => {
        const newAggregateUuid = newUuid()
        const manageBaseUrl = context.propsValue.manageBaseUrl
        const fiesdaBaseUrl = context.propsValue.fiesdaBaseUrl
        const organizationUuid = context.propsValue.organizationUuid
        const manageEventType = context.propsValue.manageEventType ?? undefined
        const fiesdaEventType = context.propsValue.fiesdaEventType ?? undefined
        const baseUrl = manageEventType ? manageBaseUrl : fiesdaBaseUrl
        const serviceUrl = `${baseUrl}/api/organizations/${organizationUuid}/webhooks`;
        const eventType = manageEventType ? manageEventType : fiesdaEventType
        const valid = organizationUuid && eventType && baseUrl
        if (valid) {
            const bearerToken = `sa=${context.propsValue.authentication}`
            const params: SubscribeWebhookParams = {
                newAggregateUuid: newAggregateUuid,
                serviceUrl: serviceUrl,
                webhookUrl: context.webhookUrl,
                eventType: eventType,
                bearerToken: bearerToken
            }
            const { success } = await subscribeWebhook(params)
            if (success) {
                await context.store?.put<TriggerData>(STORE_KEY, {
                    service: manageEventType ? 'manage' : 'fiesda',
                    organizationUuid: organizationUuid,
                    aggregateUuid: newAggregateUuid,
                })
            }
        }
    },
    onDisable: async (context) => {
        const storeData = await context.store?.get<TriggerData>(STORE_KEY)
        if (storeData) {
            const baseUrl = storeData.service === 'manage' ? context.propsValue.manageBaseUrl : context.propsValue.fiesdaBaseUrl
            const organizationUuid = storeData.organizationUuid
            const serviceUrl = `${baseUrl}/api/organizations/${organizationUuid}/webhooks/${storeData.aggregateUuid}`;
            const bearerToken = `sa=${context.propsValue.authentication}`
            const params: UnsubscribeWebhookParams = {
                serviceUrl: serviceUrl,
                bearerToken: bearerToken,
            }
            await unsubscribeWebhook(params)
            await context.store?.delete(STORE_KEY)
        }
    },
    run: async (context) => {
        if ('item' in context.payload.body) {
            return [context.payload.body.item]
        }
        return []
    },
});

type TriggerData = {
    service: string
    organizationUuid: string
    aggregateUuid: string
};
