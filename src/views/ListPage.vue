<template>
  <div class="home">
    <ListPageComponent />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import ListPageComponent from "@/components/ListPage.vue"; // @ is an alias to /src

  @Component({
    components: {
      ListPageComponent
    }
  })
  export default class ListPage extends Vue {}
</script>
