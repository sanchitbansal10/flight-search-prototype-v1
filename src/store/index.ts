import Vue from "vue";
import Vuex from "vuex";
import config from "../../config.json"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    departureFlights: []
  },
  getters: {
    departureFlights(state) {
      return state.departureFlights;
    }
  },
  mutations: {
    saveDepartureFlights(state, payload) {
      state.departureFlights = payload;
    },
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
