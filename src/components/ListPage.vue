<template>
    <div>
        Hello
    </div>
</template>

<script lang="ts">
  import { getDateArrayTill } from "@/helpers/utils";
  import store from "../store";

  export default {
    name: "ListPageComponent",
    data() {
      return {
        loading: false,
        incorrectData: false
      }
    },
    methods: {},
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
      Promise.all(getDepartureFlightsPromise).then(data => console.log(data))
    }
  };

  // sample query = sourceId=DEL-sky&destinationId=BOM-sky&departureDate=2021-02-10
</script>

<style lang="scss">
</style>

