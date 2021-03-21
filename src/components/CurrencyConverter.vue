<template>
  <div class="card">
    <div class="card-content">
      <div class="content">
        <form @submit.prevent="next">
          <div class="field is-horizontal">
            <div class="field-body">
              <div class="field">
                <p class="control has-icons-left">
                  <input id="baht" class="input" type="number" min="0" step="0.01" placeholder="Baht *" :value="baht" @input="convert" v-bind:disabled="inputIsDisabled" >
                  <span class="icon is-small is-left">&#3647;</span>
                  <span class="help is-info">{{ translation.how_much_send[lang] }}</span>
                </p>
              </div>
              <div class="field">
                <p class="control has-icons-left">
                  <input id="peso" class="input" type="number" min="0" step="0.01" placeholder="Peso *" :value="peso" @input="convert" v-bind:disabled="inputIsDisabled" >
                  <span class="icon is-small is-left">&#8369;</span>
                  <span class="help is-info">{{ translation.how_much_receive[lang]}}</span>
                </p>
              </div>
              <div class="field">
                <p class="control">
                  <label class="radio">
                    <input type="radio" name="type" value="bank" v-model="type" @change="convert">
                    &nbsp;<i class="fas fa-university"></i>
                  </label>
                  <label class="radio">
                    <input type="radio" name="type" value="remittance" v-model="type" @change="convert">
                    &nbsp;<i class="fas fa-money-bill"></i>
                  </label>
                  <span class="help is-info">{{ translation.bank_remittance[lang] }}</span>
                </p>
              </div>
              <div class="field">
                <label class="label" v-if="exchangeRate[type].peso">&#3647;{{ exchangeRate[type].baht }} = &#8369;{{ exchangeRate[type].peso }}</label>
                <label class="label" v-if="fee">Fee (incl.): &#3647;{{ fee.fee }}</label>
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
          <div class="notification is-danger is-light" v-if="errorMessage">
            <button type="button" class="delete" @click="resetError"></button>
            {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import translation from './../translation';
import useAPI from './../composables/useAPI';
import { ExchangeRateApi } from './../services/ApiRequest';

export default {
  name: 'CurrencyConverter',
  emits: [ 'nextStep' ],
  props: [ 'lang', 'data' ],
  setup: ({ lang, data = {} }, { emit }) => {

    const baht = ref(data.baht || null);
    const peso = ref(data.peso || null);
    const type = ref(data.type || 'bank');
    const exchangeRate = ref({ bank: {}, remittance: {} });
    let fees = [];
    const fee = ref(null);
    
    const { errorMessage, call, resetError } = useAPI();

    let lastFocusedInputId = data.convert_from;
    const inputIsDisabled = ref(true);
    const submitIsDisabled = ref(true);

    onMounted(() => {
      call({ callable: ExchangeRateApi.getActiveAndRecent }).then(result => {
        const { active, fees: _fees } = result;
        exchangeRate.value = active;
        fees = _fees.map((_fee) => ({
          ..._fee,
          min: !!_fee.min ? parseFloat(_fee.min) : 0,
          max: !!_fee.max ? parseFloat(_fee.max) : Number.MAX_SAFE_INTEGER,
          fee: parseFloat(_fee.fee),
        }));
        inputIsDisabled.value = false;
        convert();
        submitIsDisabled.value = !(!!baht.value && !!peso.value);
      });
    });

    watch([ baht, peso, type ], (values) => {
      const _baht = values[0];
      const _peso = values[1];
      submitIsDisabled.value = !(!!_baht && !!_peso);
    });

    const convert = () => {
      let inputId = lastFocusedInputId;
      const focusedId = document.activeElement.getAttribute('id');
      if (['baht', 'peso'].includes(focusedId)) {
        inputId = focusedId;
        lastFocusedInputId = focusedId;
      }

      const elementBaht = document.getElementById('baht');
      const elementPeso = document.getElementById('peso');

      if (inputId === 'baht') {
        // Convert to Peso
        baht.value = elementBaht.value;
        // Is value eligible for conversion?
        // should be numeric, non negative and larger than fee
        const value = elementBaht.valueAsNumber;
        if (!Number.isNaN(value) && value > 0) {
          const _baht = value;
          const _fee = fees.find(({ min, max, type: _type }) => value > min && value <= max && _type === type.value);
          const _peso = (_baht - _fee.fee) * exchangeRate.value[type.value].peso;
          if (_peso > 0) {
            peso.value = _peso.toFixed(2);
            fee.value = _fee;
            return;
          }
        }
        peso.value = null;
        fee.value = null;
        
      } else if (inputId === 'peso') {
        // Convert to Baht
        peso.value = elementPeso.value;
        const value = elementPeso.valueAsNumber;
        if (!Number.isNaN(value) && value > 0) {
          const _baht = value / exchangeRate.value[type.value].peso;
          const _fee = fees.find(({ min, max, type: _type }) => _baht > min && _baht <= max && _type === type.value);
          if (_baht - _fee.fee > 0) {
            baht.value = (_baht - _fee.fee).toFixed(2);
            fee.value = _fee;
            return;
          }
        }
        baht.value = null;
        fee.value = null;
      }
    };

    const next = () => {
      const _data = {
        step: 1,
        convert_from: lastFocusedInputId,
        baht: baht.value,
        peso: peso.value,
        type: type.value,
        exchange_rate: exchangeRate.value[type.value].peso,
        exchange_rate_id: exchangeRate.value[type.value].id,
        fee: fee.value.fee,
        fee_id: fee.value.id,
      };
      emit('nextStep', _data);
    };


    return {
      translation,
      lang,

      baht, peso, exchangeRate, fee, type,

      convert,
      resetError,
      next,

      submitIsDisabled,
      inputIsDisabled,

      errorMessage,
    };
  }
}

</script>