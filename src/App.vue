<script setup lang="ts"></script>

<template>
  <div id="app" class="flex">
    <Sidebar></Sidebar>

    <router-view v-slot="{ Component }">
      <transition name="fade">
        <keep-alive>
          <component :is="Component" v-if="$route.meta.keepAlive" />
        </keep-alive>
      </transition>
      <transition name="fade">
        <component :is="Component" v-if="!$route.meta.keepAlive" />
      </transition>
    </router-view>
  </div>
</template>

<style lang="scss">
#app {
  @apply m-auto;
}
</style>
