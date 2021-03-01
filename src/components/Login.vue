<template>
  <div class="card">
    <div class="card-content">
      <form @submit.prevent="submit">
        <div class="content">
          <div class="field">
            <div class="control has-icons-left has-icons-right">
              <input class="input" :class="[isValid.email ? 'is-success' : 'is-danger']" type="email" placeholder="Email *" v-model="email" @change="validate">
              <span class="icon is-small is-left">
                <i class="fas fa-envelope"></i>
              </span>
              <span class="icon is-small is-right" v-if="isValid.email">
                <i class="fas fa-check"></i>
              </span>
              <span class="icon is-small is-right" v-else>
                <i class="fas fa-exclamation-triangle"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <div class="control has-icons-left has-icons-right">
              <input class="input" :class="[isValid.password ? 'is-success' : 'is-danger']" type="password" placeholder="Password *" v-model="password" @change="validate">
              <span class="icon is-small is-left">
                <i class="fas fa-key"></i>
              </span>
              <span class="icon is-small is-right" v-if="isValid.password">
                <i class="fas fa-check"></i>
              </span>
              <span class="icon is-small is-right" v-else>
                <i class="fas fa-exclamation-triangle"></i>
              </span>
            </div>
          </div>
          <div class="notification is-danger" v-if="errorMessage">
              <button type="button" class="delete" @click="resetError"></button>
              {{ errorMessage }}
          </div>
          <div class="field">
            <div class="control has-text-right">
              <button type="submit" class="button is-link" :class="[isLoading ? 'is-loading' : '']" v-bind:disabled="isDisabled">
                Log in
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { AuthApi } from './../services/ApiRequest';
import useAuth from './../composables/useAuth';
import useAPI from './../composables/useAPI';

export default {
  name: 'Login',

  setup: () => {
    const email = ref('');
    const password = ref('');
    const isValid = ref({ email: true, password: true });
    const isDisabled = ref(true);
    const router = useRouter();
    const { isLoggedIn } = useAuth();
    const { isLoading, errorMessage, call, resetError } = useAPI();

    const validate = () => {
      const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      isValid.value.email = !!email.value && emailRegex.test(email.value);
      isValid.value.password = !!password.value;
      isDisabled.value = !(isValid.value.email && isValid.value.password);
    };

    const submit = () => {
      const data = {
        email: email.value,
        password: password.value,
      };
      call({ callable: AuthApi.login, data }).then(result => {
        const { token, user } = result;
        localStorage.setItem('remittance-user', JSON.stringify(user));
        localStorage.setItem('remittance-token', token);
        isLoggedIn.value = true;
        router.push({ name: user.is_admin ? 'dashboard' : 'home' });
      });
    };

    return {
      email,
      password,
      errorMessage,

      isLoading,
      isValid,
      isDisabled,

      submit,
      validate,
      resetError,
    };
  },
}
</script>
<style scoped>
  div.card {
    max-width:500px;
    margin: auto;
  }
  button.button {
    width: 100%;
  }
</style>