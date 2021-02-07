<template>
  <div class="container">
    <div>
      <div class="col-6 col-lg-4">
        <b-field label="Round Trip">
          <b-switch
                  v-model="isRoundTrip"
                  :true-value=true
                  :false-value=false
          >
            {{ isRoundTrip }}
          </b-switch>
        </b-field>
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
            @select="onCitySelect($event, 'to')"
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
            @input="onDateInput($event, 'departure')"
          >
          </b-datepicker>
        </b-field>
      </div>
        <div class="col-6 col-lg-2" id="return-date-picker">
            <b-field label="Return Date">
                <b-datepicker
                    :disabled="!isRoundTrip"
                    rounded
                    placeholder="Select Return Date"
                    size="is-small"
                    position="is-bottom-left"
                    :min-date="new Date()"
                    @input="onDateInput($event, 'return')"
                >
                </b-datepicker>
            </b-field>
        </div>
    </div>
    <div style="text-align:center">
      <b-button :disabled="allowFlightSearch" type="is-info" size="is-small" @click="onSearch">
        Search
      </b-button>
    </div>
  </div>
</template>

<script lang="ts">
import store from "../store";
import { ICityData, IGetCityListResponse } from "@/helpers/types";
import debounce from "lodash/debounce";
import moment from "moment";

interface State {
  fromCity: null|ICityData;
  toCity: null|ICityData;
  returnDate: null | string;
  departureDate: null | string;
  isRoundTrip: boolean;
  fromCityList: Array<ICityData>;
  toCityList: Array<ICityData>;
}

export default {
  name: "HelloWorld",
  data() : State {
    return {
      fromCityList: [],
      toCityList: [],
      fromCity: null,
      toCity: null,
      departureDate: null,
      returnDate: null,
      isRoundTrip: false
    };
  },
  methods: {
    onCityInput: debounce(function onCityInput(
      event: string,
      type: "from" | "to"
    ) {
      if (event.length < 2) {
        return;
      }
      store
        .dispatch("fetchCities", event)
        .then((data: IGetCityListResponse) => {
          if (type === "from") {
            this.fromCityList = data.Places;
          } else {
            this.toCityList = data.Places;
          }
        });
    },
    500),

    onCitySelect(data: ICityData, type: "from" | "to") {
      if (type === "from") {
        this.fromCity = data;
      } else {
        this.toCity = data;
      }
    },

    onDateInput(date: Date, type: "departure" | "return") {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      if (type === "departure") {
        this.departureDate = formattedDate;
      } else {
        this.returnDate = formattedDate;
      }
    },

    onSearch() {
      const { fromCity, toCity, departureDate, isRoundTrip, returnDate } = this;
      this.$router.push({
          name: "ListPage",
          query: {
            sourceId: fromCity.PlaceId,
            destinationId: toCity.PlaceId,
            isRoundTrip: isRoundTrip,
            departureDate: departureDate,
            returnDate: returnDate,
          },
        });
      }
  },

  computed: {
    allowFlightSearch(): boolean {
      const { isRoundTrip, fromCity, toCity, departureDate, returnDate } = this;
      if (isRoundTrip) {
        return !(fromCity && toCity && departureDate && returnDate)
      }
      return !(fromCity && toCity && departureDate);
    }
  }
};
</script>

<style lang="scss"></style>
