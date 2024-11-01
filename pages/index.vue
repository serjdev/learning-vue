<script setup lang="ts">
import { ref } from "vue";
import Stars from "~/components/stars.vue";

const router = useRouter();

const minRating = ref("");

const { data: restaurants } = await useAsyncData(
  "restaurants",
  () =>
    $fetch("/api/restaurants", {
      params: { minRating: minRating.value },
    }),
  {
    watch: [minRating],
  }
);
</script>
<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-extrabold text-gray-900 text-center mb-10">
        Restaurants
      </h1>

      <div class="mb-8 flex justify-center">
        <label class="inline-flex items-center bg-white rounded-md shadow-sm">
          <span
            class="text-gray-700 font-medium px-4 py-2 border-r border-gray-200"
          >
            Minimum Rating:
          </span>
          <select
            v-model="minRating"
            class="appearance-none bg-transparent py-2 pl-4 pr-8 rounded-r-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="">Select Rating</option>
            <option value="3">3 stars</option>
            <option value="4">4 stars</option>
            <option value="5">5 stars</option>
          </select>
        </label>
      </div>

      <ul
        v-if="restaurants"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <li
          v-for="restaurant in restaurants.restaurants"
          :key="restaurant.id"
          class="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:scale-105"
        >
          <img
            :src="restaurant.imageSrc"
            :alt="restaurant.name"
            class="w-full h-48 object-cover"
          />
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">
              {{ restaurant.name }}
            </h2>
            <div class="flex items-center mb-4">
              <Stars :rating="restaurant.rating" />
            </div>
            <Button @click="() => router.push(`/restaurants/${restaurant.id}`)">
              View Restaurant
            </Button>
          </div>
        </li>
      </ul>

      <div v-else class="text-center text-gray-600">
        <p>No restaurants found. Try adjusting your rating filter.</p>
      </div>
    </div>
  </div>
</template>
