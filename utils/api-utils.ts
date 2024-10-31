import fs from "fs";
import path from "path";
import { restaurantsSchema, type Restaurant } from "~/types/restaurtant";

const dataFilePath = path.resolve(process.cwd(), "data/restaurants.json");

export const readRestaurants = () => {
  const data = fs.readFileSync(dataFilePath, "utf8");
  return restaurantsSchema.parse(JSON.parse(data));
};

export const writeRestaurants = (restaurants: Array<Restaurant>) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(restaurants, null, 2), "utf8");
};
