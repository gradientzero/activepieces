import { Property } from "@activepieces/pieces-framework";

export const manageBaseUrlProp = Property.ShortText({
    displayName: "Manage Base Url",
    required: true,
    defaultValue: "https://ecomon.gradient0.com/app/manage",
    description: "Base Url of the manage service to connect to"
});

export const ecomonBaseUrlProp = Property.ShortText({
    displayName: "Ecomon Base Url",
    required: true,
    defaultValue: "https://ecomon.gradient0.com/app/ecomon",
    description: "Base Url of the ecomon service to connect to"
});
