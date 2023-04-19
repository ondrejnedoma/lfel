<template>
  <v-text-field
    hide-details
    label="Number of days"
    type="number"
    v-model="localValue"
    :min="1"
  ></v-text-field>
</template>

<script>
import getAddress from "../getAddress";
export default {
  name: "NumberOfDaysControlled",
  props: ["value"],
  data() {
    return {
      localValue: this.value,
    };
  },
  watch: {
    localValue(newLocalValue, oldLocalValue) {
      if (JSON.stringify(newLocalValue) !== JSON.stringify(oldLocalValue)) {
        fetch(getAddress("/setPreferences"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            preferenceType: "numberOfDays",
            preferenceValue: this.localValue,
          }),
        });
      }
    },
  },
};
</script>

<style></style>
