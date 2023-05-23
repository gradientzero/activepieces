import { AuthenticationType, HttpMethod, HttpRequest, httpClient } from "@activepieces/pieces-common";
import { Property } from "@activepieces/pieces-framework";

export const organizationProp = Property.Dropdown<string>({
  displayName: 'Organization',
  description: 'Organization to use',
  required: true,
  refreshers: ['manageBaseUrl', 'authentication'],
  async options(propsValue) {
    const manageBaseUrl = propsValue['manageBaseUrl']
    const auth = propsValue['authentication']
    if (!manageBaseUrl || !auth) {
      return {
        disabled: true,
        placeholder: 'connect specific organization',
        options: [],
      }
    }
    const { responseBody } = await manageObtainIdentity({
      token: `sa=${auth}`,
      url: `${manageBaseUrl}/api/identities/obtain_identity`,
    });
    const options: { label: string; value: string; }[] = [];
    if (responseBody.item) {
      options.push({
        label: responseBody.item.organization.name,
        value: responseBody.item.organization.aggregateUuid,
      })
    }
    return {
      disabled: false,
      placeholder: 'Organization',
      options,
    }
  }
});


type ManageObtainIdentityParams = {
  token: string
  url: string
};

type ManageObtainIdentityResponse = {
  item: {
      aggregateUuid:  string
      userUuid:  string
      organization: {
        aggregateUuid:  string
        name: string
      }
  }
};

export const manageObtainIdentity = async ( { token, url }: ManageObtainIdentityParams ) => {
  const request: HttpRequest = {
    method: HttpMethod.POST,
    url: url,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: token,
    },
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  const response = await httpClient.sendRequest<ManageObtainIdentityResponse>(request);
  return {
    success: true,
    requestBody: request.body,
    responseBody: response.body,
  };
};
