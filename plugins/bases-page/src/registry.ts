import type { ViewTypeRegistration, ViewRenderer } from "./types";

/**
 * Symbol key for the global ViewRegistry singleton.
 *
 * Using a well-known Symbol on `globalThis` guarantees that all copies of this
 * module — whether loaded from different `node_modules` paths or from different
 * tsup entry points — share the exact same registry instance. Without this,
 * community plugins that bundle or install their own copy of bases-page would
 * register views into a private registry that the main bases-page never sees.
 */
const REGISTRY_KEY = Symbol.for("@quartz-community/bases-page/viewRegistry");

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
class ViewRegistry {
  private views = new Map<string, ViewTypeRegistration>();

  /**
   * Register a view type. If a view with the same ID already exists it is
   * silently replaced — this lets config-level `customViews` override built-in
   * renderers for the same type.
   */
  register(registration: ViewTypeRegistration): void {
    this.views.set(registration.id, registration);
  }

  /** Look up a registered view type by ID. */
  get(id: string): ViewTypeRegistration | undefined {
    return this.views.get(id);
  }

  /** Return all registered view types (insertion order). */
  getAll(): ViewTypeRegistration[] {
    return Array.from(this.views.values());
  }

  /** Check whether a view type is registered. */
  has(id: string): boolean {
    return this.views.has(id);
  }

  /** Remove a view type registration. Returns true if it existed. */
  unregister(id: string): boolean {
    return this.views.delete(id);
  }
}

/**
 * Singleton view registry instance, stored on `globalThis` via a well-known
 * Symbol so that all copies of this module share the same instance.
 *
 * Community plugins import this to register custom view types.
 * Built-in views are registered by `registerBuiltinViews()` during plugin init.
 */
const g = globalThis as unknown as Record<symbol, ViewRegistry>;
export const viewRegistry: ViewRegistry = (g[REGISTRY_KEY] ??= new ViewRegistry());

/**
 * Convenience: bulk-register views from a `customViews` config record.
 * Called during plugin init to merge user-provided renderers into the registry.
 */
export function registerCustomViews(customs: Record<string, ViewRenderer>): void {
  for (const [id, render] of Object.entries(customs)) {
    viewRegistry.register({ id, name: id, render });
  }
}
