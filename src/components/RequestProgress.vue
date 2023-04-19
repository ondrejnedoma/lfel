<template>
  <div>
    <h2>Searching</h2>
    <h3>{{ progress }}% - {{ done }}/{{ total }}</h3>
    <v-progress-linear v-model="progress" color="primary" />
  </div>
</template>

<script>
import getAddress from "@/getAddress";
export default {
  name: "RequestProgress",
  emits: ["complete"],
  data() {
    return {
      done: 0,
      total: 0,
      progressInterval: setInterval(this.getSearchProgress, 3000),
    };
  },
  computed: {
    progress() {
      return Math.round((this.done / this.total) * 100);
    },
  },
  methods: {
    startSearch() {
      fetch(getAddress("/startSearch"), {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => (this.total = data.count));
    },
    getSearchProgress() {
      fetch(getAddress("/searchStatus"))
        .then((res) => res.json())
        .then((data) => {
          if (data.finished) {
            this.$emit("complete", data.results);
            clearInterval(this.progressInterval);
          } else {
            this.done = data.count;
          }
        });
    },
  },
  mounted() {
    this.startSearch();
  },
};
</script>

<style></style>
