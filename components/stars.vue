<template>
  <div class="flex space-x-1">
    <Star v-for="n in rating" :key="n" />
  </div>
</template>

<script setup lang="ts">
import Star from "./star.vue";

defineProps<{ rating: number }>();
</script>
