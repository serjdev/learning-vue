import { defineEventHandler, getQuery } from "h3";
import {
  Restaurant,
  restaurantsSchema,
  reviewSchema,
} from "~/types/restaurtant";
import fs from "fs";
import path from "path";

const dataFilePath = path.resolve(process.cwd(), "data/restaurants.json");

const readRestaurants = () => {
  const data = fs.readFileSync(dataFilePath, "utf8");
  return restaurantsSchema.parse(JSON.parse(data));
};

const writeRestaurants = (restaurants: Array<Restaurant>) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(restaurants, null, 2), "utf8");
};

// This api is designed to handle
//  GET All Restaurants
//  GET Restaurants filtered by rating
//  GET Single Restarand by id
//  POST new review to restaurant reviews
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const minRating = parseFloat(query.minRating as string);
  const restaurantId = parseInt(query.id as string);

  // POST new review
  if (event.node.req.method === "POST") {
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
  }

  const restaurants = readRestaurants();

  // Get restaurand by id
  if (!isNaN(restaurantId)) {
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    if (!restaurant) {
      throw createError({
        statusCode: 404,
        statusMessage: "Restaurant not found",
      });
    }
    return { restaurant };
  }

  // Get all restaurants
  const filteredRestaurants = isNaN(minRating)
    ? restaurants
    : restaurants.filter((restaurant) => restaurant.rating >= minRating);

  return { restaurants: filteredRestaurants };
});
