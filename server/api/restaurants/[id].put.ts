import { defineEventHandler } from "h3";
import { reviewSchema } from "~/types/restaurtant";
import { readRestaurants, writeRestaurants } from "~/utils/api-utils";

export default defineEventHandler(async (event) => {
  const restaurantId = parseInt(event.context.params?.id as string);

  if (isNaN(restaurantId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Restaurant ID is required for adding a review",
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

  const newReviewBody = await readBody(event);

  const newReview = reviewSchema.parse(newReviewBody);

  if (
    !newReview.name ||
    !newReview.content ||
    typeof newReview.rating !== "number"
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid review data",
    });
  }

  const nextReviewId = restaurants[restaurantIndex].reviews.length
    ? restaurants[restaurantIndex].reviews[
        restaurants[restaurantIndex].reviews.length - 1
      ].id + 1
    : 1;

  const newReviewWithId = {
    ...newReview,
    id: nextReviewId,
  };
  restaurants[restaurantIndex].reviews.push(newReviewWithId);

  // After we've added a new review we need to calculate the new average rating
  const totalRating = restaurants[restaurantIndex].reviews.reduce(
    (acc, review) => acc + review.rating,
    0
  );

  const newRating = totalRating / restaurants[restaurantIndex].reviews.length;

  restaurants[restaurantIndex].rating = Math.round(newRating);

  writeRestaurants(restaurants);

  return { message: "Review added successfully", review: newReview };
});
