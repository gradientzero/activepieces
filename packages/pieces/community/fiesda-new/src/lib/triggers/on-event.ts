import { Property, TriggerStrategy, createTrigger } from '@activepieces/pieces-framework';
import { authProp } from '../common/auth';

const message = `

**Production URL:**
\`\`\`text
{{webhookUrl}}
\`\`\`

**Testing URL:**
\`\`\`text
{{webhookUrl}}/test
\`\`\`
***Use this URL for testing the webhook and saving sample data. It won't start the flow***.

**Notes:**
- If you are expecting a reply from this webhook, append **/sync** to the URL in that case, you will also have to add an HTTP step with **return response** at the end of your flow.
- If the flow takes more than **30 seconds**, it will give a **408 Request Timeout** response.
`;


// const STORE_KEY = '_new_event_trigger';
export const newOnEventTrigger = createTrigger({
  name: 'new_on_event_trigger',
  displayName: 'New Events Trigger',
  description: 'Triggers when new Events were created',
  sampleData: null,
  auth: authProp,
  props: {
    markdown: Property.MarkDown({
      value: message,
    }),
  },
  type: TriggerStrategy.WEBHOOK,
  onEnable: async () => {
    // ignore
  },
  onDisable: async () => {
    // ignore
  },
  run: async (context) => {
    return [context.payload]
  },
});

