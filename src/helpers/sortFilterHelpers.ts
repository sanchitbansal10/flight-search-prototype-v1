import { FormattedFlightData } from "@/helpers/types";
import { ListPageState } from "@/components/ListPage.vue";

export const sort = (data: Array<FormattedFlightData>, value:ListPageState["departureFlightFilters"]["sortValue"]) => {
  if (value == "COST") {
    return data.sort((item1, item2) => item1.price - item2.price);
  }
  return data.sort((item1, item2) => new Date(item1.date).getTime() - new Date(item2.date).getTime());
};

export const getDirectFlights = (data: Array<FormattedFlightData>) => data.filter(res => res.direct);

export const filterData = (data: Array<FormattedFlightData>, filters: ListPageState["departureFlightFilters"]) => {

  if (filters.direct) {
    data = getDirectFlights(data)
  }

  if (filters.sortVal) {
    data = sort(data, filters.sortVal);
  }

  if (filters.sortAscending) {
    return data;
  } else {
    return data.reverse();
  }
};
