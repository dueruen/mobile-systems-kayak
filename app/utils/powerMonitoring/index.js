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

const lowPowerModeEnabled = () => {
    PubSub.publish(PowerUpdates, LowPowerModeEnabled)

}

const lowPowerModeDisabled = () => {
    PubSub.publish(PowerUpdates, LowPowerModeDisabled)

}

const batteryAlmostDepleted = () => {
    PubSub.publish(PowerUpdates, BatteryAlmostDepleted)

}

const batteryHasChargedBackToNormal = () => { 
    PubSub.publish(PowerUpdates, BatteryHasChargedBackToNormal)

}