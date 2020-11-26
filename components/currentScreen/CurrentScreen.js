import { AppLoading } from "expo";
import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import Navbar from "../navbar/Navbar";
import { useFonts, Quicksand_500Medium } from "@expo-google-fonts/quicksand";

const backgroundImage = {
  uri: require("../../assets/img/kayak.jpg"),
};

const CurrentScreen = () => {
  let [fontsLoaded] = useFonts({
    Quicksand_500Medium,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={{ backgroundImage }} style={styles.image}>
        <Text
          style={{
            fontFamily: "Quicksand_500Medium",
            color: "black",
            fontSize: 20,
          }}
        >
          Current position
        </Text>
        <Text
          style={{
            fontFamily: "Quicksand_500Medium",
            color: "#888",
            fontSize: 14,
          }}
        >
          In water
        </Text>
      </ImageBackground>
      <Navbar />
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
