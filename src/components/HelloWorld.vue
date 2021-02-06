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
            >
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

<script lang="ts">
import store from "../store"
import { IGetCityListResponse } from "@/helpers/types"
import debounce from 'lodash/debounce'

export default {
    name: "HelloWorld",
    data() {
      return {
          fromCityList:[],
          toCityList: []
      }
    },
    methods: {
        onCityInput: debounce(function onCityInput (event: string,type: "from" | "to") {
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
        }, 500)
    }
};
</script>

<style lang="scss">
</style>
