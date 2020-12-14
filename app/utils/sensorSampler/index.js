import PubSub from "pubsub-js";
import * as Location from 'expo-location';
import {PowerUpdates, BatteryAlmostDepleted, BatteryHasChargedBackToNormal, LowPowerModeEnabled, LowPowerModeDisabled} from '../powerMonitoring/index'

// Subscribtion types
export const StartLocationDataSampling = "StartLocationDataSampling";
export const LocationData = "LocationData";

let samplingInterval = 200;
let dataStreamRunning = false;

PubSub.subscribe(StartLocationDataSampling, (msg, data) => {
  if (!data) {
    dataStreamRunning = false;
  } else {
    if (!dataStreamRunning) {
      dataStreamRunning = true;
      startLocationSampling();
    }
  }
});

PubSub.subscribe(PowerUpdates, (msg, data) => {
  if(data == BatteryAlmostDepleted) { 
    samplingInterval = 1000;
  }
  if(data == BatteryHasChargedBackToNormal) { 
    samplingInterval = 200;
  }
  if(data == LowPowerModeEnabled) { 
    samplingInterval = 1000;
  }
  if(data == LowPowerModeDisabled) {
    samplingInterval = 200;
  }
});

const startLocationSampling = () => {
  sampleLocation();
  setTimeout(() => {
    if (dataStreamRunning) {
      startLocationSampling();
    }
  }, samplingInterval);
};

const sampleLocation = async () => {
  await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High})
  .then(res => { 
    PubSub.publish(LocationData, res);
  })
};