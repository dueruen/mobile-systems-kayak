// To start the dataStream
// PubSub.publish(RunDataStream, true);
//
// To stop the dataStream early
// PubSub.publish(RunDataStream, true);
//
// To subscribe to the data stream
// PubSub.subscribe(DataStream, (msg, data) => {
//   console.log(data)
// });

import PubSub from "pubsub-js";

// Subscribtion types
export const RunDataStream = "RunDataStream";
export const DataStream = "DataStream";

// Message names
export const rawimus = "rawimus";
export const inspvas = "inspvas";
export const inscovs = "inscovs";
export const bestutm = "bestutm";

const dataPublishInterval = 2;

let dataStreamRunning = false;

const rawData = require("./data/one.json");
let dataObjects;
let count = 0;

PubSub.subscribe(RunDataStream, (msg, data) => {
  if (!data) {
    dataStreamRunning = false;
  } else {
    if (!dataStreamRunning) {
      dataStreamRunning = true;
      resetState();
      runDataGen();
    }
  }
});

const resetState = () => {
  dataObjects = processRawData(rawData);
  count = 0;
};

const runDataGen = () => {
  publishData(dataObjects[count]);
  setTimeout(() => {
    count++;
    if (count !== dataObjects.length && dataStreamRunning) {
      runDataGen();
    }
  }, dataPublishInterval);
};

const publishData = (data) => {
  PubSub.publish(DataStream, data);
};

const processRawData = (rawData) => {
  var data = [];

  for (var i = 0; i < rawData.length; i++) {
    var res = createDataObject(rawData[i]);
    if (res) {
      data.push(res);
    }
  }
  return data;
};

const createDataObject = (data) => {
  if (data["FIELD2"] === "rawimus") {
    return {
      time: data["FIELD1"],
      message: data["FIELD2"],
      acceleration_z: data["FIELD3"],
      minus_acceleration_y: data["FIELD4"],
      acceleration_x: data["FIELD5"],
      angular_rate_z: data["FIELD6"],
      minus_angular_rate_y: data["FIELD7"],
      angular_rate_x: data["FIELD8"],
    };
  }

  if (data["FIELD2"] === "inspvas") {
    return {
      time: data["FIELD1"],
      message: data["FIELD2"],
      latitude: data["FIELD3"],
      longitude: data["FIELD4"],
      altitude: data["FIELD5"],
      north_velocity: data["FIELD6"],
      east_velocity: data["FIELD7"],
      up_velocity: data["FIELD8"],
      roll: data["FIELD9"],
      pitch: data["FIELD10"],
      azimuth: data["FIELD11"],
    };
  }

  if (data["FIELD2"] === "inscovs") {
    return {
      time: data["FIELD1"],
      message: data["FIELD2"],
      position: data["FIELD3"],
      attitude: data["FIELD4"],
      velocity: data["FIELD5"],
    };
  }

  if (data["FIELD2"] === "bestutm") {
    return {
      time: data["FIELD1"],
      message: data["FIELD2"],
      utm_zone: data["FIELD3"],
      utm_character: data["FIELD4"],
      northing: data["FIELD5"],
      easting: data["FIELD6"],
      height: data["FIELD7"],
    };
  }

  return undefined;
};
