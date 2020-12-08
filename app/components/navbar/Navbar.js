import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

const Navbar = (props) => {
  const navigation = useNavigation();

  const iconColor = props.color;
  const currentView = props.view;

  return (
    <View style={styles.container}>
      <View style={styles.navbarLink}>
        <Icon
          name="map"
          solid={currentView === "current" ? true : false}
          color={currentView === "current" ? "#5f6af8" : "#aaaaaa"}
          type="font-awesome-5"
          onPress={(e) => {
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
            navigation.navigate("Map");
          }}
        />
      </View>
      <View style={styles.navbarLink}>
        <Icon
          name="signal"
          solid={currentView === "data" ? true : false}
          color={currentView === "data" ? "#5f6af8" : "#aaaaaa"}
          type="font-awesome-5"
          onPress={() => {
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
