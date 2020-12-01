import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import isLocationOnWater from "../../api/onWater.js";
import MapView, { Polyline, Marker } from "react-native-maps";
import Navbar from "../navbar/Navbar";

/**
 * When we start working with user data, this should probably be remade into
 * a onUserLocationChangedHandler instead
 */
const onPressHandler = async (e) => {
  let onWater = await isLocationOnWater(
    e.nativeEvent.coordinate.longitude,
    e.nativeEvent.coordinate.latitude
  );
  console.log(onWater);
};

const MapScreen = () => {
  const [coordinates, setCoordinates] = useState([]);
  const [pathToAnimate, setPathToAnimate] = useState([
    { latitude: 55.408188, longitude: 10.38392 },
    { latitude: 55.408188, longitude: 10.38492 },
    { latitude: 55.408388, longitude: 10.38592 },
    { latitude: 55.408488, longitude: 10.38622 },
    { latitude: 55.408489, longitude: 10.38735 },
    { latitude: 55.409489, longitude: 10.38935 },
    { latitude: 55.409429, longitude: 10.38993 },
    { latitude: 55.409423, longitude: 10.39113 },
    { latitude: 55.409223, longitude: 10.39113 },
    { latitude: 55.408023, longitude: 10.39113 },
    { latitude: 55.407013, longitude: 10.39013 },
    { latitude: 55.407013, longitude: 10.38513 },
    { latitude: 55.406813, longitude: 10.38313 },
  ]);

  /**
   * useEffect() is ran when componentDidMount and the callback invoke clearInterval()
   */
  useEffect(() => {
    const interval = setInterval(animatePath, 1000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Animate path using shift() to remove element and add to coordinate state
   */
  const animatePath = () => {
    if (pathToAnimate.length > 0) {
      setCoordinates((oldArray) => [...oldArray, pathToAnimate.shift()]);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: 55.408188,
          longitude: 10.383925,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        customMapStyle={generatedMapStyle}
        onPress={onPressHandler}
      >
        {coordinates.length > 0 && (
          <Marker key={1} coordinate={coordinates[0]} title="Start position" />
        )}
        <Polyline
          coordinates={coordinates}
          strokeColor="#5f6af8"
          strokeWidth={4}
        />
      </MapView>
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "white",
  },
  map: {
    flex: 1,
  },
});

const generatedMapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#e7ecf1",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#bdbdbd",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [
      {
        color: "#e5e5e5",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#c2cee0",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
];

export default MapScreen;
