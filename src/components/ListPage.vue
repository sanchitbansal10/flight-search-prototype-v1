<template>
  <div class="main-container m-2">
    <div class="columns is-mobile filter-container">
      <div class="column mr-2 ml-2">
        <b-switch v-model="departureFlightFilters.direct">Direct</b-switch>
        <b-field v-if="priceRange">
          <b-slider
            v-model="departureFlightFilters.costFilter"
            :min="priceRange[0]"
            :max="priceRange[1]"
            :step="50"
          >
          </b-slider>
        </b-field>
        <div>
          <span style="font-size: 12px;font-weight: 600">Sort</span>
          <b-dropdown v-model="departureFlightFilters.sortVal" aria-role="list">
            <b-button class="button is-small is-link is-light" type="button" slot="trigger">
              <template v-if="departureFlightFilters.sortVal == 'COST'">
                <span>COST</span>
              </template>
              <template v-if="departureFlightFilters.sortVal == 'DATE'">
                <span>DATE</span>
              </template>
              <template v-if="!departureFlightFilters.sortVal">
                <span>SELECT</span>
              </template>
              <b-icon icon="menu-down"></b-icon>
            </b-button>

            <b-dropdown-item value="COST" aria-role="listitem">
              <span>COST</span>
            </b-dropdown-item>

            <b-dropdown-item value="DATE" aria-role="listitem">
              <span>DATE</span>
            </b-dropdown-item>
          </b-dropdown>
          <span @click="toggleSort('departure')">
            <b-icon
              :icon="
                departureFlightFilters.sortAscending
                  ? 'arrow-alt-circle-down'
                  : 'arrow-alt-circle-up'
              "
              pack="fas"
              size="is-medium"
            ></b-icon>
          </span>
        </div>
      </div>
      <div v-if="isRoundTrip==='true'" class="column mr-2 ml-2">
        <b-switch v-model="returnFlightFilters.direct">Direct</b-switch>
        <b-field v-if="returnPriceRange">
          <b-slider
            v-model="returnFlightFilters.costFilter"
            :min="returnPriceRange[0]"
            :max="returnPriceRange[1]"
            :step="50"
          >
          </b-slider>
        </b-field>
        <div>
          <span style="font-size: 12px;font-weight: 600">Sort</span>
          <b-dropdown v-model="returnFlightFilters.sortVal" aria-role="list">
            <b-button class="button is-small is-link is-light" type="button" slot="trigger">
              <template v-if="returnFlightFilters.sortVal == 'COST'">
                <span>COST</span>
              </template>
              <template v-if="returnFlightFilters.sortVal == 'DATE'">
                <span>DATE</span>
              </template>
              <template v-if="!returnFlightFilters.sortVal">
                <span>SELECT</span>
              </template>
              <b-icon icon="menu-down"></b-icon>
            </b-button>

            <b-dropdown-item value="COST" aria-role="listitem">
              <span>COST</span>
            </b-dropdown-item>

            <b-dropdown-item value="DATE" aria-role="listitem">
              <span>DATE</span>
            </b-dropdown-item>
          </b-dropdown>
          <span @click="toggleSort('return')">
            <b-icon
              :icon="
                departureFlightFilters.sortAscending
                  ? 'arrow-alt-circle-down'
                  : 'arrow-alt-circle-up'
              "
              pack="fas"
              size="is-medium"
            ></b-icon>
          </span>
        </div>
      </div>
    </div>
    <div class="columns is-mobile custom-content ml-2">
      <div class="column content">
        <h6>Departure Flights</h6>
        <FlightList
          :flightList="filteredDepartureFlights"
          v-on:select-flight="selectDepartureFlight"
        />
      </div>
      <div class="column content" v-if="isRoundTrip==='true'">
        <h6>Return Flights</h6>
        <FlightList
          :flightList="filteredReturnFlights"
          v-on:select-flight="selectReturnFlight"
        />
      </div>
    </div>
    <div
      class="columns is-mobile footer-main m-1 is-vcentered"
      v-if="selectedDepartureFlight || selectedReturnFlight"
    >
      <div v-if="selectedDepartureFlight" class="column p-0 m-0 is-two-fifths">
        <FlightCard :item="selectedDepartureFlight" />
      </div>
      <div v-if="selectedReturnFlight" class="column p-0 m-0 is-two-fifths">
        <FlightCard :item="selectedReturnFlight" />
      </div>
      <div class="column content price-main is-one-fifth p-1">
        <p class="m-0 has-text-white">
          Total:
        </p>
        <h5 class="m-0 has-text-white">
          {{ getPrice }}
        </h5>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  getDateArrayTill,
  getFormattedFlightData,
  getMergedArray
} from "@/helpers/utils";
import store from "../store";
import FlightList from "@/components/FlightList.vue";
import { getPriceRange } from "@/helpers/sortFilterHelpers";
import FlightCard from "@/components/FlightCard.vue";
import { FormattedFlightData } from "@/helpers/types";

interface FlightFilters {
  direct: boolean;
  sortVal: null | "COST" | "DATE";
  sortAscending: boolean;
  costFilter: [];
}
export interface ListPageState {
  loading: boolean;
  incorrectData: boolean;
  departureFlightFilters: FlightFilters;
  returnFlightFilters: FlightFilters;
  priceRange: null | [];
  returnPriceRange: null | [];
}
export default {
  name: "ListPage",
  components: { FlightCard, FlightList },
  data(): ListPageState {
    return {
      loading: false,
      incorrectData: false,
      departureFlightFilters: {
        direct: false,
        sortVal: null,
        sortAscending: true,
        costFilter: []
      },
      returnFlightFilters: {
        direct: false,
        sortVal: null,
        sortAscending: true,
        costFilter: []
      },
      priceRange: null,
      returnPriceRange: null
    };
  },
  props: {
    sourceId: {
      type: String
    },
    destinationId: {
      type: String
    },
    isRoundTrip: {
      type: String
    },
    departureDate: {
      type: String
    },
    returnDate: {
      type: String
    }
  },
  methods: {
    toggleSort(type: "departure" | "return") {
      if (type == "departure" && this.departureFlightFilters.sortVal) {
        this.departureFlightFilters.sortAscending = !this.departureFlightFilters
          .sortAscending;
      } else if (type === "return" && this.returnFlightFilters.sortVal) {
        this.returnFlightFilters.sortAscending = !this.returnFlightFilters
          .sortAscending;
      }
    },
    selectDepartureFlight(item: FormattedFlightData) {
      store.commit("selectDepartureFlight", item);
    },
    selectReturnFlight(item: FormattedFlightData) {
      store.commit("selectReturnFlight", item);
    }
  },
  computed: {
    filteredDepartureFlights() {
      return store.getters.filteredDepartureFlights;
    },
    filteredReturnFlights() {
      return store.getters.filteredReturnFlights;
    },
    departureFlights() {
      return store.getters.departureFlights;
    },
    returnFlights() {
      return store.getters.returnFlights;
    },
    selectedDepartureFlight() {
      return store.getters.selectedDepartureFlight;
    },
    selectedReturnFlight() {
      return store.getters.selectedReturnFlight;
    },
    getPrice() {
      let currency;
      let price = 0;
      const selectedDepartureFlight = this.selectedDepartureFlight;
      const selectedReturnFlight = this.selectedReturnFlight;
      if (selectedDepartureFlight) {
        currency = selectedDepartureFlight.currency;
        price = price + selectedDepartureFlight.price;
      }
      if (selectedReturnFlight) {
        currency = selectedReturnFlight.currency;
        price = price + selectedReturnFlight.price;
      }
      return currency + price;
    }
  },
  watch: {
    departureFlightFilters: {
      handler() {
        store.commit("departureFlightFilter", this.departureFlightFilters);
      },
      deep: true
    },
    departureFlights: {
      handler() {
        this.priceRange = getPriceRange(this.departureFlights);
      }
    },
    returnFlightFilters: {
      handler() {
        store.commit("returnFlightFilter", this.returnFlightFilters);
      },
      deep: true
    },
    returnFlights: {
      handler() {
        this.returnPriceRange = getPriceRange(this.returnFlights);
      }
    }
  },
  mounted(): void {
    this.loading = true;
    const {
      sourceId,
      destinationId,
      departureDate,
      isRoundTrip,
      returnDate
    } = this;
    if (!(sourceId && destinationId && departureDate)) {
      this.incorrectData = true;
      console.error("Incorrect Data");
      return;
    }
    const dateArrayTillDepartureDate = getDateArrayTill(departureDate);
    const getDepartureFlightsPromise = dateArrayTillDepartureDate.map(date =>
      store.dispatch("fetchFlights", {
        sourceId,
        destinationId,
        departureDate: date
      })
    );
    Promise.all(getDepartureFlightsPromise).then(data => {
      store.commit(
        "saveDepartureFlights",
        getFormattedFlightData("departure", getMergedArray(data))
      );
    });

    // handle the return data
    // Since API doesnt give back the return data, making a exact opposite request with source and destination interchanged
    if (isRoundTrip === "true" && returnDate) {
      const dateArrayTillReturnDate = getDateArrayTill(returnDate);
      const getReturnFlightsPromise = dateArrayTillReturnDate.map(returnDate =>
        store.dispatch("fetchFlights", {
          sourceId: destinationId,
          destinationId: sourceId,
          departureDate: returnDate
        })
      );
      Promise.all(getReturnFlightsPromise).then(data => {
        store.commit(
          "saveReturnFlights",
          getFormattedFlightData("departure", getMergedArray(data))
        );
      });
    }
  }
};

// sample query = sourceId=DEL-sky&destinationId=BOM-sky&departureDate=2021-02-10&returnDate=2021-02-12&isRoundTrip=true
</script>

<style lang="scss">
  .filter-container {
    background: #f9f6f4;
  }
  .main-container {
    display: flex;
    height: 100vh;
    max-height: 100vh;
    flex-direction: column;
  }
  .custom-content {
    flex: 1;
    overflow: scroll;
  }
  .footer-main {
    background: #4c3e6f;
    color: #fff;
  }
  .price-main {
  }
</style>
