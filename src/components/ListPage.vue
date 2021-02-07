<template>
  <div class="columns">
    <div class="column">
      <FlightList :flightList="filteredDepartureFlights" />
      <div>
        <div>
          <div >
            <b-switch v-model="departureFlightFilters.direct">Direct</b-switch>
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
      <FlightList :flightList="filteredReturnFlights" />
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

export interface ListPageState {
  loading: boolean;
  incorrectData: boolean;
  departureFlightFilters: {
    direct: boolean;
    sortVal: null | "COST" | "DATE";
    sortAscending: boolean;
  }
}
export default {
  name: "ListPage",
  components: { FlightList },
  data(): ListPageState {
    return {
      loading: false,
      incorrectData: false,
      departureFlightFilters: {
        direct: false,
        sortVal: null,
        sortAscending: true
      }
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
  },
  computed: {
    filteredDepartureFlights() {
      return store.getters.filteredDepartureFlights;
    },
    filteredReturnFlights() {
      return store.getters.filteredReturnFlights;
    }
  },
  watch: {
    departureFlightFilters: {
      handler() {
        store.commit("departureFlightFilter", this.departureFlightFilters);
      },
      deep: true,
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
