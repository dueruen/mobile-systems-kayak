import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import isLocationOnWater from "../../api/onWater.js";
import MapView, { Polyline, Marker } from "react-native-maps";
import Navbar from "../navbar/Navbar";
import PubSub from "pubsub-js";
import { RunDataStream, DataStream, inspvas } from "../../utils/dataGen/index";
import { useFonts, Quicksand_500Medium } from "@expo-google-fonts/quicksand";
import { AppLoading } from "expo";
//import {StartLocationDataSampling, LocationData} from '../../utils/sensorSampler/index'
import * as Animatable from "react-native-animatable";

//Token from subscription so we're able to unsubscribe.
let token;
//let locationToken;
//Used to place tracking notice
const window = Dimensions.get("window");

const AnimatedPolyline = (coordinates) => {
  return (
    <>
      {coordinates.length > 0 && (
        <Marker
          key={1}
          coordinate={coordinates[coordinates.length - 1]}
          title="Start position"
          anchor={{ x: 0.3, y: 0.31 }}
          opacity={0.8}
        >
          <Animatable.Image
            animation="pulse"
            easing="ease-out"
            iterationCount="infinite"
            source={require("../../assets/img/circle.png")}
            style={{ height: 18, width: 18 }}
          ></Animatable.Image>
        </Marker>
      )}
      <Polyline
        coordinates={coordinates}
        strokeColor="#5f6af8"
        strokeWidth={4}
      />
    </>
  );
};

const MapScreen = () => {
  const [coordinates, setCoordinates] = useState([]);
  const mapRef = React.useRef(null);

  const [isTracking, setIsTracking] = useState(false);
  let [fontsLoaded] = useFonts({
    Quicksand_500Medium,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  const height = window.height;

  function toggle() {
    setIsTracking(!isTracking);
  }

  /**
   * useEffect() is ran when componentDidMount and the callback invoke clearInterval()
  */
  useEffect(() => {
    //Start streaming when componentIsMounted
    streamData();
    //NOT USED ATM - const interval = setInterval(animatePath, 1000);
    return () => {
      //NOT USED ATM - clearInterval(interval);
      PubSub.unsubscribe(token);
    };
  }, []);

  const streamData = () => {
    //Start the dataStream
    PubSub.publish(RunDataStream, true);

    //Subscribe to the data stream
    token = PubSub.subscribe(DataStream, (msg, data) => {
      if (data.message === inspvas) {
        let coordinate = {
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
        };

        setCoordinates((oldArray) => [...oldArray, coordinate]);
      }
    });
  };

  /**
   * When we start working with user data, this should probably be remade into
   * a onUserLocationChangedHandler instead
  */
  const onPressHandler = async (e) => {
    takeSnapshotWater()
  };

  function takeSnapshotWater() {
    mapRef.current.takeSnapshot({
        width: 31, // optional, when omitted the view-width is used
        height: 31, // optional, when omitted the view-height is used
        format: 'png', // image formats: 'png', 'jpg' (default: 'png')
        result: 'base64'
    })
    .then((base64) => {
      isLocationOnWater(base64).then((res) => {
        console.log("IS ON WATER:: " + res)
      })
    })
    .catch((err) => {
        throw new Error(err)
    })
  }

  return (
    <View style={styles.container}>
      <MapView
      style={styles.map}
      region={{
        latitude: coordinates[coordinates.length - 1].latitude,
        longitude: coordinates[coordinates.length - 1].longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      }}
      ref={mapRef}
      customMapStyle={generatedMapStyle}
      onPress={onPressHandler}
    >
      {isTracking && <AnimatedPolyline coordinates={coordinates}/>}
    </MapView>
            <TouchableOpacity
        style={{
          padding: 15,
          borderRadius: 30,
          position: "absolute",
          backgroundColor: isTracking
            ? "rgba(60, 179, 113, 0.8)"
            : "rgba(95, 106, 248, 0.8)",
          top: height / 8,
          left: "30%",
          justifyContent: "center",
          alignItems: "center",
          width: window.height / 4 - 5,
        }}
        onPress={toggle}
      >
        <Text style={{ fontFamily: "Quicksand_500Medium", color: "white" }}>
          {isTracking ? "TRACKING" : "START TRACKING"}
        </Text>
      </TouchableOpacity>
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