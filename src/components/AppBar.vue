<template>
  <v-app-bar color="primary" elevation="4">
    <v-app-bar-title class="font-weight-bold"
      >Low fares, even lower</v-app-bar-title
    >
    <template v-slot:append>
      <IconButton
        @click="onClickTheme"
        tooltip="Toggle dark theme"
        :icon="themeIcon"
      />
      <IconButton
        @click="onClickMusic"
        tooltip="Toggle music"
        :icon="musicIcon"
      />
    </template>
  </v-app-bar>
</template>

<script>
import { useTheme } from "vuetify";
import getAddress from "../getAddress";
import IconButton from "./IconButton.vue";
export default {
  name: "AppBar",
  components: {
    IconButton,
  },
  props: ["initialIsDark"],
  data() {
    return {
      theme: undefined,
      themeIcon: this.initialIsDark
        ? "mdi-moon-waning-crescent"
        : "mdi-white-balance-sunny",
      musicIcon: "mdi-music-note-off",
      audio: this.initialIsDark
        ? new Audio("evening.mp3")
        : new Audio("afternoon.mp3"),
      audioPaused: true,
    };
  },
  methods: {
    onClickTheme() {
      this.audio.pause();
      if (this.theme.global.current.dark) {
        this.setLightTheme();
        this.setDarkThemePreference(false);
      } else {
        this.setDarkTheme();
        this.setDarkThemePreference(true);
      }
      if (!this.audioPaused) {
        this.audio.play();
      }
    },
    setLightTheme() {
      this.theme.global.name = "light";
      this.audio = new Audio("afternoon.mp3");
      this.themeIcon = "mdi-white-balance-sunny";
    },
    setDarkTheme() {
      this.theme.global.name = "dark";
      this.audio = new Audio("evening.mp3");
      this.themeIcon = "mdi-moon-waning-crescent";
    },
    setDarkThemePreference(isDark) {
      fetch(getAddress("/setPreferences"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferenceType: "darkTheme",
          preferenceValue: isDark,
        }),
      });
    },
    onClickMusic() {
      if (this.audioPaused) {
        this.musicIcon = "mdi-music-note";
        this.audioPaused = false;
        this.audio.play();
      } else {
        this.musicIcon = "mdi-music-note-off";
        this.audioPaused = true;
        this.audio.pause();
      }
    },
  },
  created() {
    this.theme = useTheme();
  },
  mounted() {
    if (this.initialIsDark) {
      this.setDarkTheme();
    }
  },
};
</script>

<style></style>
