import axios from "axios";
import { REPLICATE_API_KEY } from "../constants/config";

export const generateImage = async (prompt) => {
  try {
    // Step 1: create the prediction
    const createResponse = await axios.post(
      "https://api.replicate.com/v1/predictions",
      {
        version: "google/imagen-4", // model version
        input: { prompt }
      },
      {
        headers: {
          Authorization: `Token ${REPLICATE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const predictionId = createResponse.data.id;

    // Step 2: poll until the prediction is complete
    let prediction;
    while (true) {
      prediction = await axios.get(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: { Authorization: `Token ${REPLICATE_API_KEY}` }
        }
      );

      if (
        prediction.data.status === "succeeded" ||
        prediction.data.status === "failed"
      ) {
        break;
      }

      // wait 1 second before checking again
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (prediction.data.status === "succeeded") {
      return prediction.data.output[0]; // image URL
    } else {
      console.error("Prediction failed:", prediction.data);
      return null;
    }
  } catch (err) {
    console.error("Replicate API Error:", err.response?.data || err.message);
    return null;
  }
};
