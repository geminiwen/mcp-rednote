import { z } from "zod";

const weatherSchema = {
    latitude: z.number().min(-90).max(90).describe("Latitude of the location"),
    longitude: z.number().min(-180).max(180).describe("Longitude of the location"),
};

type CallBackSchema = (args: {latitude: number, longitude: number} ) => {
    content: {
        type: "text",
        text: string
    }[]
}

const getForecast: CallBackSchema = ({ latitude, longitude }) => {
    // TODO: Implement weather forecast logic
    return { 
        content: [{
            type: "text",
            text: JSON.stringify({ temperature: 25, condition: "sunny" })
        }] 
    };
};

export { weatherSchema, getForecast };