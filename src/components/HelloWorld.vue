<template>
  <div class="container">
      <div>
        <div class="col-6 col-lg-4">
          <b-field label="From">
            <b-autocomplete
              rounded
              placeholder="eg: New Delhi"
              :open-on-focus="true"
              field="display"
            >
            </b-autocomplete>
          </b-field>
        </div>
        <div class="col-6 col-lg-4">
          <b-field label="To">
            <b-autocomplete
              rounded
              placeholder="eg: Bombay"
              :open-on-focus="true"
              field="display"
            >
            </b-autocomplete>
          </b-field>
        </div>
        <div class="col-6 col-lg-2" id="departure-date-picker">
          <b-field label="Departure Date">
            <b-datepicker
              rounded
              placeholder="Select Travel Date"
              size="is-small"
              position="is-bottom-left"
              :min-date="new Date()"
            >
            </b-datepicker>
          </b-field>
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
