<template>
  <div class="min-h-screen flex flex-col">
    <header
      class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex justify-start flex-1">
            <NuxtLink :to="'/'" class="flex items-center group">
              <span class="text-2xl font-extrabold tracking-tight">
                Mestre
              </span>
              <span
                class="ml-2 text-xl font-semibold bg-white text-indigo-600 px-2 py-1 rounded-md"
              >
                Culinary
              </span>
            </NuxtLink>
          </div>
          <div class="flex items-center">
            <NuxtLink
              :to="'/admin'"
              class="flex items-center text-white hover:text-indigo-200 transition duration-300 ease-in-out"
            >
              <ClipboardListIcon class="h-6 w-6 mr-2" />
              <span class="text-lg font-medium">Admin</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>
    <main class="flex-grow">
      <!-- Markup shared across all pages, ex: NavBar -->
      <NuxtPage />
    </main>
  </div>
</template>
