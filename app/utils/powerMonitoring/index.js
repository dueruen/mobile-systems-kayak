import * as Battery from 'expo-battery';
import PubSub from "pubsub-js";

//Topics
export const PowerUpdates = 'PowerUpdates'

//Messages
export const BatteryAlmostDepleted = 'BatteryAlmostDepleted'
export const BatteryHasChargedBackToNormal = 'BatteryHasChargedBackToNormal'
export const LowPowerModeEnabled = 'LowPowerModeEnabled'
export const LowPowerModeDisabled = ' LowPowerModeDisabled'

export const startBatteryListener = async() => {

    //In case low power mode is enabled upon starting the app
    await Battery.isLowPowerModeEnabledAsync()
    .then(res => {
        if(res.lowPowerMode) { 
            lowPowerModeEnabled()
        }
    })

    //In case app is started when battery is low
    await Battery.getBatteryLevelAsync()
    .then(res => {
        if(res.batteryLevel <= 0.16) { //set threshold to 0.16 due to Android throwing event at  0.150000006
            batteryAlmostDepleted();
        }
    })

    Battery.addLowPowerModeListener((res) => { 
        res.lowPowerMode ? lowPowerModeEnabled() : lowPowerModeDisabled()
    })

    Battery.addBatteryLevelListener((res) => {
        console.log(res)
        if(res.batteryLevel >= 0.20) { 
            batteryHasChargedBackToNormal();
        }
        if(res.batteryLevel <= 0.16) { //set threshold to 0.16 due to Android throwing event at  0.150000006
            batteryAlmostDepleted();
        }
    })

    //Do we need to know if the user is charging? 
    //Battery.addBatteryStateListener((res) => { 
    //    console.log("Battery state listener:")
    //    console.log(res)
    //})
}

/**
 * Low power mode has been enabled on the phone
 */
const lowPowerModeEnabled = () => {
    PubSub.publish(PowerUpdates, LowPowerModeEnabled)

}

/**
 * Low power mode has been disabled on the phone
 */
const lowPowerModeDisabled = () => {
    PubSub.publish(PowerUpdates, LowPowerModeDisabled)

}

/**
 * Battery has depleted to the point of 15% power
 */
const batteryAlmostDepleted = () => {
    PubSub.publish(PowerUpdates, BatteryAlmostDepleted)

}

/**
 * Battery has regained power above 20%
 */
const batteryHasChargedBackToNormal = () => { 
    PubSub.publish(PowerUpdates, BatteryHasChargedBackToNormal)

}