import { newUuid } from "../shared";
import {
    authProp,
    eventTypeProp,
    organizationProp,
    SubscribeWebhookParams,
    UnsubscribeWebhookParams,
    subscribeWebhook,
    unsubscribeWebhook
} from "../common";

import { DropdownState, MultiSelectDropdownProperty, OAuth2PropertyValue, Property, TriggerStrategy, createTrigger } from "@activepieces/pieces-framework";

const STORE_KEY = 'manage_new_event_trigger'
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
        organizationUuid: Property.ShortText({
			displayName: 'Organization Uuid',
			required: true,
		}),
        eventTypeSelected: Property.MultiSelectDropdown({
            displayName: 'Events To Listen To',
            description: 'Select events to trigger on',
            required: true,
            refreshers: ['authentication'],
            async options (propsValue) {
                const auth = propsValue['authentication'] as OAuth2PropertyValue
                if (!auth) {
                    return {
                        disabled: true,
                        placeholder: 'Authentication is required',
                        options: [],
                    }
                }
                const options: { label: string; value: string; }[] = [
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
                    options,
                  }
            },
        }),
        /*
        service: Property.Dropdown({
			displayName: 'Service',
            description: 'Select a service: Manage or Ecomon',
			required: true,
            refreshers: ['authentication'],
            async options (propsValue) {
                const auth = propsValue['authentication'] as OAuth2PropertyValue
                if (!auth) {
                    return {
                        disabled: true,
                        placeholder: 'Authentication is required',
                        options: [],
                    }
                }
                const options: { label: string; value: string; }[] = [
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
                    options,
                  }
            },
		}),*/
        eventTypeName: Property.ShortText({
			displayName: 'Event Typead',
			required: true,
		}),
        //organization: organizationProp,
        //eventType: eventTypeProp,
    },
    type: TriggerStrategy.WEBHOOK,
    onEnable: async (context) => {
        /*const newAggregateUuid = newUuid()
        const organizationUuid = context.propsValue.organizationUuid
        const serviceUrl = `${BaseUrl}/api/organizations/${organizationUuid}/webhooks`;
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
        */
    },
    onDisable: async (context) => {
        /*
        const storeData = await context.store?.get<TriggerData>(STORE_KEY)
        if (storeData) {
            const organizationUuid = context.propsValue.organization
            const serviceUrl = `${BaseUrl}/api/organizations/${organizationUuid}/webhooks/${storeData.aggregateUuid}`;
            const bearerToken = `sa=${context.propsValue.authentication}`
            const params: UnsubscribeWebhookParams = {
                serviceUrl: serviceUrl,
                bearerToken: bearerToken,
            }
            await unsubscribeWebhook(params)
            await context.store?.delete(STORE_KEY)
        }
        */
    },
    run: async (context) => {
        if ('item' in context.payload.body) {
            return [context.payload.body.item]
        }
        return []
    },
});

type TriggerData = {
    aggregateUuid: string
};
