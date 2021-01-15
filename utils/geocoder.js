import NodeGeocoder from "node-geocoder";

const options = {
  provider: "mapquest",
  httpAdapter: "https",
  apiKey: "NmIHdmLx1TgRtkoQZCjOgzo7wsPKiRAl",
  formatter: null,
};

export const geocoder = NodeGeocoder(options);
