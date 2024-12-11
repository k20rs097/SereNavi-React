import axios from "axios";
import Formatters from "./Formatters";
import setPhase from "../App"

class ApiService {
  static fetchReverseGeocoding = async (
    currentPosition,
    location,
    locationType
  ) => {
    if (!currentPosition) {
      console.log("Invalid currentPosition", currentPosition);
      return;
    }
    // console.log("currentPosition: ", currentPosition);
    // console.log("location: ", location);
    const requestUrl = `https://nominatim.openstreetmap.org/reverse`;

    try {
      // console.log(`locationType: ${locationType}`);
      const response = await axios.get(requestUrl, {
        params: {
          lat:
            locationType === "destination"
              ? location?.latitude
              : currentPosition.latitude,
          lon:
            locationType === "destination"
              ? location?.longitude
              : currentPosition.longitude,
          format: "json",
          addressdetails: "1",
        },
      });

      const formattedLocation = {
        ...response.data,
        latitude:
          locationType === "destination"
            ? location.latitude
            : currentPosition.latitude,
        longitude:
          locationType === "destination"
            ? location.longitude
            : currentPosition.longitude,
        display_name: Formatters.getProcessedDisplayName(
          response.data.display_name
        ),
        name: Formatters.getProcessedNameByType(response.data),
      };
      // console.log("formattedLocation: ", formattedLocation);
      return formattedLocation;
    } catch (error) {
      console.error("Error fetching reverse geocoding: ", error);
      alert("逆ジオコーディングに失敗しました。");
    }
  };

  static getCheckpoint = async (
    startLocation,
    destinationLocation,
    requiredTime
  ) => {
    if (!startLocation || !destinationLocation || !requiredTime) {
      console.error(
        `Invalid data: ${startLocation}, ${destinationLocation}, ${requiredTime}`
      );
      return;
    }

    const requestUrl = "http://133.17.165.148/walking/php/findRoute.php";
    const requestBody = new URLSearchParams({
      startLocation: `${String(startLocation.latitude)},${String(
        startLocation.longitude
      )}`,
      destinationLocation: `${String(destinationLocation.latitude)},${String(
        destinationLocation.longitude
      )}`,
      requiredTime: requiredTime,
    });
    console.log(`Request URL: ${requestUrl}${requestBody.toString()}`);
    try {
      const response = await axios.post(requestUrl, requestBody, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      // console.log("Response Data:", response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error(`Server Error: HTTP ${error.response.status}`);
        console.error("Response Data:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Request Error:", error.message);
      }
      throw new Error(error.message || "Unknown error occurred");
    }
  };

  static fetchShortestRoute = async (startLocation, destinationLocation) => {
    if (!startLocation || !destinationLocation) {
      console.log("Invalid startLocation: ", startLocation);
      console.log("or destinationLocation: ", destinationLocation);
      return;
    }
    try {
      const requestUrl = `https://router.project-osrm.org/route/v1/walking/${startLocation.longitude},${startLocation.latitude};${destinationLocation.longitude},${destinationLocation.latitude}`;
      const response = await axios.get(requestUrl, {
        params: { overview: "full", geometries: "geojson", steps: true },
      });

      const route = response.data.routes[0].geometry;
      const instructions = Formatters.getInstructionText(response.data);
      const totalDistance = response.data.routes[0].distance;
      // console.log("instructions: ", instructions);
      // console.log("totalDistance: ", totalDistance);
      return { route, instructions, totalDistance };
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  static fetchRoute = async (
    startLocation,
    destinationLocation,
    checkpoint
  ) => {
    if (!startLocation || !destinationLocation || !checkpoint) {
      console.log(
        `Invalid data: startLocation=${startLocation}, destinationLocation=${destinationLocation}, checkpoint=${checkpoint}`
      );
      return {"error": "Invalid data"};
    }
    const requestUrl = "https://router.project-osrm.org/route/v1/walking/";

    console.log(
      `startLocation: ${startLocation.latitude}, ${startLocation.longitude} destinationLocation: ${destinationLocation.latitude}, ${destinationLocation.longitude} checkpoint: `,
      checkpoint
    );
    try {
      const firstRequestUrl =
        requestUrl +
        `${startLocation.longitude},${startLocation.latitude};${checkpoint[0].longitude},${checkpoint[0].latitude}`;
      const firstResponse = await axios.get(firstRequestUrl, {
        params: { overview: "full", geometries: "geojson", steps: true },
      });

      // console.log("firstResponse: ", firstResponse);

      const secondRequestUrl =
        requestUrl +
        `${checkpoint[0].longitude},${checkpoint[0].latitude};${destinationLocation.longitude},${destinationLocation.latitude}`;
      const secondResponse = await axios.get(secondRequestUrl, {
        params: { overview: "full", geometries: "geojson", steps: true },
      });

      // console.log("secondResponse: ", secondResponse);
      let firstRoute = firstResponse.data.routes[0].geometry.coordinates;
      firstRoute.pop();
      // console.log("firstRoute: ", firstRoute);
      let secondRoute = secondResponse.data.routes[0].geometry.coordinates;
      secondRoute.shift();
      // console.log("secondRoute: ", secondRoute);

      const combinedRoute = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [...firstRoute, ...secondRoute],
        },
        // routes: [...firstRoute, ...secondRoute],
      };
      // console.log("combinedRoute: ", combinedRoute);

      let firstInstructions = Formatters.getInstructionText(firstResponse.data);
      firstInstructions.pop();
      // console.log("firstInstructions: ", firstInstructions);
      let secondInstructions = Formatters.getInstructionText(
        secondResponse.data
      );
      secondInstructions.shift();
      // console.log("secondInstructions: ", secondInstructions);

      const combinedInstructions = [
        ...firstInstructions,
        ...secondInstructions,
      ];
      console.log("combinedInstructions: ", combinedInstructions);
      const totalDistance =
        Math.round(
          (firstResponse.data.routes[0].distance +
            secondResponse.data.routes[0].distance) /
            10
        ) * 10;
      console.log("totalDistance: ", totalDistance);
      return {
        route: combinedRoute,
        instructions: combinedInstructions,
        totalDistance,
      };
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };
}

export default ApiService;
