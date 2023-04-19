import { createApp } from "vue";
import App from "./App.vue";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import colors from "vuetify/lib/util/colors";

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: colors.blue.lighten1,
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: colors.blue.lighten1,
        },
      },
    },
  },
});

createApp(App).use(vuetify).mount("#app");
