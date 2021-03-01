<template>
  <card>
    <template v-slot:header>
      <exchange-rate-badge :rateExists="rateExists" :rate="exchangeRate" />
    </template>
    <exchange-rate :recentRates="recentRates" @submitted="onSubmitted" />
  </card>
  <card>
    <template v-slot:header>Transactions</template>
    TODO...
  </card>
</template>

<script>
import { onMounted } from 'vue';
import Card from './Card.vue';
import ExchangeRate from './ExchangeRate.vue';
import ExchangeRateBadge from './ExchangeRateBadge.vue';

import useExchangeRate from './../composables/useExchangeRate';

export default {
  name: 'Dashboard',
  components: {
    Card,
    ExchangeRate,
    ExchangeRateBadge,
  },
  setup: () => {
    const { rateExists, exchangeRate, recentRates, loadExchangeRateData } = useExchangeRate();

    onMounted(() => {
      loadExchangeRateData();
    });

    const onSubmitted = () => {
      loadExchangeRateData();
    };

    return {
      rateExists, exchangeRate, recentRates, onSubmitted
    };
  } 
}
</script>