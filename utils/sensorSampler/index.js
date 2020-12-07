import PubSub from "pubsub-js";
import * as Location from 'expo-location';

// Subscribtion types
export const StarLocationDataSampling = "StartLocationDataSampling";
export const LocationData = "LocationData";

let dataStreamRunning = false;

PubSub.subscribe(StarLocationDataSampling, (msg, data) => {
  if (!data) {
    dataStreamRunning = false;
  } else {
    if (!dataStreamRunning) {
      dataStreamRunning = true;
      startLocationSampling();
    }
  }
});


const startLocationSampling = async () => {
  await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High})
  .then(res => { 
    PubSub.publish(LocationData, res);
  })
  
};