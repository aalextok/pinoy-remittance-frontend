<template>
  <div class="card">
    <div class="card-content">
      <div class="content">
        <form @submit.prevent="next">
          <div class="field is-horizontal" v-if="accounts.length > 0">
            <div class="field-body">
              <div class="field">
                <div class="select">
                  <select v-model="accountId" @change="onAccountSelect" >
                    <option :key="0" :value="0">-- {{ translation.existing_accounts[lang] }} --</option>
                    <option v-for="_account in accounts" :key="_account.id" :value="_account.id">
                      {{ _account.account }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-body">
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
            <div class="field-body">
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
          <div class="field is-horizontal">
            <div class="field-body is-flex is-justify-content-space-between">
              <button type="button" class="button is-ghost" @click="next('back')" >
                <i class="fas fa-angle-left"></i>
              </button>
              <button type="submit" class="button is-ghost" v-bind:disabled="submitIsDisabled" >
                <i class="fas fa-angle-right"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import translation from './../translation';
import useAuth from '../composables/useAuth';
import useAPI from '../composables/useAPI';
import { CustomerApi } from '../services/ApiRequest';

export default {
  name: 'ReceiverForm',
  props: [ 'lang', 'data' ],
  emits: [ 'nextStep' ],
  setup: ({ lang, data = {} }, { emit }) => {

    const { isLoggedIn } = useAuth();

    const { receiver = {} } = data;

    const bank = ref(receiver.bank || null);
    const name = ref(receiver.name || null);
    const account = ref(receiver.account || null);
    const phone = ref(receiver.phone || null);
    const accountId = ref(0);

    const accounts = ref([]);

    const submitIsDisabled = ref(!(!!bank.value && !!name.value && !!account.value && !!phone.value));

    onMounted(() => {
      if (isLoggedIn.value) {
        const { call } = useAPI();
        call({ callable: CustomerApi.getBankAccounts }).then(result => {
          accounts.value = result;
          accountId.value = receiver.id || 0;
        });
      }
    });
    
    watch([ bank, name, account, phone, accountId ], (values, prevValues) => {
      const [ _bank, _name, _account, _phone, _accountId ] = values;
      const [ _prevBank, _prevName, _prevAccount, _prevPhone, _prevAccountId ] = prevValues;
      submitIsDisabled.value = !(!!_bank && !!_name && !!_account && !!_phone);

      const idChanged = !!_accountId && !!_prevAccountId && _accountId !== _prevAccountId;
      const bankChanged = !!_prevBank && _bank !== _prevBank;
      const nameChanged = !!_prevName && _name !== _prevName;
      const accountChanged = !!_prevAccount && _account !== _prevAccount;
      const phoneChanged = !!_prevPhone && _phone !== _prevPhone;
      if (!idChanged && (bankChanged || nameChanged || accountChanged || phoneChanged)) {
        accountId.value = 0;
      }
    });

    const onAccountSelect = () => {
      if (accountId.value > 0) {
        const _account = accounts.value.find(_a => _a.id === accountId.value);
        bank.value = _account.bank;
        name.value = _account.name;
        account.value = _account.account;
        phone.value = _account.phone;
      } else {
        bank.value = null;
        name.value = null;
        account.value = null;
        phone.value = null;
      }
    };

    const next = (direction = 'next') => {
      const _data = {
        step: direction === 'back' ? 1 : 3,
        receiver: {
          id: accountId.value,
          bank: bank.value,
          name: name.value,
          account: account.value,
          phone: phone.value,
        }
      };
      emit('nextStep', _data);
    };

    return {
      bank,
      name,
      account,
      phone,
      accountId,

      accounts,

      translation,
      lang,
      submitIsDisabled,
      
      onAccountSelect,

      next
    };
  },
}
</script>
<style scoped>
  .select {
    width: 100%;
  }
  .select select {
    width: 100%;
  }
</style>