// eslint-disable-next-line no-unused-vars
import { request } from './helpers';
/**
 * Pull vehicles information
 *
 * @return {Promise<Array.<vehicleSummaryPayload>>}
 */
// TODO: All API related logic should be made inside this function.
export default async function getData() {
  try {
    const allVehicles = await request('/api/vehicles.json');

    const vehiclesDetailsApiCall = allVehicles.map((vehicle) => request(vehicle.apiUrl));
    const vehiclesDetails = await Promise.allSettled(vehiclesDetailsApiCall);

    const validVehiclesResults = vehiclesDetails
      .filter((result) => result.status === 'fulfilled' && result.value.price)
      .map((result) => result.value);

    const validVehiclesWithDetails = validVehiclesResults.map(
      (validVehicle) => ({
        ...validVehicle,
        ...allVehicles.find((vehicle) => vehicle.id === validVehicle.id),
      })
    );

    return validVehiclesWithDetails;
  } catch (error) {
    throw new Error(error.message);
  }
}
