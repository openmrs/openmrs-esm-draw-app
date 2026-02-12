import { defineConfigSchema, getAsyncLifecycle } from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";

const moduleName = "@openmrs/esm-draw-app";

const options = {
  featureName: "draw",
  moduleName,
};

export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy",
);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const root = getAsyncLifecycle(
  () => import("./draw-page.component"),
  options,
);

export const drawAnnotateButton = getAsyncLifecycle(
  () => import("./draw-app-link.component"),
  options,
);

export const drawAnnotateWorkspace = getAsyncLifecycle(
  () => import("./draw-page.component"),
  options,
);
