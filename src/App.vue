<template>
  <section class="section">
    <div class="container">
      <logout></logout>
      <router-view></router-view>
    </div>
  </section>
</template>

<script>
import Logout from './components/Logout.vue';
export default {
  name: 'App',
  components: {
    Logout
  }
}
</script>