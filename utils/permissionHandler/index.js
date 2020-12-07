import * as Permissions from 'expo-permissions';

export const requestAndroidLocationPermission = async() => { 
    const { status } = await Permissions.getAsync(Permissions.LOCATION);
    let finalStatus = status;
    if (status !== 'granted') {
      console.log('not granted')
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      finalStatus = status;
    }
    if (finalStatus == 'granted') {
      return;
    }
}