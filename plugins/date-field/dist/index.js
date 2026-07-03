// src/transformer.ts
var DateField = () => {
  return {
    name: "DateField",
    markdownPlugins() {
      return [
        () => async (_tree, file) => {
          const data = file.data;
          const fm = data.frontmatter;
          if (!fm?.date || fm.modified != null) return;
          fm.modified = fm.date;
        }
      ];
    }
  };
};
export {
  DateField
};
