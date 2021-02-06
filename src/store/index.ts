import Vue from "vue";
import Vuex from "vuex";
import config from "../../config.json"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
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
    fetchFlights(context, payload) {
      return fetch(
        `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/IN/INR/en-IN/${payload.query.source.id}/${payload.query.dest.id}/${payload.date}?inboundpartialdate=2020-14-04`,
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
