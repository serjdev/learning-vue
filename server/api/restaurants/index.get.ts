import { defineEventHandler, getQuery } from "h3";
import { readRestaurants } from "~/utils/api-utils";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const minRating = parseFloat(query.minRating as string);

  const restaurants = readRestaurants();

  if (isNaN(minRating)) {
    return { restaurants };
  }

  const filteredRestaurantsByRating = restaurants.filter(
    (restaurant) => restaurant.rating >= minRating
  );

  return { restaurants: filteredRestaurantsByRating };
});
