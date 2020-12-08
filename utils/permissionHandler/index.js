import * as Permissions from 'expo-permissions';

/**
 * Requests permission to sample user location
 */
export const requestAndroidLocationPermission = async() => { 
    //Check of permission is already granted
    const { status } = await Permissions.getAsync(Permissions.LOCATION);
    let finalStatus = status;
    
    if (finalStatus == 'granted') {
      return;
    }
    if (finalStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      finalStatus = status;
    }
    
}