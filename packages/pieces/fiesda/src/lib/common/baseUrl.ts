import { Property } from "@activepieces/pieces-framework";

export const manageBaseUrlProp = Property.ShortText({
    displayName: "Manage Base Url",
    required: true,
    defaultValue: "https://fiesda-manage.gradient0.com",
    description: "Base Url of the manage service to connect to"
});

export const fiesdaBaseUrlProp = Property.ShortText({
    displayName: "Fiesda Base Url",
    required: true,
    defaultValue: "https://fiesda-fiesda.gradient0.com",
    description: "Base Url of the fiesda service to connect to"
});
