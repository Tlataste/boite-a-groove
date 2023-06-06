/**
 * Checks if the user is authenticated with Spotify.
 * Makes an asynchronous request to the server to fetch the authentication status.
 * Updates the state variable 'isSpotifyAuthenticated' based on the response.
 */
export const checkSpotifyAuthentication = async (setIsSpotifyAuthenticated) => {
  try {
    const response = await fetch("/spotify/is-authenticated");
    const data = await response.json();
    setIsSpotifyAuthenticated(data.status);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Authenticates the user with Spotify.
 *
 * - Checks if the user is already authenticated.
 * - If not authenticated, performs the necessary steps to redirect the user to Spotify's authentication page.
 * - After authentication, the user will be redirected back to the application.
 */
export const authenticateSpotifyUser = async (
  isSpotifyAuthenticated,
  setIsSpotifyAuthenticated
) => {
  try {
    checkSpotifyAuthentication(setIsSpotifyAuthenticated);
    if (!isSpotifyAuthenticated) {
      const response = await fetch("/spotify/auth-redirection");
      const data = await response.json();
      window.location.replace(data.url);
    }
  } catch (error) {
    console.error(error);
  }
};
