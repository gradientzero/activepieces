import { AuthenticationType, HttpMethod, HttpRequest, httpClient } from "@activepieces/pieces-common"
import { BasicAuthPropertyValue, DropdownState, OAuth2PropertyValue, Property } from "@activepieces/pieces-framework"
import { ecomonCommon } from "."

export const ecomonAuth = Property.SecretText({
  displayName: "Service Account Secret Token",
  required: true,
  description: "Secret Token generated for a specific identity"
});

export const organizationProp = Property.Dropdown<string>({
  displayName: 'Organization',
  description: 'Organization to use',
  required: true,
  refreshers: ['authentication'],
  async options(propsValue) {
      return await organizationListOpts(propsValue)
  },
});

type OrganizationListResponse = {
  items: {
      aggregateUuid:  string
      name:          string
      description:    string
      createdAt:      number
      updatedAt:      number
  }[]
}

export const organizationListOpts = async function (propsValue: Record<string, string | number | object | unknown[] | BasicAuthPropertyValue | OAuth2PropertyValue | undefined>): Promise<DropdownState<string>> {
  const auth = propsValue['authentication'] as OAuth2PropertyValue
  if (!auth) {
    return {
      disabled: true,
      placeholder: 'connect specific organization',
      options: [],
    }
  }
  const request: HttpRequest = {
    method: HttpMethod.GET,
    url: `${ecomonCommon.manageBaseUrl}/api/organizations`,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: `sa=${propsValue.authentication}`,
    },
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }
  const response = await httpClient.sendRequest<OrganizationListResponse>(request)
  const options = response.body.items.map(item => ({
    label: item.name,
    value: item.aggregateUuid,
  }))
  return {
    disabled: false,
    placeholder: 'Select organization',
    options,
  }
}



type EventTypeListResponse = {
  items: {
      domain:    string
      eventType: string
  }[]
}

export const eventTypeProp = Property.Dropdown<string>({
  displayName: 'Event Type',
  description: 'Event Type',
  required: true,
  refreshers: ['authentication'],
  async options(propsValue) {
      return await eventTypeListOpts(propsValue)
  },
})

export const eventTypeListOpts = async function (propsValue: Record<string, string | number | object | unknown[] | BasicAuthPropertyValue | OAuth2PropertyValue | undefined>): Promise<DropdownState<string>> {
  const auth = propsValue['authentication'] as OAuth2PropertyValue
  if (!auth) {
    return {
      disabled: true,
      placeholder: 'Select Event Type',
      options: [],
    }
  }
  const request: HttpRequest = {
    method: HttpMethod.GET,
    url: `${ecomonCommon.manageBaseUrl}/api/webhooks/eventTypes`,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: `sa=${propsValue.authentication}`,
    },
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }
  const response = await httpClient.sendRequest<EventTypeListResponse>(request)
  const options = response.body.items.map(item => ({
    label: item.eventType,
    value: item.eventType,
  }))
  return {
    disabled: false,
    placeholder: 'Select EventType',
    options,
  }
}
