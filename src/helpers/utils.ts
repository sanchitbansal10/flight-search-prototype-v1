import moment from "moment";

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
