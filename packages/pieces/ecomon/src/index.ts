import { createPiece } from "@activepieces/pieces-framework";
import packageJson from "../package.json";
import { newOnEventTrigger } from "./lib/trigger/on-event";
import { updateMetricValue } from "./lib/actions/update-metric";

export const ecomon = createPiece({
  name: "ecomon",
  displayName: "Ecomon",
  logoUrl: "https://ecomon.gradient0.com/public/ecomon.png",
  version: packageJson.version,
  authors: [],
  actions: [updateMetricValue],
  triggers: [newOnEventTrigger],
});
