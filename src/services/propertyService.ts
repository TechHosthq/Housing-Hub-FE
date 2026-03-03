import { Property } from "@/types";
import propertiesData from "@/data/properties.json";

export const propertyService = {
    getProperties: (): Property[] => {
        return propertiesData.properties;
    },
    getTrendingProperties: (): Property[] => {
        return propertiesData.properties.filter(p => p.tag === "Trending");
    }
};
