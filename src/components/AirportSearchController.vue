<template>
  <AirportSearchField
    :airports="airports"
    :label="label"
    @model-update="onFieldUpdate"
    :value="value"
  />
  <div class="my-1">
    <IconButton
      @click="onMagic"
      tooltip="Fill this field with all possible options"
      icon="mdi-creation"
    />
    <IconButton
      @click="onClear"
      tooltip="Clear all airports from field"
      icon="mdi-delete"
    />
  </div>
</template>

<script>
import getAddress from "../getAddress";
import AirportSearchField from "./AirportSearchField.vue";
import IconButton from "./IconButton.vue";
export default {
  name: "AirportSearchController",
  props: ["airports", "type", "label", "initialValue"],
  components: { AirportSearchField, IconButton },
  data() {
    return {
      value: this.initialValue,
    };
  },
  methods: {
    onFieldUpdate(value) {
      fetch(getAddress("/setPreferences"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferenceType: this.type,
          preferenceValue: value,
        }),
      })
        .then((res) => res.json())
        .then((data) => (this.value = data));
    },
    onMagic() {
      fetch(getAddress("/magicButton"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferenceType: this.type,
        }),
      })
        .then((res) => res.json())
        .then((data) => (this.value = data));
    },
    onClear() {
      this.onFieldUpdate([]);
    },
  },
};
</script>

<style></style>
