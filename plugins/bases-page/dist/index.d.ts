import { QuartzPageTypePlugin, QuartzTransformerPlugin } from '@quartz-community/types';
export { PageGenerator, PageMatcher, QuartzComponent, QuartzComponentConstructor, QuartzComponentProps, QuartzPageTypePlugin, QuartzPageTypePluginInstance, QuartzTransformerPlugin, QuartzTransformerPluginInstance, TreeTransform, VirtualPage } from '@quartz-community/types';
import { BasesPageOptions, BasesData } from './types.js';
export { BasesEntry, BasesView, FilterNode, GroupBy, PropertyConfig, SortDirection, SummaryType, ViewRenderer, ViewRendererProps, ViewTypeRegistration } from './types.js';
export { _ as BasesBody } from './BasesBody-B4CEJjEp.js';
export { registerCustomViews, viewRegistry } from './registry.js';
export { compile, evaluate, evaluateFilter, resolvePropertyValue } from './compiler/index.js';
export { FullSlug, RelativeURL, TransformOptions, slugifyPath, transformLink } from '@quartz-community/utils';
import 'preact';

declare const BasesPage: QuartzPageTypePlugin<BasesPageOptions>;

/**
 * Rehype plugin that finds ` ```base ` codeblocks in the HAST tree and replaces
 * them with placeholder `<div>` elements. The parsed BasesData for each block is
 * stored on `vfile.data.basesBlocks` so it can be resolved at render time by the
 * tree-transform hook (when `allFiles` is available).
 *
 * Markdown parsers convert fenced code blocks to `<pre><code class="language-base">`.
 * Syntax highlighters (e.g. rehype-pretty-code) may transform this further to
 * `<figure><pre><code data-language="base">` with text wrapped in `<span data-line>`.
 * This plugin detects both patterns, extracts the text content, parses it as YAML
 * via `parseBasesData()`, and replaces the top-level node with a placeholder div.
 */
declare const BasesTransformer: QuartzTransformerPlugin<Partial<BasesPageOptions>>;
declare module "vfile" {
    interface DataMap {
        basesBlocks?: BasesData[];
        embeds?: string[];
    }
}

export { BasesData, BasesPage, BasesPageOptions, BasesTransformer };
