<template>
  <div class="card">
    <div class="card-content">
      <div class="content">
        <form @submit.prevent="next">
          <div class="field is-horizontal">
            <div class="field-body is-justify-content-space-between">
              <div class="field">
                <p class="control">
                  <input class="input" v-model="bank" type="text" v-bind:placeholder="translation.bank_name[lang] + ' *'" >
                  <span class="help is-info">{{ translation.bank_name[lang] }}</span>
                </p>
              </div>
              <div class="field">
                <p class="control">
                  <input class="input" v-model="name" type="text" v-bind:placeholder="translation.account_name[lang] + ' *'" >
                  <span class="help is-info">{{ translation.account_name[lang] }}</span>
                </p>
              </div>
              <div class="field">
                <p class="control">
                  <input class="input" v-model="account" type="text" v-bind:placeholder="translation.account_number[lang] + ' *'" >
                  <span class="help is-info">{{ translation.account_number[lang] }}</span>
                </p>
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
import { ref, watch } from 'vue';
import translation from './../translation';

export default {
  name: 'ReceiverForm',
  props: [ 'lang', 'data' ],
  emits: [ 'nextStep' ],
  setup: ({ lang }, { emit }) => {
    const submitIsDisabled = ref(true);

    // TODO: select existing accounts

    const bank = ref(null);
    const name = ref(null);
    const account = ref(null);
    const phone = ref(null);

    watch([ bank, name, account, phone ], (values) => {
      const [ _bank, _name, _account, _phone ] = values;
      submitIsDisabled.value = !(!!_bank && !!_name && !!_account && !!_phone);
    });

    const next = () => {
      const data = {
        step: 3,
        receiver: {
          bank: bank.value,
          name: name.value,
          account: account.value,
          phone: phone.value,
        }
      };
      emit('nextStep', data);
    };

    return {
      bank,
      name,
      account,
      phone,

      translation,
      lang,
      submitIsDisabled,

      next
    };
  },
}
</script>