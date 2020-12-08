let URL = "http://192.168.87.51:3000";

/**
 * Queries the OnWater API, and returns true or false, based on whether the
 * specified lon/lat pair is on water or not
 * @param {String} longitude
 * @param {String} latitude
 */
//async function isLocationOnWater(longitude, latitude) {
async function isLocationOnWater(base64Image) {
  let queryURL = `${URL}`;

  try {
    let response = await fetch(queryURL, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Content-Length": base64Image.length,
      },
      body: JSON.stringify({ base64Image: base64Image }),
    });
    let json = await response.json();
    return json.water;
  } catch (error) {
    console.error(error);
  }
}

export default isLocationOnWater;
