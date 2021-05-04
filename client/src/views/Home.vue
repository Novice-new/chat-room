<template>
  <div id="home">
    <header-cmp></header-cmp>
    <body-cmp></body-cmp>
  </div>
</template>

<script>
import headerCmp from './layout/headerCmp.vue';
import bodyCmp from './layout/bodyCmp.vue';

export default {
  name: 'Home',
  components: {
    headerCmp,
    bodyCmp,
  },
};
</script>
