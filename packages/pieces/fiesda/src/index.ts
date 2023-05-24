import { createPiece } from "@activepieces/pieces-framework";
import packageJson from "../package.json";
import { newOnEventTrigger } from "./lib/trigger/on-event";
import { createCollection } from "./lib/actions/create-collection";

export const fiesda = createPiece({
  name: "fiesda",
  displayName: "Fiesda",
  logoUrl: "https://fiesda.gradient0.com/public/fiesda.png",
  version: packageJson.version,
  authors: [],
  actions: [createCollection],
  triggers: [newOnEventTrigger],
});
