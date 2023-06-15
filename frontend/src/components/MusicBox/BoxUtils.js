import { getCookie } from "../Security/TokensUtils";

/**
 * Retrieves the details of a Music Box.
 * @param {string} boxName - The name of the box to retrieve details for.
 * @param {function} navigate - The navigation function used to redirect to a different page.
 * @returns {Promise<Object>} A Promise that resolves to an object containing the box details.
 * The box details object returned has the following structure:
 * {
 *    box: {
 *      id: number,
 *      name: string,
 *      description: string,
 *      url: string,
 *      latitude: string,
 *      longitude: string,
 *      image_url: string,
 *      created_at: string,
 *      updated_at: string,
 *      client_name: string
 *    },
 *    last_deposits: Array<{
 *      id: number,
 *      title: string,
 *      artist: string,
 *      url: string,
 *      image_url: string,
 *      duration: number,
 *      platform_id: number,
 *      n_deposits: number
 *    }>,
 *    deposit_count: number
 * }
 */
export const getBoxDetails = async (boxName, navigate) => {
  try {
    const response = await fetch("/box-management/get-box?name=" + boxName);
    if (!response.ok) {
      navigate("/");
      return [];
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

/**
 * Retrieves the current geolocation coordinates of the user.
 * @returns {Promise<GeolocationPosition>} A Promise that resolves to a GeolocationPosition object containing the user's coordinates.
 * @throws {string} If geolocation is not supported by the browser, an error message is thrown.
 */
function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
}

/**
 * Checks if the user's current location matches the location of the Music Box. If not, redirects him to the home page.
 * @param {Object} data - The box information object containing all the box details.
 * @param {function} navigate - The navigation function used to redirect to a different page.
 * @returns {Promise<void>} A Promise that resolves once the location verification is completed.
 * If the user's location does not match the box location or an error occurs, the Promise is rejected.
 */
export const checkLocation = async (data, navigate) => {
  try {
    const position = await getLocation();

    const { latitude, longitude } = position.coords;
    const boxLatitude = data.box.latitude;
    const boxLongitude = data.box.longitude;

    const csrftoken = getCookie("csrftoken");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken },
      body: JSON.stringify({
        latitude: latitude,
        longitude: longitude,
        box_latitude: boxLatitude,
        box_longitude: boxLongitude,
      }),
    };
    const verificationResponse = await fetch(
      "../box-management/verify-location",
      requestOptions
    );
    console.log(verificationResponse);
    if (!verificationResponse.ok) {
      navigate("/");
    }
  } catch {
    navigate("/");
  }
};