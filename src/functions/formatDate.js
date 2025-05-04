import { DateTime } from "luxon";

export function getFixtureDate(dateString, zone = "+0"){
    dateString = dateString.trim();
    const now = DateTime.now({ zone: `UTC${zone}` });
    let date = DateTime.fromISO(dateString);
    date = date.setZone(`UTC${zone}`);

    console.log(date);
  
    if (date.hasSame(now, 'day')) {
      return "Today at " + date.toLocaleString(DateTime.TIME_24_SIMPLE);
    } else if (date.plus({ days: 1 }).hasSame(now, 'day')) {
      //   return `Yesterday ${date.toLocaleString(DateTime.TIME_SIMPLE)}`;
      return "Yesterday at " + date.toLocaleString(DateTime.TIME_24_SIMPLE);
    } else if (date.minus({ days: 1 }).hasSame(now, 'day')) {
      //   return `Yesterday ${date.toLocaleString(DateTime.TIME_SIMPLE)}`;
      return "Tomorrow at " + date.toLocaleString(DateTime.TIME_24_SIMPLE);
    } else if (date.hasSame(now, 'year')) {
      return date.toFormat("MMM dd HH:mm");
    } else {
      // Otherwise, show just the date
      return date.toFormat("dd/MM/yyyy HH:mm:ss");
    }
}