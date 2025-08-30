import { DateTime } from "luxon";

const timeZones = {
  NGN: "+1",
  GHS: "+0",
  MWK: "+2",
  ZMW: "+2",
  ZAR: "+2",
  UGX: "+3",
  USD: "-5",
  EUR: "+1",
  GBP: "+0",
}

export function getFixtureDate(dateString, zone = "GHS") {
  try {
    dateString = dateString.trim();
    const now = DateTime.now({ zone: `UTC${timeZones[zone]}` });
    let date = DateTime.fromISO(dateString);
    date = date.setZone(`UTC${timeZones[zone]}`);

    // console.log(date);

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
  } catch (error) {
    console.error({
      error,
      dateString,
      zone
    })
    return "on ___";
  }
}

export function getMyMatchTime(dateString, zone = "GHS") {
  try {
    dateString = dateString.trim();
    const now = DateTime.now({ zone: `UTC${timeZones[zone]}` });
    let date = DateTime.fromSQL(dateString);
    date = date.setZone(`UTC${timeZones[zone]}`);

    // console.log(date);

    if (date.hasSame(now, 'day')) {
      return "Today";
    } else if (date.plus({ days: 1 }).hasSame(now, 'day')) {
      //   return `Yesterday ${date.toLocaleString(DateTime.TIME_SIMPLE)}`;
      return "Yesterday";
    } else if (date.minus({ days: 1 }).hasSame(now, 'day')) {
      //   return `Yesterday ${date.toLocaleString(DateTime.TIME_SIMPLE)}`;
      return "Tomorrow";
    } else if (date.hasSame(now, 'year')) {
      return `on ${date.toFormat("MMM dd")}`;
    } else {
      // Otherwise, show just the date
      return `on ${date.toFormat("dd/MM/yyyy")}`;
    }
  } catch (error) {
    console.error({
      error,
      dateString,
      zone
    })

    return "on ___";
  }
}