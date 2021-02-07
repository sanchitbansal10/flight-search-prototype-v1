<template>
  <div v-if="flightList && flightList.length > 0">
    <div
      class="card"
      v-for="(items, index) in flightList"
      :key="index"
    >
      <div class="card-content">
        <div class="content">
          <div>
            <div>
              {{ items.carrier.Name }}
            </div>
            <div>
              {{ moment(items.date).format("LLL") }}
            </div>
            <div>{{ items.currency }}{{ items.price }}</div>
          </div>
        </div>
      </div>
    </div>
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
  export default {
    name: "FlightList",
    props: ["flightList"],
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

