import moment from "moment";
import { FlightData, FormattedFlightData } from "@/helpers/types";

export const getDateArrayTill = (dateTill: Date) => {
  const todayDate = new Date()
  const now = moment(todayDate);
  const end = moment(new Date(dateTill));
  const noOfDays = end.diff(now, "days");
  const dateArray = [];
  for (let i=0; i <= noOfDays; i++) {
    const date = moment(todayDate.setDate(todayDate.getDate() + 1)).format(
      "YYYY-MM-DD"
    );
    dateArray.push(date);
  }
  return dateArray
};

export const getMergedArray = (data: Array<any>) => {
  const mergedData:any = {};
  data.forEach((entry, index) => {
    Object.keys(entry).forEach((key:string) => {
      console.log("shit")
      if (index === 0) {
        mergedData[key] = [...entry[key]]
      } else {
        mergedData[key] = [...mergedData[key], ...entry[key]];
      }
    })
  });
  return mergedData
};

export const getFormattedFlightData = (data: FlightData) => {
  const mergedFlightData:Array<FormattedFlightData> = [];
  data.Quotes.forEach(quote => {
    mergedFlightData.push({
      price: quote.MinPrice,
      direct: quote.Direct,
      carrier: data.Carriers.find(
        (data) => data.CarrierId == quote.OutboundLeg.CarrierIds[0]
      ),
      date: quote.OutboundLeg.DepartureDate,
      currency: data.Currencies[0].Symbol,
    });
  });
  return mergedFlightData;
};


