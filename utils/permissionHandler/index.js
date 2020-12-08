import * as Permissions from 'expo-permissions';

/**
 * Requests permission to sample user location
 */
export const requestAndroidLocationPermission = async() => { 
    //Check of permission is already granted
    const { checkStatus } = await Permissions.getAsync(Permissions.LOCATION);
    let finalStatus = checkStatus;
    
    if (finalStatus == 'granted') {
      return;
    }
    
    //else request permission
    const { askStatus } = await Permissions.askAsync(Permissions.LOCATION);
    finalStatus = askStatus;
    
}