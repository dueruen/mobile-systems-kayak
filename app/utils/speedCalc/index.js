/**
 * Calculates speed in m/s, based on north, east and up velocity in m/s
 * @param {float} vNorth 
 * @param {float} vEast 
 * @param {float} vUp 
 */
export const calculateSpeedFromVelocityData = (vNorth, vEast, vUp) => {
    let speed = Math.sqrt(Math.pow(vEast,2) + Math.pow(vNorth,2) + Math.pow(vUp,2))
    return speed
}
