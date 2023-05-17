import { TriggerStrategy, createTrigger } from "@activepieces/pieces-framework";
import { ecomonCommon } from "../common";
import { ecomonAuth, eventTypeProp, organizationProp } from "../common/props";
import { SubscribeWebhookParams, UnsubscribeWebhookParams, subscribeWebhook, unsubscribeWebhook } from "../common/webhooks";
import { newUuid } from "../common/utils";

const STORE_KEY = 'ecomon_new_objective'
export const newObjectiveCreated = createTrigger({
    name: 'new_objective_created',
    displayName: 'Trigger: new objective',
    description: 'Triggers when a new Ecomon objective was created',
    sampleData: {
        "enabled": true,
        "organizationUuid": "879d7307-b1df-4945-a219-7f3ea3495364",
        "webhookUrl": "http://localhost:8050/api/organizations/879d7307-b1df-4945-a219-7f3ea3495364/webhooks",
        "eventType": "OrganizationAddedEvent",
        },
    props: {
        authentication: ecomonAuth,
        organization: organizationProp,
        eventType: eventTypeProp,
    },
    type: TriggerStrategy.WEBHOOK,
    onEnable: async (context) => {
        const newAggregateUuid = newUuid()
        const organizationUuid = context.propsValue.organization
        const serviceUrl = `${ecomonCommon.manageBaseUrl}/api/organizations/${organizationUuid}/webhooks`;
        const eventType = context.propsValue.eventType ?? 'invalid'
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
                aggregateUuid: newAggregateUuid,
            })
        }
    },
    onDisable: async (context) => {
        const storeData = await context.store?.get<TriggerData>(STORE_KEY)
        if (storeData) {
            const organizationUuid = context.propsValue.organization
            const serviceUrl = `${ecomonCommon.manageBaseUrl}/api/organizations/${organizationUuid}/webhooks/${storeData.aggregateUuid}`;
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
})

type TriggerData = {
    aggregateUuid: string
}