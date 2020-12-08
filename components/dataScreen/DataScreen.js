import React from "react";
import { AppLoading } from "expo";
import { Text, View, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useFonts, Quicksand_500Medium } from "@expo-google-fonts/quicksand";

import Navbar from "../navbar/Navbar";

const DataScreen = () => {
  let [fontsLoaded] = useFonts({
    Quicksand_500Medium,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontFamily: "Quicksand_500Medium",
          color: "black",
          fontSize: 20,
        }}
      >
        Logdata
      </Text>
      <View style={styles.graphContainer}>
        <AnimatedCircularProgress
          size={96}
          padding={10}
          lineCap="round"
          width={10}
          fill={75}
          tintColor="#7fe1ad"
          onAnimationComplete={() => console.log("onAnimationComplete")}
          backgroundColor="#dee2e6"
        >
          {(fill) => (
            <Text
              style={{
                fontFamily: "Quicksand_500Medium",
                color: "#7fe1ad",
                fontSize: 16,
              }}
            >
              {fill}%
            </Text>
          )}
        </AnimatedCircularProgress>
        <AnimatedCircularProgress
          size={96}
          width={10}
          lineCap="round"
          padding={10}
          fill={75}
          tintColor="#f85f6a"
          onAnimationComplete={() => console.log("onAnimationComplete")}
          backgroundColor="#dee2e6"
        >
          {(fill) => (
            <Text
              style={{
                fontFamily: "Quicksand_500Medium",
                color: "#f85f6a",
                fontSize: 16,
              }}
            >
              {fill}%
            </Text>
          )}
        </AnimatedCircularProgress>
        <AnimatedCircularProgress
          size={96}
          padding={10}
          lineCap="round"
          width={10}
          fill={75}
          tintColor="#5f6af8"
          onAnimationComplete={() => console.log("onAnimationComplete")}
          backgroundColor="#dee2e6"
        >
          {(fill) => (
            <Text
              style={{
                fontFamily: "Quicksand_500Medium",
                color: "#5f6af8",
                fontSize: 16,
              }}
            >
              {fill}%
            </Text>
          )}
        </AnimatedCircularProgress>
      </View>
      <Navbar view="data" />
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
  graphContainer: {
    padding: 25,
    flexDirection: "row",
  },
});
export default DataScreen;
