import { createPiece } from "@activepieces/pieces-framework";
import { authProp } from "./lib/common/auth";
import { sendInvitation } from "./lib/actions/create-invitation";

export const ecomonNew = createPiece({
  displayName: "Ecomon-new",
  auth: authProp,
  minimumSupportedRelease: '0.20.0',
  logoUrl: 'https://ecomon.gradient0.com/public/ecomon.png',
  authors: [],
  triggers: [],
  actions: [sendInvitation],
});
