<script lang="ts">
import Header from "@components/Header.vue";
export default {
  components: { Header },
};
</script>

<template>
  <Header />
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
