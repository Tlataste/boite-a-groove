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
    // console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
