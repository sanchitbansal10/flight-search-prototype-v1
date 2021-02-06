<template>
  <div class="container">
      <div>
        <div class="col-6 col-lg-4">
          <strong>From </strong>
          <b-autocomplete
            rounded
            placeholder="eg: New Delhi"
            :open-on-focus="true"
            field="display"
          >
          </b-autocomplete>
        </div>
        <div class="col-6 col-lg-4">
          <strong>To </strong>
          <b-autocomplete
            rounded
            placeholder="eg: Bombay"
            :open-on-focus="true"
            field="display"
          >
          </b-autocomplete>
        </div>
        <div class="col-6 col-lg-2" id="departure-date-picker">
          <strong>Departure</strong>
          <b-datepicker
            rounded
            placeholder="Select Travel Date"
            size="is-small"
            position="is-bottom-left"
            :min-date="new Date()"
          >
          </b-datepicker>
        </div>
      </div>
      <div style="text-align:center">
        <b-button type="is-info" size="is-small">
          Search
        </b-button>
      </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  methods: {}
};
</script>

<style lang="scss">
</style>
