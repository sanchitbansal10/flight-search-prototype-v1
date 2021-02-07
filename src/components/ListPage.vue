<template>
    <div>
        <FlightList :flightList=departureFlights />
        <h1> Return Flights </h1>
        <FlightList :flightList=returnFlights />
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
      },
      returnFlights() {
        return store.getters.returnFlights
      }
    },
    mounted(): void {
      this.loading = true;
      const { sourceId, destinationId, departureDate, isRoundTrip, returnDate } = this.$route.query;
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
      });

      // handle the return data
      // Since API doesnt give back the return data, making a exact opposite request with source and destination interchanged
      if (isRoundTrip && returnDate) {
        const dateArrayTillReturnDate = getDateArrayTill(returnDate);
        const getReturnFlightsPromise = dateArrayTillReturnDate.map(
          (returnDate) => store.dispatch("fetchFlights", {
            sourceId: destinationId,destinationId: sourceId, departureDate: returnDate
          })
        );
        Promise.all(getReturnFlightsPromise).then(data => {
          store.commit("saveReturnFlights", getFormattedFlightData(getMergedArray(data)))
        });
      }

    }
  };

  // sample query = sourceId=DEL-sky&destinationId=BOM-sky&departureDate=2021-02-10&returnDate=2021-03-10
</script>

<style lang="scss">
</style>

