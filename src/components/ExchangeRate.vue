<template>
  <div class="content">
    <div class="field is-horizontal">
      <div class="field-body">
        <div class="field">
          <p class="control has-icons-left">
            <input class="input" type="number" placeholder="Baht *" v-model="baht" @change="checkDisabled" disabled="disabled">
            <span class="icon is-small is-left">&#3647;</span>
          </p>
        </div>
        <div class="field">
          <p class="control has-icons-left">
            <input class="input" type="number" placeholder="Peso *" v-model="peso" @change="checkDisabled">
            <span class="icon is-small is-left">&#8369;</span>
          </p>
        </div>
        <div class="field">
          <p class="control">
            <label class="radio">
              <input type="radio" name="type" value="bank" v-model="type">
              &nbsp;<i class="fas fa-university"></i>
            </label>
            <label class="radio">
              <input type="radio" name="type" value="remittance" v-model="type">
              &nbsp;<i class="fas fa-money-bill"></i>
            </label>
          </p>
        </div>
        <div id="applicable_date" class="field">
          <p class="control has-icons-left">
            <datepicker v-model="date" @update:modelValue="checkDisabled" :lowerLimit="lowerLimit" />
            <span class="icon is-small is-left">
              <i class="fa fa-calendar"></i>
            </span>
          </p>
        </div>
        <div class="field">
          <div class="control has-text-right">
            <button class="button is-primary" @click="setRate" :class="[isSaving ? 'is-loading' : '']" v-bind:disabled="isDisabled">
              Set Exchange Rate
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="notification is-danger" v-if="errorMessage">
      <button type="button" class="delete" @click="resetError"></button>
      {{ errorMessage }}
    </div>
  </div>
  <table class="table is-size-7">
    <tbody>
      <tr v-for="rate in recentRates" :key="rate.id">
        <td>{{rate.date}}</td>
        <td><i class="fas" :class="[rate.type === 'remittance' ?  'fa-money-bill' : 'fa-university']"></i></td>
        <td>&#3647;{{rate.baht}}</td>
        <td>&#8369;{{rate.peso}}</td>
        <td class="is-italic">{{rate.createdAt}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Datepicker from 'vue3-datepicker';
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import useAPI from './../composables/useAPI';
import { ExchangeRateApi } from './../services/ApiRequest';

export default {
  name: 'ExchangeRate',
  props: [
    'recentRates'
  ],
  components: {
    Datepicker
  },
  emits: [ 'submitted' ],
  setup: (props, { emit }) => {

    const date = ref(null);
    const baht = ref(1);
    const peso = ref(null);
    const type = ref(null);
    const isDisabled = ref(true);
    const lowerLimit = ref(new Date());
    const { isLoading: isSaving, errorMessage, call, resetError } = useAPI();

    onMounted(() => {
      const datepickerElementDate = document.getElementById('applicable_date').getElementsByClassName('v3dp__datepicker')[0];
      const inputElementDate = datepickerElementDate.getElementsByTagName('input')[0];
      inputElementDate.setAttribute('class', 'input');
      inputElementDate.setAttribute('placeholder', 'Date *');
    });

    const setRate = () => {
      const data = {
        baht: baht.value, 
        peso: peso.value, 
        // Should be: beginning of the day in current timezone converted to UTC
        date: format(date.value, 'yyyy-MM-dd'),
        type: type.value,
      };
      call({ callable: ExchangeRateApi.post, data }).then(() => {
        emit('submitted');
      });
    };

    const checkDisabled = () => {
      isDisabled.value = !(!!baht.value && !!peso.value && !!date.value && !!type.value);
    };

    return {
      baht, peso, date, type,
      setRate, checkDisabled,
      isSaving, isDisabled,
      lowerLimit,
      errorMessage,
      resetError,
    };
  },
}
</script>
