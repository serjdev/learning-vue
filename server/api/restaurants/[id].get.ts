import { defineEventHandler } from "h3";
import { readRestaurants } from "~/utils/api-utils";

export default defineEventHandler(async (event) => {
  const restaurantId = parseInt(event.context.params?.id as string);

  if (!restaurantId || isNaN(restaurantId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
    });
  }

  const restaurants = readRestaurants();

  const restaurant = restaurants.find((r) => r.id === restaurantId);
  if (!restaurant) {
    throw createError({
      statusCode: 404,
      statusMessage: "Restaurant not found",
    });
  }

  return { restaurant };
});
