import PubSub from "pubsub-js";
import * as Location from 'expo-location';
import {PowerUpdates, BatteryAlmostDepleted, BatteryHasChargedBackToNormal, LowPowerModeEnabled, LowPowerModeDisabled} from '../powerMonitoring/index'

// Subscribtion types
export const StartLocationDataSampling = "StartLocationDataSampling";
export const LocationData = "LocationData";

let dataPublishInterval = 200;
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
    dataPublishInterval = 1000;
  }
  if(data == BatteryHasChargedBackToNormal) { 
    dataPublishInterval = 200;
  }
  if(data == LowPowerModeEnabled) { 
    dataPublishInterval = 1000;
  }
  if(data == LowPowerModeDisabled) {
    dataPublishInterval = 200;
  }
});

const startLocationSampling = () => {
  sampleLocation();
  setTimeout(() => {
    if (dataStreamRunning) {
      startLocationSampling();
    }
  }, dataPublishInterval);
};

const sampleLocation = async () => {
  await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High})
  .then(res => { 
    PubSub.publish(LocationData, res);
  })
};