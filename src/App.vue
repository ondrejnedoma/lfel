<template>
  <v-layout v-if="airports && preferences">
    <AppBar :initialIsDark="this.preferences.darkTheme" />
    <v-main>
      <div class="align-center mt-6 mx-6">
        <v-card class="pa-4" elevation="4">
          <AirportSearchController
            :airports="airports"
            label="Origin"
            type="origin"
            :initialValue="this.preferences.origin"
          />
          <AirportSearchController
            :airports="airports"
            label="Destination"
            type="destination"
            :initialValue="this.preferences.destination"
          />
          <NumberOfDaysController :value="this.preferences.numberOfDays" />
          <v-btn @click="onSearch" class="mt-4" color="primary">Search</v-btn>
        </v-card>
        <v-card class="pa-4 my-6" elevation="4" v-if="searchInProgress">
          <RequestProgress @complete="onSearchComplete" />
        </v-card>
        <div
          class="mt-6"
          v-if="!searchInProgress && JSON.stringify(searchResults) !== '[]'"
        >
          <SearchResults :results="searchResults" />
        </div>
      </div>
    </v-main>
  </v-layout>
</template>

<script>
import getAddress from "./getAddress";
import AppBar from "./components/AppBar.vue";
import AirportSearchController from "./components/AirportSearchController.vue";
import NumberOfDaysController from "./components/NumberOfDaysController.vue";
import RequestProgress from "./components/RequestProgress.vue";
import SearchResults from "./components/SearchResults.vue";
export default {
  name: "App",
  components: {
    AppBar,
    AirportSearchController,
    NumberOfDaysController,
    RequestProgress,
    SearchResults,
  },
  data() {
    return {
      airports: undefined,
      preferences: undefined,
      searchInProgress: false,
      searchResults: [],
    };
  },
  methods: {
    fetchAirports() {
      fetch(getAddress("/getAirports"))
        .then((res) => res.json())
        .then((data) => (this.airports = data));
    },
    fetchInitialPreferences() {
      fetch(getAddress("/getPreferences"))
        .then((res) => res.json())
        .then((data) => (this.preferences = data));
    },
    onSearch() {
      this.searchResults = [];
      this.searchInProgress = true;
    },
    onSearchComplete(results) {
      this.searchInProgress = false;
      this.searchResults = results;
    },
  },
  mounted() {
    this.fetchAirports();
    this.fetchInitialPreferences();
  },
};
</script>

<style scoped>
* {
  margin: 0;
}
</style>
