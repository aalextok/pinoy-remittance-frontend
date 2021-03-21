<template>
  <currency-converter :lang="lang" :data="data" v-if="step === 0" @nextStep="onNextStep"></currency-converter>
  <customer-form :lang="lang" :data="data" v-if="step === 1" @nextStep="onNextStep"></customer-form>
  <bank-account-form :lang="lang" :data="data" v-if="step === 2 && data.type === 'bank'" @nextStep="onNextStep"></bank-account-form>
  <receiver-form :lang="lang" :data="data" v-if="step === 2 && data.type === 'remittance'" @nextStep="onNextStep"></receiver-form>
  <confirmation :lang="lang" :data="data" v-if="step === 3" @nextStep="onNextStep"></confirmation>
</template>

<script>
import { ref } from 'vue';
import CurrencyConverter from './CurrencyConverter.vue';
import CustomerForm from './CustomerForm.vue';
import ReceiverForm from './ReceiverForm.vue';
import BankAccountForm from './BankAccountForm.vue';
import Confirmation from './Confirmation.vue';

export default {
  name: 'Home',
  components: {
    CurrencyConverter,
    CustomerForm,
    ReceiverForm,
    BankAccountForm,
    Confirmation,
  },
  setup: () => {
    const lang = ref(localStorage.getItem('remittance-lang') || 'fil');
    const data = ref(JSON.parse(localStorage.getItem('remittance-form-data')) || {});
    const step = ref(data.value.step || 0);

    const onNextStep = (_data = {}) => {
      step.value = _data.step;
      const savedData = JSON.parse(localStorage.getItem('remittance-form-data')) || {};
      const updatedData = { ...savedData, ..._data };
      localStorage.setItem('remittance-form-data', JSON.stringify(updatedData));
      data.value = updatedData;
    };

    return {
      step,
      lang,
      data,

      onNextStep
    };
  }
}

</script>