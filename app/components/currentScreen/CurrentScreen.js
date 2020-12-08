import { AppLoading } from "expo";
import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import Navbar from "../navbar/Navbar";
import {
  useFonts,
  Quicksand_500Medium,
  Quicksand_700Bold,
} from "@expo-google-fonts/quicksand";

const CurrentScreen = () => {
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
          Current position
        </Text>
        <Text
          style={{
            fontFamily: "Quicksand_500Medium",
            color: "#F5F5F5",
            fontSize: 14,
          }}
        >
          In water
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
