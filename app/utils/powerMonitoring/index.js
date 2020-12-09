import * as Battery from 'expo-battery';
import PubSub from "pubsub-js";

/*
Thresholds for triggering Android battery events:
Falling below 15%
Rising above 20%
*/

//Topics
export const PowerUpdates = 'PowerUpdates'

//Messages
export const BatteryAlmostDepleted = 'BatteryAlmostDepleted'
export const BatteryHasChargedBackToNormal = 'BatteryHasChargedBackToNormal'
export const LowPowerModeEnabled = 'LowPowerModeEnabled'
export const LowPowerModeDisabled = ' LowPowerModeDisabled'

export const startBatteryListener = () => {
    Battery.addLowPowerModeListener((res) => { 
        if(res.lowPowerMode == true) {
            lowPowerModeEnabled()
        }

        if(res.lowPowerMode == false) {
            lowPowerModeDisabled()
        }

    })

    Battery.addBatteryLevelListener((res) => {
        if(res.batteryLevel >= 0.20) { 
            batteryHasChargedBackToNormal();
        }
        if(res.batteryLevel <= 0.15) { 
            batteryAlmostDepleted();
        }
    })

    //Do we need to know if the user is charging? 
    //Battery.addBatteryStateListener((res) => { 
    //    console.log("Battery state listener:")
    //    console.log(res)
    //})
}

const lowPowerModeEnabled = () => {
    console.log("lowPowerModeEnabled")
    PubSub.publish(PowerUpdates, LowPowerModeEnabled)

}

const lowPowerModeDisabled = () => {
    console.log("lowPowerModeDisabled")
    PubSub.publish(PowerUpdates, LowPowerModeDisabled)

}

const batteryAlmostDepleted = () => {
    console.log("batteryAlmostDepleted")
    PubSub.publish(PowerUpdates, BatteryAlmostDepleted)

}

const batteryHasChargedBackToNormal = () => { 
    console.log("batteryHasChargedBackToNormal")
    PubSub.publish(PowerUpdates, BatteryHasChargedBackToNormal)

}