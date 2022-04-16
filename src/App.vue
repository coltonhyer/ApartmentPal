<template>
  <v-app>
      <v-main>
          <router-view></router-view>
      </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    passInfo: null,
    residentID: null,
  }),
};
</script>
