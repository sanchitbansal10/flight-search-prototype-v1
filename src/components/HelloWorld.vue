<template>
  <div class="container">
      <div>
        <div class="col-6 col-lg-4">
          <b-field label="From">
            <b-autocomplete
              :data="fromCityList"
              rounded
              placeholder="eg: New Delhi"
              :open-on-focus="true"
              field="PlaceName"
              @typing="onCityInput($event, 'from')"
              @select="onCitySelect($event, 'from')"
            >
              <template #empty>No results found</template>
            </b-autocomplete>
          </b-field>
        </div>
        <div class="col-6 col-lg-4">
          <b-field label="To">
            <b-autocomplete
              rounded
              :data="toCityList"
              placeholder="eg: Bombay"
              :open-on-focus="true"
              field="PlaceName"
              @input="onCityInput($event, 'to')"
              @select="onCitySelect($event,'to')"
            >
              <template #empty>No results found</template>
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
              @input="onDateInput"
            >
            </b-datepicker>
          </b-field>
        </div>
      </div>
      <div style="text-align:center">
        <b-button :disabled="allowFlightSearch" type="is-info" size="is-small">
          Search
        </b-button>
      </div>
  </div>
</template>

<script lang="ts">
import store from "../store"
import { ICityData, IGetCityListResponse } from "@/helpers/types";
import debounce from 'lodash/debounce'
import moment from "moment";

export default {
  name: "HelloWorld",
  data() {
    return {
        fromCityList:[],
        toCityList: [],
        fromCity: null,
        toCity: null,
        departureDate: null
    }
  },
  methods: {
    onCityInput: debounce(function onCityInput(event: string, type: "from" | "to") {
      if (event.length < 2) {
        return
      }
      store.dispatch("fetchCities", event)
              .then((data: IGetCityListResponse) => {
                if (type === "from") {
                  this.fromCityList = data.Places
                } else {
                  this.toCityList = data.Places
                }
              })
    }, 500),

    onCitySelect(data: ICityData, type: "from" | "to") {
      if (type === "from") {
        this.fromCity = data;
      } else {
        this.toCity = data
      }
    },

    onDateInput(date: Date) {
      this.departureDate = moment(date).format("YYYY-MM-DD");
    },
  },

  computed: {
    allowFlightSearch():boolean {
      return !(this.fromCity && this.toCity && this.departureDate)
    }
  }
};
</script>

<style lang="scss">
</style>
