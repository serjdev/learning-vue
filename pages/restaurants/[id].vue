<script setup lang="ts">
import { ref } from "vue"; // ref is like useState in react  :)
import { useRoute } from "vue-router";
import type { Restaurant } from "~/types/restaurtant";
import Stars from "~/components/stars.vue";

const restaurant = ref<Restaurant | null>(null);

const route = useRoute();
const restaurantId = route.params.id;

const fetchRestaurant = async () => {
  const { data } = await useFetch<{ restaurant: Restaurant }>(
    "/api/restaurants",
    {
      params: { id: restaurantId.toString() },
    }
  );
  restaurant.value = data.value?.restaurant ?? null;
};

const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const reviewForm = reactive({
  name: "",
  content: "",
  rating: "5",
});

const submitReview = async () => {
  const { data, error } = await useFetch(`/api/restaurants`, {
    params: { id: restaurantId.toString() },
    method: "POST",
    body: {
      ...reviewForm,
      rating: parseFloat(reviewForm.rating),
    },
  });

  console.log({ data, error });

  if (data) {
    // Reset form and close modal
    reviewForm.name = "";
    reviewForm.content = "";
    reviewForm.rating = "5";
    await fetchRestaurant();
    closeModal();
  }
};

fetchRestaurant();
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
          <button
            @click="openModal"
            class="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Write a Review
          </button>
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

    <!-- Review Modal -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed z-10 inset-0 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
            @click="closeModal"
          ></div>

          <span
            class="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
            >&#8203;</span
          >

          <div
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          >
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3
                class="text-lg leading-6 font-medium text-gray-900"
                id="modal-title"
              >
                Write a Review
              </h3>
              <div class="mt-2">
                <form @submit.prevent="submitReview">
                  <div class="mb-4">
                    <label
                      for="name"
                      class="block text-sm font-medium text-gray-700"
                      >Name</label
                    >
                    <input
                      type="text"
                      name="name"
                      id="name"
                      v-model="reviewForm.name"
                      required
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div class="mb-4">
                    <label
                      for="content"
                      class="block text-sm font-medium text-gray-700"
                      >Review</label
                    >
                    <textarea
                      id="content"
                      name="content"
                      rows="3"
                      v-model="reviewForm.content"
                      required
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    ></textarea>
                  </div>
                  <div class="mb-4">
                    <label
                      for="rating"
                      class="block text-sm font-medium text-gray-700"
                      >Rating</label
                    >
                    <select
                      id="rating"
                      name="rating"
                      v-model="reviewForm.rating"
                      required
                      class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="1">1 Star</option>
                      <option value="2">2 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="5">5 Stars</option>
                    </select>
                  </div>
                  <div class="mt-5 sm:mt-6">
                    <button
                      type="submit"
                      class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
  <div v-else>No restaurant found</div>
</template>
