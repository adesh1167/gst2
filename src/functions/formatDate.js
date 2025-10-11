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

export function getFixtureDate(dateString, zone = "GHS", separate = false) {
  try {
    dateString = dateString.trim();
    const now = DateTime.now({ zone: `UTC${timeZones[zone]}` });
    let date = DateTime.fromISO(dateString);
    date = date.setZone(`UTC${timeZones[zone]}`);

    // console.log(date);
    let values = {
      date: "",
      time: ""
    }

    let string = "";

    if (date.hasSame(now, 'day')) {
      string = "Today at " + date.toLocaleString(DateTime.TIME_24_SIMPLE);
      values = ({
        date: "Today",
        time: date.toLocaleString(DateTime.TIME_24_SIMPLE)
      })
    } else if (date.plus({ days: 1 }).hasSame(now, 'day')) {
      //   return `Yesterday ${date.toLocaleString(DateTime.TIME_SIMPLE)}`;
      string = "Yesterday at " + date.toLocaleString(DateTime.TIME_24_SIMPLE);
      values = ({
        date: "Yesterday",
        time: date.toLocaleString(DateTime.TIME_24_SIMPLE)
      })
    } else if (date.minus({ days: 1 }).hasSame(now, 'day')) {
      //   return `Yesterday ${date.toLocaleString(DateTime.TIME_SIMPLE)}`;
      string = "Tomorrow at " + date.toLocaleString(DateTime.TIME_24_SIMPLE);
      values = ({
        date: "Tomorrow",
        time: date.toLocaleString(DateTime.TIME_24_SIMPLE)
      })

    } else if (date.hasSame(now, 'year')) {
      string = date.toFormat("MMM dd HH:mm");
      values = ({
        date: date.toFormat("MMM dd"),
        time: date.toFormat("HH:mm")
      })
    } else {
      // Otherwise, show just the date
      string = date.toFormat("dd/MM/yyyy HH:mm:ss");
      values = ({
        date: date.toFormat("dd/MM/yyyy"),
        time: date.toFormat("HH:mm:ss")
      })
    }

    return separate ? values : string;
  } catch (error) {
    console.error({
      error,
      dateString,
      zone
    })
    return "on ___";
  }
}

export function getMyMatchTime(dateString, zone = "GHS", prefix="on ") {
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
      return `${prefix} ${date.toFormat("MMM dd")}`;
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