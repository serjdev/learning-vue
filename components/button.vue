<script>
export default {
  name: "Button",
  props: {
    type: {
      type: String,
      default: "button",
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClick() {
      if (!this.isDisabled) {
        this.$emit("click");
      }
    },
  },
};
</script>

<template>
  <button
    class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 sm:text-sm"
    @click="handleClick"
    :disabled="isDisabled"
  >
    <slot></slot>
  </button>
</template>
