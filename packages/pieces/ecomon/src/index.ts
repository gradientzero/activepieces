
import { createPiece } from "@activepieces/pieces-framework";
import packageJson from "../package.json";
import { updateMetric } from "./lib/actions/update-metric";
import { newObjectiveCreated } from "./lib/triggers/objective-created";

export const ecomon = createPiece({
  name: "ecomon",
  displayName: "Ecomon",
  logoUrl: "https://cdn.activepieces.com/pieces/ecomon.png",
  version: packageJson.version,
  authors: [],
  actions: [updateMetric],
  triggers: [newObjectiveCreated],
});
