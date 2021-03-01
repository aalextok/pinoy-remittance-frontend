<template>
  <div id="logout-wrap" v-if="isLoggedIn">
    <button class="button" @click="logout" :class="[isLoading ? 'is-loading' : '']">
      <i class="fas fa-sign-out-alt"></i>
    </button>
    <div class="notification is-danger" v-if="errorMessage">
      <button type="button" class="delete" @click="resetError"></button>
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { AuthApi } from './../services/ApiRequest';
import useAuth from './../composables/useAuth';
import useAPI from './../composables/useAPI';

export default {
  name: 'Logout',
  setup: () => {
    
    const { isLoggedIn } = useAuth();
    const router = useRouter();
    const { isLoading, errorMessage, call, resetError } = useAPI();

    const logout = () => {
      call({ callable: AuthApi.logout }).then(() => {
        isLoggedIn.value = false;
        localStorage.removeItem('remitance-token');
        localStorage.removeItem('remittance-user');
        router.push({ name: 'login' });
      });
    };

    return {
      logout,
      resetError,
      isLoggedIn,
      isLoading,
      errorMessage,
    };
  },
}
</script>
<style scoped>
  #logout-wrap {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
  }
  #logout-wrap .notification {
    width: 95%;
  }
</style>