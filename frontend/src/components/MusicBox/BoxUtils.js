import { getCookie } from "../Security/TokensUtils";
/**
 * Retrieves details of a box from the server.
 * @param {string} boxName - The name of the box to retrieve details for.
 * @param {function} navigate - A function to navigate to a specific URL or route.
 * @returns {Promise} - A promise that resolves to the box details.
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
    return [];
  }
};

function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
}

// Data = toutes les infos de la box
export const checkLocation = async (data, navigate) => {
  const position = await getLocation();
  if (position) {
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
      return [];
    }
  } else {
    navigate("/");
    return [];
  }
};
