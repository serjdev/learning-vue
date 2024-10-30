export interface Restaurant {
  id: number;
  name: string;
  imageSrc: string;
  rating: number;
  address: string;
  tel: string;
  hours: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
  menuHighlights: Array<{ name: string; description: string; price: number }>;
  reviews: Array<RestaurantReview>;
}

export type RestaurantReview = {
  name: string;
  content: string;
  rating: number;
  id: number;
};
