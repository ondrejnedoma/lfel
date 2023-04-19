<template>
  <v-card
    class="mb-4 pa-4"
    v-for="flight in results"
    :key="flight.flightNumber"
    elevation="4"
  >
    <div class="d-flex align-center" style="gap: 32px">
      <div class="d-flex flex-column align-center" style="width: 218px">
        <h2>{{ flight.date }}</h2>
        <h1>{{ flight.flightNumber }}</h1>
      </div>
      <div class="d-flex flex-column align-center" style="width: 156px">
        <h2>{{ flight.departure }}</h2>
        <h1>{{ flight.originCode }}</h1>
        <p>{{ flight.originName }}</p>
      </div>
      <div class="d-flex flex-column align-center flex-grow-1">
        <p class="mb-2">{{ flight.duration }}</p>
        <hr class="w-100" />
        <p class="mt-2">{{ flight.operatedBy }}</p>
      </div>
      <div class="d-flex flex-column align-center" style="width: 156px">
        <h2>{{ flight.arrival }}</h2>
        <h1>{{ flight.destinationCode }}</h1>
        <p>{{ flight.destinationName }}</p>
      </div>
      <div class="d-flex flex-column align-center" style="width: 218px">
        <h1>
          {{
            flight.faresLeft > 0
              ? flight.price + " " + flight.currency
              : "Sold out"
          }}
        </h1>
        <p>
          {{ flight.faresLeft > 0 ? flight.faresLeft + " seat(s) left" : "" }}
        </p>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "SearchResults",
  props: ["results"],
};
</script>

<style></style>
