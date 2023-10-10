import { apiInitializer } from "discourse/lib/api";
import loadScript from "discourse/lib/load-script";
import I18n from "I18n";

async function applyHighlighted(element) {
  const highlighted = element.querySelectorAll("mark");
  if (!highlighted.length) {
    return;
  }
}

export default apiInitializer("0.11.1", (api) => {
  const { iconNode } = require("discourse-common/lib/icon-library");
  let icon = iconNode("highlighter");
  const currentLocale = I18n.currentLocale();
  // I18n.translations[currentLocale].js.highlighted_button_title = I18n.t(themePrefix("composer_highlighted_button_title"));
  // I18n.translations[currentLocale].js.composer.highlighted_button_text = I18n.t(themePrefix("composer_highlighted_button_text"));
  I18n.translations[currentLocale].js.highlighted_button_title = "Highlighted Text";
  I18n.translations[currentLocale].js.composer.this = "this";
  // I18n.translations[currentLocale].js.composer.highlighted_button_text = "Highlighted Text";

  api.modifyClass("controller:composer", {
    pluginId: "highlighted",
    actions: {
      highlightedButton() {
        this.get("toolbarEvent").applySurround("\n" + `<mark>` + "\n</mark>\n");
      },
    },
  });

  // add button to the toolbar
  api.onToolbarCreate((toolbar) => {
    toolbar.addButton({
      id: "composer_highlighted_button",
      group: "extras",
      icon: "highlighter",
      shortcut: "N",
      preventFocus: true,
      trimLeading: true,
      title: "highlighted_button_title",
      // perform: e => e.applySurround('<span>[wrap=highlighted]', '[/wrap]</span>', 'this')
      perform: (e) => e.applySurround("<mark>", "</mark>", "this"),
    });
  });

  api.decorateCookedElement(
    async (elem, helper) => {
      const id = helper ? `post_${helper.getModel().id}` : "composer";
      applyHighlighted(elem, id);
    },
    { id: "wrap-highlighted" }
  );
});
