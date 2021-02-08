import Vue from "vue";
import Vuex from "vuex";
import config from "../../config.json"
import { filterData, markSelectedFlight } from "@/helpers/sortFilterHelpers";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    departureFlights: [],
    returnFlights: [],
    filteredDepartureFlights: [],
    filteredReturnFlights: [],
    selectedDepartureFlight: null,
    selectedReturnFlight: null
  },
  getters: {
    departureFlights(state) {
      return state.departureFlights;
    },
    returnFlights(state) {
      return state.returnFlights;
    },
    filteredDepartureFlights(state) {
      return state.filteredDepartureFlights
    },
    filteredReturnFlights(state) {
      return state.filteredReturnFlights
    },
    selectedDepartureFlight(state) {
      return state.selectedDepartureFlight
    },
    selectedReturnFlight(state) {
      return state.selectedReturnFlight
    }
  },
  mutations: {
    saveDepartureFlights(state, payload) {
      state.departureFlights = state.filteredDepartureFlights = payload;
    },
    saveReturnFlights(state, payload) {
      state.returnFlights = state.filteredReturnFlights = payload;
    },
    departureFlightFilter(state, payload) {
      const data = filterData(state.departureFlights, payload);
      state.filteredDepartureFlights = data;
    },
    returnFlightFilter(state, payload) {
      const data = filterData(state.returnFlights, payload);
      state.filteredReturnFlights = data;
    },
    selectDepartureFlight(state, payload) {
      const selectedMarkedData = markSelectedFlight(state.filteredDepartureFlights, payload)
      state.filteredDepartureFlights = selectedMarkedData
      state.selectedDepartureFlight = payload
    },
    selectReturnFlight(state, payload) {
      const selectedMarkedData = markSelectedFlight(state.filteredReturnFlights, payload)
      state.filteredReturnFlights= selectedMarkedData
      state.selectedReturnFlight = payload
    }
  },
  actions: {
    fetchCities(context, query) {
      return fetch(
        `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/IN/GBP/en-GB/?query=${query}`,
        {
          method: "GET",
          headers: config["x-rapidapi-headers"],
        }
      ).then((res) => {
        return res.json();
      });
    },
    fetchFlights(context, {sourceId, destinationId, departureDate}) {
      return fetch(
        `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/IN/INR/en-IN/${sourceId}/${destinationId}/${departureDate}?inboundpartialdate=2020-14-04`,
        {
          method: "GET",
          headers: config["x-rapidapi-headers"],
        }
      ).then((res) => {
        return res.json();
      });
    },
  },
  modules: {}
});
