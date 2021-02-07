<template>
  <div class="card" @click="$emit('select-flight', item)">
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
    props: ["item", "click"],
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
