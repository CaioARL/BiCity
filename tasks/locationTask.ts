import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { invokeUpdateLocationCallback } from '../util/locationFallBack';

export const LOCATION_TASK = 'background-location-task';

// Define the background task
TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error('Background location task error:', error.message);
    return;
  }

  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    if (locations && locations.length > 0) {
      const location = locations[0];
      console.log('New background location:');

      // Invoke the global callback
      invokeUpdateLocationCallback({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        heading: location.coords.heading || null,
      });
    }
  }
});
