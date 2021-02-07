import { FormattedFlightData } from "@/helpers/types";
import { ListPageState } from "@/components/ListPage.vue";

export const getPriceRange = (data: Array<FormattedFlightData>) => {
  let lowest:number;
  let highest:number;
  data.forEach((entry) => {
    if (!lowest || entry.price < lowest) {
      lowest = entry.price;
    }
    if (!highest || entry.price > highest) {
      highest = entry.price;
    }
  })
  return [lowest, highest]
};

export const markSelectedFlight = (data: Array<FormattedFlightData>, selectedFlight: FormattedFlightData) => {
  if (selectedFlight) {
    data.forEach((entry) => {
      if (entry.id == selectedFlight.id) {
        entry.selected = true;
      } else {
        entry.selected = false;
      }
    });
  }
  return data;
}
export const getPriceFilteredData = (data: Array<FormattedFlightData>, lowest: number, highest: number) => (
  data.filter(entry => entry.price >= lowest && entry.price <= highest)
)

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

  if (filters.costFilter.length) {
    data = getPriceFilteredData(data, filters.costFilter[0], filters.costFilter[1])
  }

  if (filters.sortAscending) {
    return data;
  } else {
    return data.reverse();
  }
};
