/**
 * Logs out the current user by sending a request to the "/users/logout_user" endpoint.
 * If the logout is successful, it sets the user to null and sets the isAuthenticated flag to false.
 * @param {Function} setUser - The function to set the user value.
 * @param {Function} setIsAuthenticated - The function to set the isAuthenticated flag.
 * @returns {Promise<void>} - A promise that resolves when the logout process is completed.
 * @throws {Error} - If an error occurs during the logout process.
 */
export const logoutUser = async (setUser, setIsAuthenticated) => {
  try {
    const response = await fetch("/users/logout_user");
    console.log(response);
    // const data = await response.json();
    if (response.ok) {
      setIsAuthenticated(false);
      setUser(null);
    } else {
      console.error("Can't disconnect because not connected");
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * Checks the status of the user's authentication by sending a request to the "/users/check-authentication" endpoint.
 * If the user is authenticated, it sets the user data, and the isAuthenticated flag to true.
 * @param {Function} setUser - The function to set the user value.
 * @param {Function} setIsAuthenticated - The function to set the isAuthenticated flag.
 * @returns {Promise<void>} - A promise that resolves when the user status is checked.
 * @throws {Error} - If an error occurs during the status check.
 */
export const checkUserStatus = async (setUser, setIsAuthenticated) => {
  try {
    const response = await fetch("/users/check-authentication");
    const data = await response.json();
    if (response.ok) {
      console.log("Authenticated");
      setUser(data);
      setIsAuthenticated(true);
    } else {
      console.log("Not authenticated");
    }
  } catch (error) {
    console.error(error);
  }
};
