<template>
  <div class="columns">
    <div class="column">
      <FlightList :flightList="filteredDepartureFlights" v-on:select-flight="selectDepartureFlight"/>
      <div>
        <div>
          <div >
            <b-switch v-model="departureFlightFilters.direct">Direct</b-switch>
            <b-field v-if="priceRange">
              <b-slider tooltip-always v-model="departureFlightFilters.costFilter" :min="priceRange[0]" :max="priceRange[1]" :step="50" >
              </b-slider>
            </b-field>
            <div>
              Sort By
              <b-dropdown
                v-model="departureFlightFilters.sortVal"
                aria-role="list"
              >
                <button class="button is-primary" type="button" slot="trigger">
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
                </button>

                <b-dropdown-item value="COST" aria-role="listitem">
                  <span>COST</span>
                </b-dropdown-item>

                <b-dropdown-item value="DATE" aria-role="listitem">
                  <span>DATE</span>
                </b-dropdown-item>
              </b-dropdown>
              <span @click="toggleSort('departure')">
                <b-icon
                    :icon='
                        departureFlightFilters.sortAscending
                          ? "arrow-alt-circle-down"
                          : "arrow-alt-circle-up"
                      '
                  pack="fas"
                  size="is-medium"
                ></b-icon>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="column" v-if="isRoundTrip">
      <h1>Return Flights</h1>
      <FlightList :flightList="filteredReturnFlights" v-on:select-flight="selectReturnFlight" />
    </div>
    <div class="column" v-if="selectedDepartureFlight || selectedReturnFlight">
      <div v-if="selectedDepartureFlight">
        <FlightCard :item="selectedDepartureFlight" />
      </div>
      <div v-if="selectedReturnFlight">
        <FlightCard :item="selectedReturnFlight" />
      </div>
      <div>
        Total Price: {{getPrice}}
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

export interface ListPageState {
  loading: boolean;
  incorrectData: boolean;
  departureFlightFilters: {
    direct: boolean;
    sortVal: null | "COST" | "DATE";
    sortAscending: boolean;
    costFilter: [];
  }
  priceRange: []
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
      priceRange: null
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
      type: Boolean
    },
    departureDate: {
      type: String
    },
    returnDate: {
      type: String
    }
  },
  methods: {
    toggleSort(type:"departure" | "return") {
      if (type == "departure" && this.departureFlightFilters.sortVal) {
        this.departureFlightFilters.sortAscending = !this.departureFlightFilters.sortAscending;
      }
    },
    selectDepartureFlight(item: FormattedFlightData) {
      store.commit("selectDepartureFlight", item);
    },
    selectReturnFlight(item: FormattedFlightData) {
      console.log("hello")
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
      return store.getters.departureFlights
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
      const selectedReturnFlight = this.selectedReturnFlight
        if (selectedDepartureFlight) {
          currency = selectedDepartureFlight.currency;
          price = price + selectedDepartureFlight.price
        }
        if (selectedReturnFlight) {
          currency = selectedReturnFlight.currency;
          price = price + selectedReturnFlight.price
        }
        return currency + price
      }
  },
  watch: {
    departureFlightFilters: {
      handler() {
        store.commit("departureFlightFilter", this.departureFlightFilters);
      },
      deep: true,
    },
    departureFlights: {
      handler() {
        this.priceRange = getPriceRange(this.departureFlights)
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
        getFormattedFlightData(getMergedArray(data))
      );
    });

    // handle the return data
    // Since API doesnt give back the return data, making a exact opposite request with source and destination interchanged
    if (isRoundTrip && returnDate) {
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
          getFormattedFlightData(getMergedArray(data))
        );
      });
    }
  }
};

// sample query = sourceId=DEL-sky&destinationId=BOM-sky&departureDate=2021-02-10&returnDate=2021-02-12&isRoundTrip=true
</script>

<style lang="scss"></style>
