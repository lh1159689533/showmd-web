<script lang="ts">
import { defineComponent } from 'vue';
import ArticleList from '../article/ArticleList.vue';
import Category from './Category.vue';
import Sort from './Sort.vue';

export default defineComponent({
  name: 'Study',
  components: { ArticleList, Category, Sort },
});
</script>

<template>
  <div id='study' class>
    <nav class='fixed w-full h-12 left-0 top-14 z-1000 shadow bg-white'>
      <Category />
    </nav>
    <section class='mt-16'>
      <div class='mt-4 relative'>
        <div class='content-list bg-white' style='width: 73%'>
          <Sort />
          <ArticleList />
        </div>
        <aside class='content-aside right-0 top-0 absolute bg-white' style='width: 25%'>222</aside>
      </div>
    </section>
  </div>
</template>

<style scoped>
#study {
  max-width: 1380px;
  margin: 0 auto;
}

#study .content-list {
  box-shadow: 1px 1px 10px -8px #333;
}

@media (max-width: 960px) {
  #study .content-list {
    width: 100% !important;
  }
  #study .content-aside {
    display: none;
  }
}
</style>