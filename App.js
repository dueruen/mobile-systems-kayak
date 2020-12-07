import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts, Quicksand_500Medium } from "@expo-google-fonts/quicksand";

import DataScreen from "./components/dataScreen/DataScreen";
import CurrentScreen from "./components/currentScreen/CurrentScreen";
import MapScreen from "./components/mapScreen/mapScreen";
import { AppLoading } from "expo";

import {requestAndroidLocationPermission} from './utils/permissionHandler/index'

const Stack = createStackNavigator();


export default function App() {
  let [fontsLoaded] = useFonts({
    Quicksand_500Medium,
  });

  requestAndroidLocationPermission();

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Current" component={CurrentScreen} />
        <Stack.Screen name="Data" component={DataScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
