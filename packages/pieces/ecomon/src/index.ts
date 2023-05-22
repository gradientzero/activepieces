import { createPiece } from "@activepieces/pieces-framework";
import packageJson from "../package.json";
import { newOnEventTrigger } from "./lib/trigger/on-event";
import { createAsset } from "./lib/actions/create-asset";

export const ecomon = createPiece({
  name: "ecomon",
  displayName: "Ecomon",
  logoUrl: "https://cdn.activepieces.com/pieces/ecomon.png",
  version: packageJson.version,
  authors: [],
  actions: [createAsset],
  triggers: [newOnEventTrigger],
});
