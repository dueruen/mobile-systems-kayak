const token = 'e--cx8gNnyU364Z1QCZC'
let URL = 'https://api.onwater.io/api/v1/results/'

/**
 * Queries the OnWater API, and returns true or false, based on whether the 
 * specified lon/lat pair is on water or not
 * @param {String} longitude 
 * @param {String} latitude 
 */
async function isLocationOnWater(longitude, latitude) {
   let queryURL = URL + latitude + "," + longitude + `?access_token=${token}` //Not the most beautiful way of handling the query string

    try {
        let response = await fetch(
          queryURL
        );
        let json = await response.json();
        return json.water
      } catch (error) {
        console.error(error);
      }
}

export default isLocationOnWater