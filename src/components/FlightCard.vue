<template>
  <div
          class="card flight-card"
          :class="[
              item.cheapest ? 'highlight' : '',
              item.selected? 'selected' : '',
            ]"
       @click="$emit('select-flight', item)"
  >
    <div class="card-content">
      <div class="content">
        <div>
          <div>
            {{ item.carrier.Name }}
          </div>
          <div>
            {{ moment(item.date).format("LLL") }}
          </div>
          <div>{{ item.currency }}{{ item.price }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import moment from "moment";
  export default {
    name: "FlightCard",
    props: ["item"],
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
    .flight-card {
        cursor: pointer;
    }
    .highlight {
        border: pink solid 2px;
    }
    .selected {
        border: blue solid 2px;
        color: red;
    }
</style>
