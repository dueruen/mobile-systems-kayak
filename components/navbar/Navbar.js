import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

const Navbar = () => {
  const navigation = useNavigation();

  const [currentRoute, setRoute] = useState("Current");

  return (
    <View style={styles.container}>
      <View style={styles.navbarLink}>
        <Icon
          name="map"
          solid={currentRoute === "Current" ? true : false}
          color={currentRoute === "Current" ? "#5f6af8" : "#aaaaaa"}
          type="font-awesome-5"
          onPress={(e) => {
            setRoute("Current");
            navigation.navigate("Current");
          }}
        />
      </View>
      <View style={styles.centerButtonContainer}>
        <Icon
          containerStyle={styles.bigIcon}
          size={30}
          reverse={true}
          name="map-pin"
          color="#5f6af8"
          type="font-awesome-5"
          onPress={() => {
            setRoute("Map");
            navigation.navigate("Map");
          }}
        />
      </View>
      <View style={styles.navbarLink}>
        <Icon
          name="signal"
          solid={currentRoute === "Data" ? true : false}
          color={currentRoute === "Data" ? "#5f6af8" : "#aaaaaa"}
          type="font-awesome-5"
          onPress={() => {
            setRoute("Data");
            navigation.navigate("Data");
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centerButtonContainer: {
    backgroundColor: "#fff",
    width: "20%",
    justifyContent: "center",
    marginBottom: 50,
  },
  bigIcon: {
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 15,
    shadowRadius: 5,
    shadowColor: "#5f6af8",
  },
  container: {
    width: "100%",
    flex: 1,
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
    height: 70,
  },
  navbarLink: {
    backgroundColor: "#fff",
    width: "40%",
    justifyContent: "center",
  },
});

export default Navbar;
