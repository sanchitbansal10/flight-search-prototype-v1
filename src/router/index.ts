import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import ListPage from "../components/ListPage"

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/list",
    name: "ListPage",
    props: (route) => {
      const { sourceId, destinationId, departureDate, isRoundTrip, returnDate } = route.query;
      return {
        sourceId, destinationId, departureDate, isRoundTrip, returnDate
      }
    },
    component: ListPage
  }
];

const router = new VueRouter({
  routes
});

export default router;
