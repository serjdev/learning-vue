import { defineEventHandler } from "h3";
import { readRestaurants, writeRestaurants } from "~/utils/api-utils";

export default defineEventHandler(async (event) => {
  const restaurantId = parseInt(event.context.params?.id as string);

  console.log({ restaurantId });

  if (isNaN(restaurantId)) {
    throw createError({
      statusCode: 404,
      statusMessage: `Invalid restaurant ID`,
    });
  }

  const restaurants = readRestaurants();
  const restaurantIndex = restaurants.findIndex((r) => r.id === restaurantId);

  if (restaurantIndex === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: "Restaurant not found",
    });
  }

  restaurants.splice(restaurantIndex, 1);

  writeRestaurants(restaurants);

  return { message: "Restaurant deleted successfully" };
});
