import { createRequire } from 'module';

createRequire(import.meta.url);

// src/registry.ts
var REGISTRY_KEY = /* @__PURE__ */ Symbol.for("@quartz-community/bases-page/viewRegistry");
var ViewRegistry = class {
  views = /* @__PURE__ */ new Map();
  /**
   * Register a view type. If a view with the same ID already exists it is
   * silently replaced — this lets config-level `customViews` override built-in
   * renderers for the same type.
   */
  register(registration) {
    this.views.set(registration.id, registration);
  }
  /** Look up a registered view type by ID. */
  get(id) {
    return this.views.get(id);
  }
  /** Return all registered view types (insertion order). */
  getAll() {
    return Array.from(this.views.values());
  }
  /** Check whether a view type is registered. */
  has(id) {
    return this.views.has(id);
  }
  /** Remove a view type registration. Returns true if it existed. */
  unregister(id) {
    return this.views.delete(id);
  }
};
var g = globalThis;
var viewRegistry = g[REGISTRY_KEY] ??= new ViewRegistry();
function registerCustomViews(customs) {
  for (const [id, render] of Object.entries(customs)) {
    viewRegistry.register({ id, name: id, render });
  }
}

export { registerCustomViews, viewRegistry };
//# sourceMappingURL=chunk-2AUMER56.js.map
//# sourceMappingURL=chunk-2AUMER56.js.map