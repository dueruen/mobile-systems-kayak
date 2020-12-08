import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import isLocationOnWater from "../../api/onWater.js";
import MapView, { Polyline, Marker } from "react-native-maps";
import Navbar from "../navbar/Navbar";
import PubSub from "pubsub-js";
import { RunDataStream, DataStream, inspvas } from "../../utils/dataGen/index";

//Token from subscription so we're able to unsubscribe.
let token;

const AnimatedPolyline = (coordinates) => {
  
  const [pathToAnimate, setPathToAnimate] = useState([]);

  /** NOT USED ATM
   * Animate path using shift() to remove element and add to coordinate state
   */
  //const animatePath = (coordinate) => {
  //  if (pathToAnimate.length > 0) {
  //    setCoordinates((oldArray) => [...oldArray, coordinate]);
  //  }
  //};

  return (
    <Polyline coordinates={coordinates} strokeColor="#5f6af8" strokeWidth={4} />
  );
};

const MapScreen = () => {
  const [coordinates, setCoordinates] = useState([]);
  const [mapSnapshot, setMapSnapshot] = useState();
  const mapRef = React.useRef(null);

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
    // let onWater = await isLocationOnWater(
    //   e.nativeEvent.coordinate.longitude,
    //   e.nativeEvent.coordinate.latitude
    // );
    //console.log(onWater);
    console.log("PRESS");
    takeSnapshot()
    takeSnapshotWater()
  };

  function takeSnapshot() {
    mapRef.current.takeSnapshot({
        width: 31, // optional, when omitted the view-width is used
        height: 31, // optional, when omitted the view-height is used
        format: 'png', // image formats: 'png', 'jpg' (default: 'png')
        //quality: 0.8, // image quality: 0..1 (only relevant for jpg, default: 1)
        result: 'file' // result types: 'file', 'base64' (default: 'file')
        //result: 'base64'
    })
    .then((uri) => {
// Set the uri on the mapImage state
console.log("URI::")
console.log(uri)
setMapSnapshot(uri);
    })
    .catch((err) => {
        throw new Error(err)
    })
}

function takeSnapshotWater() {
  mapRef.current.takeSnapshot({
      width: 31, // optional, when omitted the view-width is used
      height: 31, // optional, when omitted the view-height is used
      format: 'png', // image formats: 'png', 'jpg' (default: 'png')
      //quality: 0.8, // image quality: 0..1 (only relevant for jpg, default: 1)
      //result: 'file' // result types: 'file', 'base64' (default: 'file')
      result: 'base64'
  })
  .then((base64) => {
    console.log("IMAGE")
    console.log(base64)
    isLocationOnWater(base64).then((res) => {
      console.log("IS ON WATER:: " + res)
    })
    // pixels(base64).then((data, width, height) => {
    //   console.log("HERE!!!")
    //   console.log(data)
    //   console.log(width + "  " + height)
    // })

    // Set the uri on the mapImage state
//var image = new Image();
//image.src = "data:image/png;base64," + base64;
// var canvas = new Canvas();
// canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);

// var pixelData = canvas.getContext('2d').getImageData(0, 0, image.width, image.height).data;
// console.log("PIXEL")
// console.log(pixelData)
  })
  .catch((err) => {
      throw new Error(err)
  })
}

  return (
    <View style={styles.container}>
            {/* <View
        style={{
          height: '55%'
        }}>
        <Image
          // Using react native elements we render a placeholder 
          PlaceholderContent={< ActivityIndicator />}
          source={{
          // Once the mapImage uri is set <Image> replaces the placeholder with it
          uri: mapSnapshot
          }}
          style={{
          width: '100%',
          height: '100%'
          }}
          containerStyle={{
          overflow: "hidden"
          }}
        />
      </View> */}
      { coordinates.length != 0 &&
      <MapView
      style={styles.map}
      region={{
        //latitude: 40.204046791327,
        //longitude: -88.38675184236,
        latitude: coordinates[coordinates.length - 1].latitude,
        longitude: coordinates[coordinates.length - 1].longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      }}
      ref={mapRef}
      customMapStyle={generatedMapStyle}
      onPress={onPressHandler}
    >
      {/*coordinates.length > 0 && (
        <Marker key={1} coordinate={coordinates[0]} title="Start position" />
      )*/}
      {/* <AnimatedPolyline coordinates={coordinates}/> */}
      <Polyline coordinates={coordinates} strokeColor="#5f6af8" strokeWidth={4} />
    </MapView>
      }
      <Navbar />
      
      {/* <TouchableOpacity onPress={takeSnapshot}>
        Take Snapshot
      </TouchableOpacity> */}
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
