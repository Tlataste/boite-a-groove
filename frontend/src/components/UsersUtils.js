export const logoutUser = async (setAuthenticated) => {
  try {
    const response = await fetch("/users/logout_user");
    console.log(response);
    // const data = await response.json();
    if (response.ok) {
      setAuthenticated(false);
    } else {
      console.error("Can't disconnect because not connected");
    }
  } catch (error) {
    console.error(error);
  }
};
