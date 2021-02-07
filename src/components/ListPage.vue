<template>
    <div>
        <FlightList :flightList=departureFlights />
    </div>
</template>

<script lang="ts">
  import { getDateArrayTill, getFormattedFlightData, getMergedArray } from "@/helpers/utils";
  import store from "../store";
  import FlightList from "@/components/FlightList.vue";

  export default {
    name: "ListPageComponent",
    components: { FlightList },
    data() {
      return {
        loading: false,
        incorrectData: false
      }
    },
    methods: {},
    computed: {
      departureFlights() {
        return store.getters.departureFlights
      }
    },
    mounted(): void {
      this.loading = true;
      const { sourceId, destinationId, departureDate } = this.$route.query;
      if (!(sourceId && destinationId && departureDate)) {
        this.incorrectData = true;
        console.error("Incorrect Data")
        return
      }
      const dateArrayTillDepartureDate = getDateArrayTill(departureDate);
      const getDepartureFlightsPromise = dateArrayTillDepartureDate.map(
        (date) => store.dispatch("fetchFlights", {
            sourceId,destinationId, departureDate: date
        })
      );
      Promise.all(getDepartureFlightsPromise).then(data => {
        store.commit("saveDepartureFlights", getFormattedFlightData(getMergedArray(data)))
      })
    }
  };

  // sample query = sourceId=DEL-sky&destinationId=BOM-sky&departureDate=2021-02-10
</script>

<style lang="scss">
</style>

