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
import {
  useFonts,
  Quicksand_500Medium,
  Quicksand_700Bold,
} from "@expo-google-fonts/quicksand";
import { AppLoading } from "expo";
//import {StartLocationDataSampling, LocationData} from '../../utils/sensorSampler/index'
import * as Animatable from "react-native-animatable";
import { calculateSpeedFromVelocityData } from "../../utils/speedCalc/index";

//Token from subscription so we're able to unsubscribe.
let token;

//Used to place tracking notice
const window = Dimensions.get("window");

const AnimatedPolyline = (props) => {
  const [coordinates, setCoordinates] = useState([]);
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
      PubSub.publish(RunDataStream, false);
      //      PubSub.unsubscribe(locationToken);
    };
  }, []);

  const streamData = () => {
    //Start the dataStream
    PubSub.publish(RunDataStream, true);
    //    PubSub.publish(StartLocationDataSampling, true);

    //Subscribe to the data stream
    token = PubSub.subscribe(DataStream, (msg, data) => {
      if (data.message === inspvas) {
        let coordinate = {
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
        };

        props.setCoordinate(coordinate);
        setCoordinates((oldArray) => [...oldArray, coordinate]);
      }
    });
  };

  return (
    <>
      {coordinates.length > 0 && (
        <Marker
          key={1}
          coordinate={coordinates[coordinates.length - 1]}
          title="Start position"
          anchor={{ x: 0.45, y: 0.5 }}
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
  const [coordinate, setCoordinate] = useState({});
  const [isTracking, setIsTracking] = useState(false);
  const [inWater, setInWater] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(0);

  useEffect(() => {
    //Check every 3 second
    const interval = setInterval(takeSnapshotWater, 3000);
    //Start streaming when componentIsMounted
    streamData();
    return () => {
      clearInterval(interval);
      PubSub.unsubscribe(token);
      PubSub.publish(RunDataStream, false);
    };
  }, []);

  const streamData = () => {
    //Start the dataStream
    PubSub.publish(RunDataStream, true);

    //Subscribe to the data stream
    token = PubSub.subscribe(DataStream, (msg, data) => {
      if (data.message === inspvas) {
        let speed = calculateSpeedFromVelocityData(
          parseFloat(data.north_velocity),
          parseFloat(data.east_velocity),
          parseFloat(data.up_velocity)
        );

        setCurrentSpeed(speed);
      }
    });
  };

  const mapRef = React.useRef(null);

  let [fontsLoaded] = useFonts({
    Quicksand_500Medium,
    Quicksand_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  const height = window.height;

  function toggle() {
    setIsTracking(!isTracking);
  }

  /**
   * When we start working with user data, this should probably be remade into
   * a onUserLocationChangedHandler instead
   */
  const onPressHandler = async (e) => {
    takeSnapshotWater();
  };

  function takeSnapshotWater() {
    mapRef.current
      .takeSnapshot({
        width: 31, // optional, when omitted the view-width is used
        height: 31, // optional, when omitted the view-height is used
        format: "png", // image formats: 'png', 'jpg' (default: 'png')
        result: "base64",
      })
      .then((base64) => {
        isLocationOnWater(base64).then((res) => {
          setInWater(res);
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: coordinate.latitude ?? 40.204046791327,
          longitude: coordinate.longitude ?? -88.38675184236,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }}
        ref={mapRef}
        customMapStyle={generatedMapStyle}
        onPress={onPressHandler}
      >
        {isTracking && <AnimatedPolyline setCoordinate={setCoordinate} />}
      </MapView>
      <View
        style={{
          position: "absolute",
          top: 50,
          flexDirection: "row",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <View
          style={{
            width: "90%",
            borderRadius: 15,
            height: 130,
            backgroundColor: "white",
            alignItems: "flex-start",
            paddingLeft: 40,
            paddingTop: 10,
            flexDirection: "row",
          }}
        >
          <View>
            <Text style={{ fontFamily: "Quicksand_700Bold" }}>
              Current speed
            </Text>
            <Text>{isTracking ? (currentSpeed * 3.6).toFixed(2) : 0} km/t</Text>
          </View>
          <View style={{ paddingLeft: 40 }}>
            <Text style={{ fontFamily: "Quicksand_700Bold" }}>
              Current position
            </Text>
            <Text>{inWater ? "In water" : "Not in water"}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={{
          padding: 15,
          borderRadius: 30,
          position: "absolute",
          backgroundColor: isTracking
            ? "rgba(60, 179, 113, 0.8)"
            : "rgba(95, 106, 248, 0.8)",
          top: height / 6,
          alignSelf: "center",
          justifyContent: "center",
          alignItems: "center",
          width: "70%",
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
    flex: 1,
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
