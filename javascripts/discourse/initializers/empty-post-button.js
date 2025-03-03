import { withPluginApi } from "discourse/lib/plugin-api";
import I18n from "I18n";

export default {
  name: "composer-empty-post-button",

  initialize() {
    withPluginApi("0.8", (api) => {
      const currentUser = api.getCurrentUser();

      if (!currentUser) {
        return;
      }

      if (currentUser.trust_level < settings.trust_level) {
        return;
      }

      const currentLocale = I18n.currentLocale();
      if (!I18n.translations[currentLocale].js.composer) {
        I18n.translations[currentLocale].js.composer = {};
      }

      I18n.translations[currentLocale].js.empty_post_button_title = I18n.t(themePrefix("composer_empty_post_button_title"));
      I18n.translations[currentLocale].js.composer.empty_post_button_text = I18n.t(themePrefix("composer_empty_post_button_text"));

      api.modifyClass("controller:composer", {
        pluginId: "EmptyPostButton",

        actions: {
          emptyPostButton() {
            this.get("toolbarEvent").applySurround(
              "[wrap=empty-post]<!-- ",
              " -->[/wrap]",
              "empty_post_button_text",
              { multiline: false }
            );
          },
        },
      });

      if (settings.put_in_popup_menu) {
        api.addComposerToolbarPopupMenuOption({
          icon: settings.composer_empty_post_button_icon,
          label: "empty_post_button_title",
          action: "emptyPostButton",
        });
      } else {
        api.onToolbarCreate(function(toolbar) {
          toolbar.addButton({
            trimLeading: true,
            id: "quick-empty-post",
            group: settings.composer_empty_post_button_group,
            icon: settings.composer_empty_post_button_icon,
            title: "empty_post_button_title",
            perform: function(e) {
              return e.applySurround(
                "[wrap=empty-post]<!-- ",
                " -->[/wrap]",
                "empty_post_button_text",
                { multiline: false }
              );
            }
          });
        });
      }
    });
  },
};
