<template>
  <div class="card">
    <div class="card-content">
      <div class="content">
        <form @submit.prevent="next">
          <div class="field is-horizontal">
            <div class="field-body is-justify-content-space-between">
              <div class="field">
                <p class="control">
                  <input class="input" v-model="name" type="text" v-bind:placeholder="translation.receiver_name[lang] + ' *'" >
                  <span class="help is-info">{{ translation.receiver_name[lang] }}</span>
                </p>
              </div>
              <div class="field">
                <p class="control">
                  <input class="input" v-model="dateOfBirth" type="text" v-bind:placeholder="translation.receiver_date_of_birth[lang] + ' *'" >
                  <span class="help is-info">{{ translation.receiver_date_of_birth[lang] }}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-body is-justify-content-space-between">
              <div class="field">
                <textarea class="textarea" v-model="address" v-bind:placeholder="translation.receiver_address[lang] + ' *'" ></textarea>
                <span class="help is-info">{{ translation.receiver_address[lang] }}</span>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-body is-justify-content-space-between">
              <div class="field">
                <p class="control has-icons-left">
                  <input class="input" v-model="phone" type="text" v-bind:placeholder="translation.telephone[lang] + ' *'" >
                  <span class="icon is-small is-left">
                    <i class="fas fa-phone"></i>
                  </span>
                  <span class="help is-info">{{ translation.telephone[lang] }}</span>
                </p>
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
import { ref } from 'vue';
import translation from './../translation';

export default {
  name: 'ReceiverForm',
  props: [ 'lang', 'data' ],
  emits: [ 'nextStep' ],
  setup: ({ lang, data }, { emit }) => {
    const submitIsDisabled = ref(true);

    const name = ref(null);
    const address = ref(null);
    const dateOfBirth = ref(null);
    const phone = ref(null);



    const next = () => {
      const data = {};
      emit('nextStep', data);
    };

    return {
      name,
      address,
      dateOfBirth,
      phone,

      translation,
      lang,
      submitIsDisabled,

      next
    };
  },
}
</script>