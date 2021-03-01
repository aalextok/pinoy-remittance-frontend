<template>
  <div class="card">
    <div class="card-content">
      <div class="content">
        <div class="notification is-info is-light" v-if="loginNotification">
          {{ translation.login_suggestion[lang] }} &nbsp;&nbsp;&nbsp;
          <router-link to="/login"><i class="fas fa-sign-in-alt"></i></router-link>
          <button class="delete" @click="hideLoginNotification"></button>
        </div>
        <form @submit.prevent="next">
          <div class="field is-horizontal">
            <div class="field-body is-justify-content-space-between">
              <div class="field">
                <p class="control">
                  <input class="input" v-model="firstname" type="text" v-bind:placeholder="translation.firstname[lang] + ' *'" >
                  <span class="help is-info">{{ translation.firstname[lang] }}</span>
                </p>
              </div>
              <div class="field">
                <p class="control">
                  <input class="input" v-model="middlename" type="text" v-bind:placeholder="translation.middlename[lang]" >
                  <span class="help is-info">{{ translation.middlename[lang] }}</span>
                </p>
              </div>
              <div class="field">
                <p class="control">
                  <input class="input" v-model="lastname" type="text" v-bind:placeholder="translation.lastname[lang] + ' *'" >
                  <span class="help is-info">{{ translation.lastname[lang] }}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="field is-horisontal">
            <div class="field-body is-justify-content-space-between">
              <div class="field">
                <p class="control has-icons-left">
                  <input class="input" v-model="email" type="email" placeholder="Email *" >
                  <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                  </span>
                  <span class="help is-info">Email</span>
                </p>
              </div>
              <div class="field">
                <p class="control has-icons-left">
                  <input class="input" v-model="phone" type="text" v-bind:placeholder="translation.telephone[lang] + ' *'" >
                  <span class="icon is-small is-left">
                    <i class="fas fa-phone"></i>
                  </span>
                  <span class="help is-info">{{ translation.telephone[lang] }}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="field is-horisontal">
            <div class="field-body">
              <div class="field">
                <label class="checkbox">
                  <input type="checkbox" v-model="signUp">
                  {{ translation.register_new_user[lang] }}
                </label>
              </div>
            </div>
          </div>
          <div class="field is-horisontal" v-if="signUp">
            <div class="field-body is-justify-content-space-between">
              <div class="field">
                <p class="control has-icons-left">
                  <input class="input" :class="[passwordsMatch ? 'is-success' : 'is-danger']" v-model="password" type="password" v-bind:placeholder="translation.password[lang]" >
                  <span class="icon is-small is-left">
                    <i class="fas fa-key"></i>
                  </span>
                  <span class="help is-info">{{ translation.password[lang] }}</span>
                </p>
              </div>
              <div class="field">
                <p class="control has-icons-left">
                  <input class="input" :class="[passwordsMatch ? 'is-success' : 'is-danger']" v-model="repeatPassword" type="password" v-bind:placeholder="translation.repeat_password[lang]" >
                  <span class="icon is-small is-left">
                    <i class="fas fa-key"></i>
                  </span>
                  <span class="help is-info">{{ translation.repeat_password[lang] }}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="field is-horisontal" v-if="!isLoggedIn">
            <div class="field-body is-justify-content-space-between">
              <div class="file has-name is-boxed">
                <label class="file-label">
                  <input class="file-input" type="file" @change="readFile" >
                  <span class="file-cta" v-if="selfie.dataURL">
                    <img v-bind:src="selfie.dataURL" />
                  </span>
                  <span class="file-cta" v-else>
                    <span class="file-icon">
                      <i class="fas fa-upload"></i>
                    </span>
                    <span class="file-label">
                      {{ translation.selfie_with_id[lang] }}
                    </span>
                  </span>
                  <span class="file-name" v-if="selfie.name">
                    {{ selfie.name }}
                  </span>
                </label>
              </div>
              <div class="field">
                <div class="control has-text-right">
                  <button type="submit" class="button is-ghost" v-bind:disabled="submitIsDisabled" >
                    <i class="fas fa-angle-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>      
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import useAuth from './../composables/useAuth';
import translation from './../translation';

export default {
  name: 'CustomerForm',
  props: [ 'lang', 'data' ],
  emits: [ 'nextStep' ],
  setup: ({ lang }, { emit }) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    const { isLoggedIn } = useAuth;
    const loginNotification = ref(!isLoggedIn);
    const signUp = ref(!isLoggedIn);
    const submitIsDisabled = ref(true);
    const passwordsMatch = ref(true);

    const firstname = ref(null);
    const middlename = ref(null);
    const lastname = ref(null);
    const email = ref(null);
    const phone = ref(null);
    const password = ref(null);
    const repeatPassword = ref(null);
    const selfie = ref({});

    const hideLoginNotification = () => {
      loginNotification.value = false
    };

    watch([ firstname, lastname, email, phone, signUp, password, repeatPassword, selfie ], (values) => {
      const [ _firstname, _lastname, _email, _phone, _new, _password, _password2, _selfie ] = values;
      const _match = !!_password && !!_password2 && _password === _password2;
      submitIsDisabled.value = !(
        !!_firstname 
        && !!_lastname 
        && !!_phone
        && !!_email && emailRegex.test(_email)
        && !!_selfie.dataURL
        && (_new ? _match : true)
      );
      passwordsMatch.value = _match;
    });

    const readFile = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = _event => {
          selfie.value = {
            name: file.name,
            lastModified: file.lastModified,
            size: file.size,
            type: file.type,
            dataURL: reader.result,
          };
        };
        reader.readAsDataURL(file);
      }
    };

    const next = () => {
      const data = {
        step: 2,
        firstname: firstname.value,
        middlename: middlename.value,
        lastname: lastname.value,
        email: email.value,
        phone: phone.value,
        sign_up: signUp.value,
        password: password.value,
        repeat_password: repeatPassword.value,
        selfie: selfie.value,
      };
      // TODO: empty page after submit
      emit('nextStep', data);
    };

    return {
      isLoggedIn,
      loginNotification,
      hideLoginNotification,
      signUp,
      submitIsDisabled,
      passwordsMatch,

      firstname,
      middlename,
      lastname,
      email,
      phone,
      password,
      repeatPassword,
      selfie,

      readFile,

      translation,
      lang,

      next,
    }
  }
}
</script>
<style scoped>
  .file .file-name {
    max-width: unset!important;
  }
  .file-cta img {
    max-width: 400px;
  }
</style>