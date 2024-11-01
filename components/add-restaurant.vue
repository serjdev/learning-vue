<script setup lang="ts">
const { onSuccessSubmit } = defineProps<{
  onSuccessSubmit: () => Promise<void>;
}>();
import Button from "~/components/button.vue";
import { basicRestaurantSchema } from "~/types/restaurtant";

const formData = reactive({
  name: "",
  address: "",
  tel: "",
  imageSrc: "",
});

const errors: { [key: string]: string } = reactive({
  name: "",
  address: "",
  imageSrc: "",
  tel: "",
});

const clearErros = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });
};

const validateForm = () => {
  const result = basicRestaurantSchema.safeParse(formData);

  clearErros();

  if (!result.success) {
    result.error.errors.forEach((err) => {
      if (err.path.includes("name")) errors.name = err.message;
      if (err.path.includes("address")) errors.address = err.message;
      if (err.path.includes("tel")) errors.tel = err.message;
      if (err.path.includes("imageSrc")) errors.imgSrc = err.message;
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

const addRestaurant = async () => {
  isSubmitting.value = true;

  const isFormValid = validateForm();

  if (!isFormValid) {
    isSubmitting.value = false;
    return;
  }

  const data = await $fetch(`/api/restaurants/`, {
    method: "POST",
    body: {
      ...formData,
    },
  });

  if (data) {
    // Reset form fields
    formData.name = "";
    formData.address = "";
    formData.tel = "";
    formData.imageSrc = "";

    // refetch restaurant data
    await onSuccessSubmit();
    isSubmitting.value = false;
    closeModal();
  }

  // Todo handle error
};
</script>

<template>
  <Button @click="openModal" class="sm:!w-fit my-6">
    Add new restaurant
  </Button>
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
              Add a new Restaurant
            </h3>
            <div class="mt-2">
              <form @submit.prevent="addRestaurant" class="space-y-4">
                <div class="space-y-2">
                  <label
                    for="name"
                    class="block text-sm font-medium text-gray-700"
                    >Restaurant Name</label
                  >
                  <input
                    :disabled="isSubmitting"
                    type="text"
                    id="name"
                    v-model="formData.name"
                    class="w-full px-3 py-2 border border-indigo-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                  <p class="text-red-600 text-sm">{{ errors.name }}</p>
                </div>
                <div class="space-y-2">
                  <label
                    for="address"
                    class="block text-sm font-medium text-gray-700"
                    >Address</label
                  >
                  <input
                    :disabled="isSubmitting"
                    type="text"
                    id="address"
                    v-model="formData.address"
                    class="w-full px-3 py-2 border border-indigo-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                  <p class="text-red-600 text-sm">{{ errors.address }}</p>
                </div>
                <div class="space-y-2">
                  <label
                    for="tel"
                    class="block text-sm font-medium text-gray-700"
                    >Tel</label
                  >
                  <input
                    :disabled="isSubmitting"
                    type="text"
                    id="tel"
                    v-model="formData.tel"
                    class="w-full px-3 py-2 border border-indigo-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                  <p class="text-red-600 text-sm">{{ errors.tel }}</p>
                </div>
                <div class="space-y-2">
                  <label
                    for="imageSrc"
                    class="block text-sm font-medium text-gray-700"
                    >Image source</label
                  >
                  <input
                    :disabled="isSubmitting"
                    type="text"
                    id="imageSrc"
                    v-model="formData.imageSrc"
                    class="w-full px-3 py-2 border border-indigo-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                  <p class="text-red-600 text-sm">{{ errors.imgSrc }}</p>
                </div>
                <div class="mt-8">
                  <Button type="submit" :is-loading="isSubmitting">
                    Add
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
