<template>
  <div
          class="card flight-card m-1 p-2"
          :class="[
              item.cheapest ? 'highlight' : '',
              item.selected? 'selected' : '',
            ]"
       @click="$emit('select-flight', item)"
  >
    <div class="card-content content p-2 columns is-vcentered">
      <div class="column p-2">
        <p class="m-0 has-text-weight-semibold">
          {{ item.carrier.Name }}
        </p>
      </div>
      <div class="column p-2">
        <p class="m-0">
          {{ moment(item.date).format("lll") }}
        </p>
      </div>
      <div class="column p-2">
        <h5 class="m-0" style="color: #f96435">{{ item.currency }}{{ item.price }}</h5>
        <span v-if="item.cheapest" class="tag is-link is-light">Recommended</span>
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
        padding: 0;
    }
    .highlight {
        background: #fff7f4 !important;
    }
    .selected {
        border: blue solid 2px;
        color: red;
    }
</style>
