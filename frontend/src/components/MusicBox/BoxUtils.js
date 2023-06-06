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
