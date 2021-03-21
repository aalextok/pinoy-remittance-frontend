<template>
  <div class="card">
    <div class="card-content">
      <div class="content">
        <div class="columns is-mobile is-centered">
          <div class="column has-text-right is-italic">{{ translation.amount_to_send[lang] }}:</div>
          <div class="column has-text-weight-bold">&#3647;{{ data.baht }}</div>
        </div>
        <div class="columns is-mobile is-centered">
          <div class="column has-text-right is-italic">{{ translation.amount_to_receive[lang] }}:</div>
          <div class="column has-text-weight-bold">&#8369;{{ data.peso }}</div>
        </div>
        <div class="columns is-mobile is-centered">
          <div class="column has-text-right is-italic">{{ translation.exchange_rate[lang] }}:</div>
          <div class="column has-text-weight-bold">&#3647;1 = &#8369;{{ data.exchange_rate }}</div>
        </div>
        <div class="columns is-mobile is-centered">
          <div class="column has-text-right is-italic">{{ translation.fee[lang] }}:</div>
          <div class="column has-text-weight-bold">&#3647;{{ data.fee }}</div>
        </div>
        <div class="columns is-mobile is-centered">
          <div class="column has-text-right is-italic">{{ translation.sender[lang] }}:</div>
          <div class="column">
            <div class="has-text-weight-bold">{{ data.firstname }} {{ data.middlename }} {{ data.lastname }}</div>
            <div>{{ data.email }}</div>
            <div>{{ data.phone }}</div>
          </div>
        </div>
        <div class="columns is-mobile is-centered" v-if="data.type === 'bank'">
          <div class="column has-text-right is-italic">{{ translation.bank_account[lang] }}:</div>
          <div class="column">
            <div class="has-text-weight-bold">{{data.receiver.account}} {{data.receiver.bank}} </div>
            <div>{{ data.receiver.name }}</div>
            <div>{{ data.receiver.phone }}</div>
          </div>
        </div>
        <div class="columns is-mobile is-centered" v-if="data.type === 'remittance'">
          <div class="column has-text-right is-italic">{{ translation.receiver[lang] }}:</div>
          <div class="column">
            <div class="has-text-weight-bold">{{data.receiver.name}}</div>
            <div>{{ data.receiver.date_of_birth }}</div>
            <div>{{ data.receiver.address }}</div>
            <div>{{ data.receiver.phone }}</div>
          </div>
        </div>
        <div class="notification is-danger is-light" v-if="errorMessage">
          {{ errorMessage }}
          <button class="delete" @click="resetError"></button>
        </div>
        <form @submit.prevent="submit">
          <div class="field is-horizontal">
            <div class="field-body is-flex is-justify-content-space-between">
              <button type="button" class="button is-ghost" @click="back" >
                <i class="fas fa-angle-left"></i>
              </button>
              <div class="field">
                <div class="control has-text-right">
                  <button type="submit" class="button is-primary" :class="[isSaving ? 'is-loading' : '']">
                    {{ translation.request_money_transfer[lang] }}
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
import { useRouter } from 'vue-router';
import { TransactionApi } from './../services/ApiRequest';
import useAPI from './../composables/useAPI';
import translation from './../translation';

export default {
  name: 'Confirmation',
  props: [ 'lang', 'data' ],
  emits: [ 'nextStep' ],
  setup: ({ lang, data }, { emit }) => {

    const router = useRouter();

    const { isLoading: isSaving, errorMessage, call, resetError } = useAPI();

    const submit = () => {
      call({ callable: TransactionApi.post, data }).then(result => {
        if (!!result.token && !!result.user) {
          // TODO: make sure authentication
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
        }
        if (!!result.transaction) {
          localStorage.removeItem('remittance-form-data');
          router.push({ name: 'transaction', params: { id: result.transaction.uuid } })
        } else {
          errorMessage.value = 'Something went wrong';
        }
      });
    };

    const back = () => {
      emit('nextStep', {
        step: 2,
        ...data.value
      });
    };

    return {
      isSaving,
      errorMessage,
      resetError,

      data,

      translation,
      lang,
      submit,
      back,
    };
  }
}
</script>