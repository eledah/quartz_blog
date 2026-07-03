import { ViewRenderer, ViewTypeRegistration } from './types.js';
import 'preact';
import '@quartz-community/types';

/**
 * Central registry for Bases view types.
 *
 * Built-in views (table, list, cards, gallery, board) are registered at plugin
 * init time. Community plugins can register additional view types by importing
 * this singleton and calling {@link viewRegistry.register}.
 *
 * @example Community plugin registering a custom view:
 * ```ts
 * import { viewRegistry } from "@quartz-community/bases-page";
 *
 * viewRegistry.register({
 *   id: "timeline",
 *   name: "Timeline",
 *   icon: "git-branch",
 *   render: ({ entries, view }) => <div class="bases-timeline">...</div>,
 * });
 * ```
 */
declare class ViewRegistry {
    private views;
    /**
     * Register a view type. If a view with the same ID already exists it is
     * silently replaced — this lets config-level `customViews` override built-in
     * renderers for the same type.
     */
    register(registration: ViewTypeRegistration): void;
    /** Look up a registered view type by ID. */
    get(id: string): ViewTypeRegistration | undefined;
    /** Return all registered view types (insertion order). */
    getAll(): ViewTypeRegistration[];
    /** Check whether a view type is registered. */
    has(id: string): boolean;
    /** Remove a view type registration. Returns true if it existed. */
    unregister(id: string): boolean;
}
declare const viewRegistry: ViewRegistry;
/**
 * Convenience: bulk-register views from a `customViews` config record.
 * Called during plugin init to merge user-provided renderers into the registry.
 */
declare function registerCustomViews(customs: Record<string, ViewRenderer>): void;

export { registerCustomViews, viewRegistry };
