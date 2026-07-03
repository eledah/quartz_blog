// ../../node_modules/github-slugger/index.js
var l;
function S(n2) {
  return n2.children;
}
l = { __e: function(n2, l2, u3, t2) {
  for (var i2, r2, o2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((r2 = i2.constructor) && null != r2.getDerivedStateFromError && (i2.setState(r2.getDerivedStateFromError(n2)), o2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), o2 = i2.__d), o2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Math.random().toString(8);

// node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs
var f2 = 0;
function u2(e2, t2, n2, o2, i2, u3) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f2, __i: -1, __u: 0, __source: i2, __self: u3 };
  if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
  return l.vnode && l.vnode(l2), l2;
}

// node_modules/@quartz-community/utils/dist/index.js
function simplifySlug(fp) {
  const res = stripSlashes(trimSuffix(fp, "index"), true);
  return res.length === 0 ? "/" : res;
}
function joinSegments(...args) {
  if (args.length === 0) {
    return "";
  }
  let joined = args.filter((segment) => segment !== "" && segment !== "/").map((segment) => stripSlashes(segment)).join("/");
  const first = args[0];
  const last = args[args.length - 1];
  if (first?.startsWith("/")) {
    joined = "/" + joined;
  }
  if (last?.endsWith("/")) {
    joined = joined + "/";
  }
  return joined;
}
function endsWith(s2, suffix) {
  return s2 === suffix || s2.endsWith("/" + suffix);
}
function trimSuffix(s2, suffix) {
  if (endsWith(s2, suffix)) {
    s2 = s2.slice(0, -suffix.length);
  }
  return s2;
}
function stripSlashes(s2, onlyStripPrefix) {
  if (s2.startsWith("/")) {
    s2 = s2.substring(1);
  }
  if (!onlyStripPrefix && s2.endsWith("/")) {
    s2 = s2.slice(0, -1);
  }
  return s2;
}

// src/util/path.ts
function simplifySlug2(fp) {
  return simplifySlug(fp);
}
function resolveRelative(current, target) {
  const simplified = simplifySlug2(target);
  const rootPath = pathToRoot(current);
  return joinSegments(rootPath, simplified);
}
function pathToRoot(slug2) {
  let rootPath = slug2.split("/").filter((x2) => x2 !== "").slice(0, -1).map(() => "..").join("/");
  if (rootPath.length === 0) {
    rootPath = ".";
  }
  return rootPath;
}

// src/components/styles/featuredCards.scss
var featuredCards_default = '.featured-cards-title {\n  text-align: right;\n  margin-bottom: 1.5rem;\n  font-size: 1.75rem;\n}\n\n.card-grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-auto-rows: minmax(160px, auto);\n  gap: 1.5rem;\n  margin: 2rem 0;\n  perspective: 1000px;\n}\n@media (max-width: 600px) {\n  .card-grid {\n    grid-template-columns: 1fr;\n    grid-auto-rows: auto;\n  }\n}\n\n.card-container {\n  display: block;\n  position: relative;\n  padding: 1.5rem;\n  border-radius: 24px;\n  background-color: var(--darkgray);\n  overflow: hidden;\n  text-decoration: none;\n  transition: box-shadow 0.4s ease-in-out;\n  transform-style: preserve-3d;\n  min-height: 100px;\n  z-index: 0;\n  backdrop-filter: blur(10px);\n  background: rgba(255, 255, 255, 0.1);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);\n  will-change: transform;\n}\n\n.card-container:nth-child(1) {\n  grid-column: span 2;\n  grid-row: span 2;\n  min-height: 350px;\n}\n@media (max-width: 600px) {\n  .card-container:nth-child(1) {\n    grid-column: span 1;\n    grid-row: span 1;\n    min-height: 250px;\n  }\n}\n\n.card-container:nth-child(4) {\n  grid-column: span 3;\n}\n@media (max-width: 600px) {\n  .card-container:nth-child(4) {\n    grid-column: span 1;\n  }\n}\n\n.card-container::before {\n  content: "";\n  position: absolute;\n  inset: 0;\n  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.7) 100%);\n  border-radius: 24px;\n  z-index: 1;\n  pointer-events: none;\n  transition: background 0.4s ease-in-out;\n}\n\n.card-container:hover::before {\n  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.5) 100%);\n}\n\n.card-container:hover {\n  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);\n}\n\n.card-container.card-tilt-reset {\n  transition: transform 0.5s ease-out;\n}\n\n.card-bg {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-image: var(--card-bg);\n  background-size: cover;\n  background-position: center;\n}\n\n.card-container.has-image .card-bg {\n  filter: grayscale(70%);\n  transform: scale(1);\n  transition: filter 0.4s ease-in-out, transform 0.4s ease-in-out;\n}\n\n.card-container.has-image:hover .card-bg {\n  filter: grayscale(0%);\n  transform: scale(1.08);\n}\n\n.card-container.no-image .card-bg {\n  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%);\n  filter: none !important;\n}\n\n.card-content {\n  position: relative;\n  z-index: 2;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n}\n\n.card-content h3 {\n  margin: 0 0 0.5rem 0;\n  color: #ffffff !important;\n  font-size: 1.5rem;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n}\n\n.card-content p {\n  margin: 0;\n  color: #e5e7eb !important;\n  font-size: 1rem;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);\n}\n\n[saved-theme=dark] .card-container {\n  background: rgba(30, 30, 30, 0.8);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n}';

// src/components/FeaturedCards.tsx
var FeaturedCards = ({ allFiles, fileData }) => {
  if (fileData.slug !== "index") {
    return null;
  }
  const featuredPages = allFiles.filter((file) => file.frontmatter?.featured).sort((a2, b2) => {
    const orderA = a2.frontmatter?.order ?? Infinity;
    const orderB = b2.frontmatter?.order ?? Infinity;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    const dateA = new Date(a2.frontmatter?.date ?? 0).getTime();
    const dateB = new Date(b2.frontmatter?.date ?? 0).getTime();
    return dateB - dateA;
  }).slice(0, 4);
  const handleMouseMove = (e2) => {
    const card = e2.currentTarget;
    card.classList.remove("card-tilt-reset");
    const rect = card.getBoundingClientRect();
    const x2 = e2.clientX - rect.left;
    const y2 = e2.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y2 - centerY) / 10;
    const rotateY = (centerX - x2) / 10;
    card.style.setProperty("transform", `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, "important");
  };
  const handleMouseLeave = (e2) => {
    const card = e2.currentTarget;
    card.classList.add("card-tilt-reset");
    card.style.setProperty("transform", "rotateX(0deg) rotateY(0deg)", "important");
  };
  return /* @__PURE__ */ u2(S, { children: [
    /* @__PURE__ */ u2("h2", { class: "featured-cards-title", children: "\u{1F381} \u06CC\u0627\u062F\u062F\u0627\u0634\u062A\u200C\u0647\u0627\u06CC \u0627\u0646\u062A\u062E\u0627\u0628\u06CC" }),
    /* @__PURE__ */ u2("div", { class: "card-grid", children: featuredPages.map((page) => {
      const { title, description, image } = page.frontmatter;
      const cardStyle = image ? { "--card-bg": `url(${image})` } : {};
      return /* @__PURE__ */ u2(
        "a",
        {
          href: resolveRelative(fileData.slug, page.slug),
          class: `card-container ${image ? "has-image" : "no-image"}`,
          style: cardStyle,
          onMouseMove: handleMouseMove,
          onMouseLeave: handleMouseLeave,
          children: [
            /* @__PURE__ */ u2("div", { class: "card-bg" }),
            /* @__PURE__ */ u2("div", { class: "card-content", children: [
              /* @__PURE__ */ u2("h3", { children: title }),
              /* @__PURE__ */ u2("p", { children: description })
            ] })
          ]
        }
      );
    }) })
  ] });
};
FeaturedCards.css = featuredCards_default;
var FeaturedCards_default = (() => FeaturedCards);

// src/components/FeaturedImage.tsx
var FeaturedImage = ({ fileData }) => {
  if (fileData.slug === "index") {
    return null;
  }
  const image = fileData.frontmatter?.image;
  if (!image) {
    return null;
  }
  return /* @__PURE__ */ u2("div", { class: "featured-image-container", children: /* @__PURE__ */ u2("img", { src: image, alt: fileData.frontmatter?.title ?? "Featured image" }) });
};
FeaturedImage.css = `
  .featured-image-container {
    width: 100%;
    aspect-ratio: 16 / 9;
    margin-bottom: 2rem;
    overflow: hidden;
    border-radius: 12px;
  }

  .featured-image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }
`;
var FeaturedImage_default = (() => FeaturedImage);

export { FeaturedCards_default as FeaturedCards, FeaturedImage_default as FeaturedImage };
