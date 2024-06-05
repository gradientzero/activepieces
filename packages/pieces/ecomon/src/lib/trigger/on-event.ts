import { TriggerStrategy, createTrigger } from "@activepieces/pieces-framework";
import { authProp } from "../common/auth";
import { organizationProp } from "../common/organization";
import { ecomonEventTypeProp, manageEventTypeProp } from "../common/event";
import { newUuid } from "../common/uuid";
import { SubscribeWebhookParams, UnsubscribeWebhookParams, subscribeWebhook, unsubscribeWebhook } from "../common/webhook";
import { ecomonBaseUrlProp, manageBaseUrlProp } from "../common/baseUrl";

const STORE_KEY = '_new_event_trigger'
export const newOnEventTrigger = createTrigger({
    name: 'new_on_event_trigger',
    displayName: 'New Events Trigger',
    description: 'Triggers when new Events were created',
    sampleData: {
        "enabled": true,
        "organizationUuid": "879d7307-b1df-4945-a219-7f3ea3495364",
        "webhookUrl": "https://ecomon.gradient0.com/app/ecomon/api/organizations/879d7307-b1df-4945-a219-7f3ea3495364/webhooks",
        "eventType": "OrganizationAddedEvent",
    },
    props: {
        authentication: authProp,
        manageBaseUrl: manageBaseUrlProp,
        ecomonBaseUrl: ecomonBaseUrlProp,
        organizationUuid: organizationProp,
        manageEventType: manageEventTypeProp,
        ecomonEventType: ecomonEventTypeProp
    },
    type: TriggerStrategy.WEBHOOK,
    onEnable: async (context) => {
        const newAggregateUuid = newUuid()
        const manageBaseUrl = context.propsValue.manageBaseUrl
        const ecomonBaseUrl = context.propsValue.ecomonBaseUrl
        const organizationUuid = context.propsValue.organizationUuid
        const manageEventType = context.propsValue.manageEventType ?? undefined
        const ecomonEventType = context.propsValue.ecomonEventType ?? undefined
        const baseUrl = manageEventType ? manageBaseUrl : ecomonBaseUrl
        const serviceUrl = `${baseUrl}/api/organizations/${organizationUuid}/webhooks`;
        const eventType = manageEventType ? manageEventType : ecomonEventType
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
                    service: manageEventType ? 'manage' : 'ecomon',
                    organizationUuid: organizationUuid,
                    aggregateUuid: newAggregateUuid,
                })
            }
        }
    },
    onDisable: async (context) => {
        const storeData = await context.store?.get<TriggerData>(STORE_KEY)
        if (storeData) {
            const baseUrl = storeData.service === 'manage' ? context.propsValue.manageBaseUrl : context.propsValue.ecomonBaseUrl
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
