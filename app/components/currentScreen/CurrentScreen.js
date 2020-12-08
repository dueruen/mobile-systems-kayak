import { AppLoading } from "expo";
import React, { useState, useEffect } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import Navbar from "../navbar/Navbar";
import {
  useFonts,
  Quicksand_500Medium,
  Quicksand_700Bold,
} from "@expo-google-fonts/quicksand";
import PubSub from "pubsub-js";
import { RunDataStream, DataStream, inspvas } from "../../utils/dataGen/index";
import { calculateSpeedFromVelocityData } from "../../utils/speedCalc/index";

let token;

const CurrentScreen = () => {
  const [currentSpeed, setCurrentSpeed] = useState(0);
  //const [currentPosition, setCurrentPosition] = useState(true);
  /**
   * useEffect() is ran when componentDidMount and the callback invoke clearInterval()
   */
  useEffect(() => {
    //Start streaming when componentIsMounted
    streamData();
    return () => {
      PubSub.unsubscribe(token);
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
        //console.log(currentSpeed);
      }
    });
  };

  let [fontsLoaded] = useFonts({
    Quicksand_500Medium,
    Quicksand_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/img/kayak.jpg")}
        style={styles.image}
      >
        <Text
          style={{
            fontFamily: "Quicksand_700Bold",
            color: "#FFF",
            fontSize: 20,
          }}
        >
          Current speed
        </Text>
        <Text
          style={{
            fontFamily: "Quicksand_500Medium",
            color: currentSpeed * 3.6 < 18 ? "#8DE4AE" : "#E75950",
            fontSize: 15,
            paddingTop: 5,
          }}
        >
          {(currentSpeed * 3.6).toFixed(2)} km/t
        </Text>
        <Text
          style={{
            fontFamily: "Quicksand_700Bold",
            color: "#FFF",
            fontSize: 20,
            paddingTop: 10,
          }}
        >
          Current position
        </Text>
        <Text
          style={{
            fontFamily: "Quicksand_500Medium",
            color: "#F5F5F5",
            fontSize: 25,
            paddingTop: 3,
          }}
        >
          {currentSpeed * 3.6 < 18 ? "🚣" : "🚗"}
        </Text>
      </ImageBackground>
      <Navbar view="current" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CurrentScreen;
