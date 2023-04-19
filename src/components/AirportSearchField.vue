<template>
  <v-autocomplete
    :items="airports"
    item-title="name"
    item-value="code"
    hide-details
    chips
    closable-chips
    multiple
    :label="label"
    v-model="localValue"
  >
    <template v-slot:chip="{ props, item }">
      <v-chip v-bind="props" closable pill :color="item.raw.color"
        ><span>{{ item.raw.code }}</span
        ><span class="ml-1">{{ item.raw.name }}</span></v-chip
      ></template
    >
  </v-autocomplete>
</template>

<script>
export default {
  name: "AirportSearchField",
  props: ["airports", "label", "value"],
  emits: ["model-update"],
  data() {
    return {
      localValue: this.value,
    };
  },
  watch: {
    localValue(newLocalValue, oldLocalValue) {
      if (JSON.stringify(newLocalValue) !== JSON.stringify(oldLocalValue)) {
        this.$emit("model-update", newLocalValue);
      }
    },
    value(newValue) {
      this.localValue = newValue;
    },
  },
};
</script>

<style></style>
