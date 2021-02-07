<template>
  <div v-if="flightList && flightList.length > 0">
    <FlightCard
            v-for="(item, index) in flightList"
            v-bind:item="item"
            v-bind:key="index"
            v-on="$listeners"
    />
  </div>
  <div
    v-else
    style="background-color:red;color:white;height:30px;text-align:center"
  >
    No Flights Found For this route
  </div>
</template>

<script lang="ts">
  import moment from "moment";
  import FlightCard from "@/components/FlightCard.vue";
  import { FormattedFlightData } from "@/helpers/types";
  export default {
    name: "FlightList",
    components: { FlightCard },
    props:["flightList"],
    data() {
      return {
      }
    },
    methods: {
      moment: moment
    },

  };
</script>

<style lang="scss">
</style>

