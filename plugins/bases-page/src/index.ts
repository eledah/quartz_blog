// Plugin entry points
export { BasesPage } from "./pageType";
export { BasesTransformer } from "./transformer";
export { default as BasesBody } from "./components/BasesBody";

// View registry — community plugins import this to register custom views
export { viewRegistry, registerCustomViews } from "./registry";

// Compiler public API — for advanced use cases
export { compile, evaluate, evaluateFilter, resolvePropertyValue } from "./compiler";

// Types
export type {
  BasesPageOptions,
  BasesData,
  BasesView,
  BasesEntry,
  ViewRenderer,
  ViewRendererProps,
  ViewTypeRegistration,
  FilterNode,
  GroupBy,
  SummaryType,
  PropertyConfig,
  SortDirection,
} from "./types";
export type {
  QuartzComponent,
  QuartzComponentProps,
  QuartzComponentConstructor,
  QuartzPageTypePlugin,
  QuartzPageTypePluginInstance,
  QuartzTransformerPlugin,
  QuartzTransformerPluginInstance,
  TreeTransform,
  PageMatcher,
  PageGenerator,
  VirtualPage,
} from "@quartz-community/types";

// Path utilities — re-exported for community plugins that need link resolution
export { transformLink, slugifyPath } from "@quartz-community/utils";
export type { TransformOptions, FullSlug, RelativeURL } from "@quartz-community/utils";
