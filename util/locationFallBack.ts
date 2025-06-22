// A global variable to store the callback function
let updateLocationCallback: (location: { latitude: number; longitude: number; heading?: number | null }) => void = () => {};

/**
 * Sets the callback function to be called when the location is updated.
 * @param callback A function that takes a location object.
 */
export const setUpdateLocationCallback = (
  callback: (location: { latitude: number; longitude: number; heading?: number | null }) => void
) => {
  updateLocationCallback = callback;
};

/**
 * Calls the current callback with the given location, if set.
 * @param location The location data to pass to the callback.
 */
export const invokeUpdateLocationCallback = (location: { latitude: number; longitude: number; heading?: number | null }) => {
  if (updateLocationCallback) {
    updateLocationCallback(location);
  }
};
