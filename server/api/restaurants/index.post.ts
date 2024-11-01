import { defineEventHandler } from "h3";
import { basicRestaurantSchema, restaurantSchema } from "~/types/restaurtant";
import { readRestaurants } from "~/utils/api-utils";

export default defineEventHandler(async (event) => {
  const newBasicInfoBody = await readBody(event);

  const newBasicInfo = basicRestaurantSchema.parse(newBasicInfoBody);

  const restaurants = readRestaurants();

  const newRestaurantData = {
    ...newBasicInfo,
    id: restaurants.length + 1,
    rating: 0,
    // Todo this data should come from the form, but I don't want to do it now :)
    hours: {
      Monday: "12.00 - 22.00",
      Tuesday: "Closed",
      Wednesday: "12.00 - 22.00",
      Thursday: "12.00 - 22.00",
      Friday: "12.00 - 23.00",
      Saturday: "12.00 - 23.00",
      Sunday: "12.00 - 21.00",
    },
    menuHighlights: [
      {
        name: "Risotto alla Mestrina",
        description: "A creamy risotto with saffron and Parmigiano.",
        price: 12,
      },
      {
        name: "Pollo alla Griglia",
        description: "Grilled chicken with rosemary and olive oil.",
        price: 10,
      },
    ],
    reviews: [],
  };

  const newRestaurant = restaurantSchema.parse(newRestaurantData);

  restaurants.push(newRestaurant);

  return {
    message: "Restaurant added successfully",
    restaurant: newRestaurant,
  };
});
