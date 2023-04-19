const path = require("path");
const express = require("express");
const cors = require("cors");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const fetch = require("node-fetch");

const app = express();
const adapter = new FileSync(path.join(__dirname, "db.json"));
const db = low(adapter);

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  console.log(`[${new Date()}] ${req.method} ${req.originalUrl}`);
  next();
});

if (db.get("preferences").value() === undefined) {
  db.set("preferences.origin", [])
    .set("preferences.destination", [])
    .set("preferences.darkTheme", false)
    .set("preferences.numberOfDays", 7)
    .write();
}

app.get("/getPreferences", (req, res) => {
  const preferences = db.get("preferences").value();
  res.json(preferences);
});

app.post("/setPreferences", (req, res) => {
  const preferenceType = req.body.preferenceType;
  const preferenceValue = req.body.preferenceValue;
  db.set(`preferences.${preferenceType}`, preferenceValue).write();
  const updatedPreferences = db.get(`preferences.${preferenceType}`).value();
  res.json(updatedPreferences);
});

app.get("/getAirports", async (req, res) => {
  const response = await fetch(
    "https://www.ryanair.com/api/views/locate/5/airports/en/active"
  );
  const airportsData = await response.json();
  const airportList = airportsData.map((el) => ({
    code: el.code,
    name: el.name,
  }));
  res.json(airportList);
});

app.post("/magicButton", async (req, res) => {
  const preferenceType = req.body.preferenceType;
  const reversePreferenceType =
    preferenceType === "origin" ? "destination" : "origin";
  const airportCodes = db.get(`preferences.${reversePreferenceType}`).value();
  let airportList = [];
  for (const airportCode of airportCodes) {
    const response = await fetch(
      "https://www.ryanair.com/api/views/locate/searchWidget/routes/en/airport/" +
        airportCode
    );
    const airportsData = await response.json();
    for (const oneAirport of airportsData) {
      const airportCode = oneAirport.arrivalAirport.code;
      if (airportList.indexOf(airportCode) < 0) {
        airportList.push(airportCode);
      }
    }
  }
  db.set(`preferences.${preferenceType}`, airportList).write();
  const preferences = db.get(`preferences.${preferenceType}`).value();
  res.json(preferences);
});

let completedRequests = 0;
let requestResults = [];

app.post("/startSearch", (req, res) => {
  const originAirports = db.get("preferences.origin").value();
  const destinationAirports = db.get("preferences.destination").value();
  const numberOfDays = parseInt(db.get("preferences.numberOfDays").value());
  const count =
    originAirports.length * destinationAirports.length * numberOfDays;
  res.json({ count });
  completedRequests = 0;
  requestResults = [];
  makeRequests(originAirports, destinationAirports, numberOfDays);
});

app.get("/searchStatus", (req, res) => {
  if (JSON.stringify(requestResults) === "[]") {
    res.json({ finished: false, count: completedRequests });
  } else {
    res.json({ finished: true, results: requestResults });
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

async function makeRequests(originAirports, destinationAirports, numberOfDays) {
  const responses = [];

  for (let i = 0; i < numberOfDays; i++) {
    const currentDate = new Date();
    const futureDate = new Date(currentDate.setDate(currentDate.getDate() + i));
    const isoDateString = futureDate.toISOString().substring(0, 10);
    for (const origin of originAirports) {
      for (const destination of destinationAirports) {
        const params = new URLSearchParams({
          ADT: 1,
          TEEN: 0,
          CHD: 0,
          INF: 0,
          DateOut: isoDateString,
          DateIn: "",
          Origin: origin,
          Destination: destination,
          OriginIsMac: false,
          DestinationIsMac: false,
          IncludeConnectingFlights: false,
          ToUs: "AGREED",
        });
        const response = await fetch(
          "https://www.ryanair.com/api/booking/v4/en-ie/availability?" + params
        );
        const data = await response.json();
        const currency = data.currency;
        const date = futureDate.toLocaleDateString();
        const originCode = data.trips[0].origin;
        const originName = data.trips[0].originName;
        const destinationCode = data.trips[0].destination;
        const destinationName = data.trips[0].destinationName;
        for (const flight of data.trips[0].dates[0].flights) {
          const faresLeft =
            flight.faresLeft > -1 ? flight.faresLeft : undefined;
          const operatedBy =
            flight.operatedBy === "" ? "Ryanair" : flight.operatedBy;
          const flightNumber = flight.segments[0].flightNumber;
          const departure = flight.segments[0].time[0].substring(11, 16);
          const arrival = flight.segments[0].time[1].substring(11, 16);
          const duration = flight.segments[0].duration;
          const price =
            faresLeft === 0 ? undefined : flight.regularFare.fares[0].amount;
          responses.push({
            currency,
            date,
            originCode,
            originName,
            destinationCode,
            destinationName,
            faresLeft,
            operatedBy,
            flightNumber,
            departure,
            arrival,
            duration,
            price,
          });
        }
        completedRequests++;
      }
    }
  }
  requestResults = responses.sort((a, b) => a.price - b.price);
}
