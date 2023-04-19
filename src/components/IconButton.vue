<template>
  <v-tooltip :text="tooltip" location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn
        @click="clicked"
        class="mr-2"
        v-bind="props"
        variant="text"
        :icon="icon"
      ></v-btn>
    </template>
  </v-tooltip>
</template>

<script>
export default {
  name: "IconButton",
  props: ["tooltip", "icon"],
  emits: ["click"],
  methods: {
    clicked() {
      this.$emit("click");
    },
  },
};
</script>

<style></style>
