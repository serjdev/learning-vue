import { z } from "zod";

export const reviewSchema = z.object({
  name: z.string().min(1, "Name is required."),
  content: z
    .string()
    .min(10, "Review content should be minimut 10 character lenght"),
  rating: z.number({
    message: "Rating is required",
  }),
});

const reviewSchemaWithId = reviewSchema.extend({
  id: z.number(),
});

export type Review = z.infer<typeof reviewSchemaWithId>;

export const basicRestaurantSchema = z.object({
  name: z.string().min(1, { message: "Restaurant name is required" }),
  imageSrc: z.string().min(1, { message: "Restaurant Image is required" }),
  address: z.string().min(1, { message: "Restaurant address is required" }),
  tel: z.string().min(1, { message: "Phone number is required" }),
});

export const restaurantSchema = basicRestaurantSchema.extend({
  id: z.number(),
  rating: z.number(),
  hours: z.object({
    Monday: z.string(),
    Tuesday: z.string(),
    Wednesday: z.string(),
    Thursday: z.string(),
    Friday: z.string(),
    Saturday: z.string(),
    Sunday: z.string(),
  }),
  menuHighlights: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      price: z.number(),
    })
  ),
  reviews: z.array(reviewSchemaWithId),
});

export const restaurantsSchema = z.array(restaurantSchema);

export type Restaurant = z.infer<typeof restaurantSchema>;
