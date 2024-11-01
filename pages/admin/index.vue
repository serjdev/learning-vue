<script setup lang="ts">
import { TrashIcon } from "lucide-vue-next";
import { ref } from "vue";
import AddRestaurant from "~/components/add-restaurant.vue";
import type { Restaurant } from "~/types/restaurtant";

const restaurants = ref<Restaurant[]>([]);

const fetchRestaurants = async () => {
  const { data } = await useFetch<{ restaurants: Restaurant[] }>(
    "/api/restaurants"
  );
  restaurants.value = data.value?.restaurants ?? [];
};

fetchRestaurants();
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div
        class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center"
      >
        <h1 class="text-3xl font-bold text-gray-900">Restaurants Admin</h1>
        <AddRestaurant v-on:success-submit="fetchRestaurants" />
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="space-y-4">
          <div
            v-for="restaurant in restaurants"
            :key="restaurant.id"
            class="bg-white overflow-hidden shadow rounded-lg"
          >
            <div class="px-4 py-5 sm:p-6 flex justify-between items-center">
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {{ restaurant.name }}
                </h3>
                <div class="mt-2 max-w-xl text-sm text-gray-500">
                  <p>{{ restaurant.address }}</p>
                </div>
              </div>
              <div class="flex space-x-3">
                <button
                  class="text-red-600 hover:text-red-800 transition duration-300 ease-in-out"
                  @click="fetchRestaurants"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div
            v-if="restaurants.length === 0"
            class="text-center py-12 bg-white shadow rounded-lg"
          >
            <UtensilsIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">
              No restaurants
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Get started by creating a new restaurant.
            </p>
            <div class="mt-6">
              <AddRestaurant v-on:success-submit="fetchRestaurants" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
