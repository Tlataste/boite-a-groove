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
