<script setup lang="ts">
import { z } from "zod";
import Button from "~/components/button.vue";
const { onSuccessSubmit, restaurantId } = defineProps<{
  onSuccessSubmit: () => Promise<void>;
  restaurantId: number;
}>();

const reviewSchema = z.object({
  name: z.string().min(1, "Name is required."),
  content: z
    .string()
    .min(10, "Review content should be minimut 10 character lenght"),
  rating: z.string().min(1, "Rating is required."),
});

type TReviewSchema = z.infer<typeof reviewSchema>;

const reviewForm: TReviewSchema = reactive({
  name: "",
  content: "",
  rating: "",
});

const errors: { [key: string]: string } = reactive({
  name: "",
  content: "",
  rating: "",
});

const clearErros = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = ""; // Clear each error message
  });
};

const validateForm = () => {
  const result = reviewSchema.safeParse(reviewForm);

  clearErros();

  if (!result.success) {
    result.error.errors.forEach((err) => {
      if (err.path.includes("name")) errors.name = err.message;
      if (err.path.includes("content")) errors.content = err.message;
      if (err.path.includes("rating")) errors.rating = err.message;
    });
    return false;
  }

  return true;
};

const isModalOpen = ref(false);
const isSubmitting = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  clearErros();
  isModalOpen.value = false;
};

const submitReview = async () => {
  isSubmitting.value = true;
  const isFormValid = validateForm();

  if (!isFormValid) {
    isSubmitting.value = false;
    return;
  }

  const { data } = await useFetch(`/api/restaurants`, {
    params: { id: restaurantId.toString() },
    method: "POST",
    body: {
      ...reviewForm,
      rating: parseFloat(reviewForm.rating),
    },
  });

  if (data) {
    // Reset form fields
    reviewForm.name = "";
    reviewForm.content = "";
    reviewForm.rating = "";

    // refetch restaurant data
    await onSuccessSubmit();
    isSubmitting.value = false;
    closeModal();
  }

  // Todo handle error
};
</script>

<template>
  <Button @click="openModal" class="sm:!w-fit my-6"> Write your Review </Button>
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
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3
              class="text-lg leading-6 font-medium text-gray-900"
              id="modal-title"
            >
              Write a Review
            </h3>
            <div class="mt-2">
              <form @submit.prevent="submitReview" class="space-y-4">
                <div class="space-y-2">
                  <label
                    for="name"
                    class="block text-sm font-medium text-gray-700"
                    >Name</label
                  >
                  <input
                    :disabled="isSubmitting"
                    type="text"
                    id="name"
                    v-model="reviewForm.name"
                    class="w-full px-3 py-2 border border-indigo-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                  <p class="text-red-600 text-sm">{{ errors.name }}</p>
                </div>
                <div class="space-y-2">
                  <label
                    for="content"
                    class="block text-sm font-medium text-gray-700"
                    >Review</label
                  >
                  <textarea
                    :disabled="isSubmitting"
                    id="content"
                    v-model="reviewForm.content"
                    rows="3"
                    class="w-full px-3 py-2 border border-indigo-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  ></textarea>
                  <p class="text-red-600 text-sm">{{ errors.content }}</p>
                </div>
                <div class="space-y-2">
                  <label
                    for="rating"
                    class="block text-sm font-medium text-gray-700"
                    >Rating</label
                  >
                  <select
                    :disabled="isSubmitting"
                    id="rating"
                    v-model="reviewForm.rating"
                    class="w-full px-3 py-2 border border-indigo-600 rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  >
                    <option value="" selected>Select a rating</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                  <p class="text-red-600 text-sm">{{ errors.rating }}</p>
                </div>
                <div class="mt-8">
                  <Button type="submit" :is-loading="isSubmitting">
                    Submit Review
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
