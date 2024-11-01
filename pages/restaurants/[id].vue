<script setup lang="ts">
import { useRoute } from "vue-router";
import type { Restaurant } from "~/types/restaurtant";
import Stars from "~/components/stars.vue";
import AddReview from "~/components/add-review.vue";

const route = useRoute();
const restaurantId = route.params.id;

const { data: restaurant, refresh } = await useFetch<Restaurant>(
  `/api/restaurants/${restaurantId.toString()}`
);
</script>

<template>
  <div v-if="restaurant" class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900">{{ restaurant.name }}</h1>
      </div>
    </header>
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h2 class="text-lg leading-6 font-medium text-gray-900">
                Restaurant Details
              </h2>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">
                Information about {{ restaurant.name }}
              </p>
            </div>
            <img
              :src="restaurant.imageSrc"
              :alt="restaurant.name"
              class="w-32 h-32 object-cover rounded-lg shadow-md"
            />
          </div>
          <div class="border-t border-gray-200">
            <dl>
              <div
                class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
              >
                <dt class="text-sm font-medium text-gray-500">Rating</dt>
                <dd
                  class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center"
                >
                  <Stars :rating="restaurant.rating" />
                </dd>
              </div>
              <div
                class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
              >
                <dt class="text-sm font-medium text-gray-500">Address</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ restaurant.address }}
                </dd>
              </div>
              <div
                class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
              >
                <dt class="text-sm font-medium text-gray-500">Phone</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ restaurant.tel }}
                </dd>
              </div>
              <div
                class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
              >
                <dt class="text-sm font-medium text-gray-500">Hours</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul
                    class="border border-gray-200 rounded-md divide-y divide-gray-200"
                  >
                    <li
                      v-for="(hours, day) in restaurant.hours"
                      :key="day"
                      class="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                    >
                      <div class="w-0 flex-1 flex items-center">
                        <span class="ml-2 flex-1 w-0 truncate"
                          >{{ day }}: {{ hours }}</span
                        >
                      </div>
                    </li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div class="mt-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            Menu Highlights
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="item in restaurant.menuHighlights"
              :key="item.name"
              class="bg-white overflow-hidden shadow rounded-lg"
            >
              <div class="p-5">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {{ item.name }}
                </h3>
                <p class="mt-1 text-sm text-gray-500">{{ item.description }}</p>
                <p class="mt-2 text-sm font-semibold text-gray-900">
                  ${{ item.price.toFixed(2) }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">Reviews</h2>
          <AddReview
            :restaurant-id="restaurant.id"
            v-on:success-submit="refresh"
          />
          <div class="space-y-4">
            <div
              v-for="review in restaurant.reviews"
              :key="review.id"
              class="bg-white overflow-hidden shadow rounded-lg"
            >
              <div class="p-5">
                <div class="flex items-center">
                  <div class="ml-4">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                      {{ review.name }}
                    </h3>
                    <Stars :rating="review.rating" class="mt-1" />
                  </div>
                </div>
                <div class="mt-4 text-sm text-gray-500">
                  {{ review.content }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  <div v-else>No restaurant found</div>
</template>
