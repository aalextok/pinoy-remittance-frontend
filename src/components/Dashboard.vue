<template>
  <div class="block">
    <card>
      <template v-slot:header>
        <exchange-rate-badge :rateExists="rateExists" :rate="exchangeRate" />
      </template>
      <exchange-rate :recentRates="recentRates" @submitted="onSubmitted" />
    </card>
  </div>
  <div class="block">
    <card v-for="transaction in transactions" :key="transaction.id">
      <template v-slot:header>
        TX#{{ transaction.uuid }}
      </template>
    </card>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import Card from './Card.vue';
import ExchangeRate from './ExchangeRate.vue';
import ExchangeRateBadge from './ExchangeRateBadge.vue';

import useExchangeRate from './../composables/useExchangeRate';
import useTransactions from './../composables/useTransactions';

import { statusColor } from './../miscellaneous';

// TODO: coloring without "notification" class

export default {
  name: 'Dashboard',
  components: {
    Card,
    ExchangeRate,
    ExchangeRateBadge,
  },
  setup: () => {
    const { rateExists, exchangeRate, recentRates, loadExchangeRateData } = useExchangeRate();
    const { transactions, loadTransactionsList } = useTransactions();

    onMounted(() => {
      loadExchangeRateData();
      loadTransactionsList();
      
    });

    const onSubmitted = () => {
      loadExchangeRateData();
    };

    return {
      rateExists, exchangeRate, recentRates, onSubmitted,
      transactions,
    };
  } 
}
</script>
<style scoped>

</style>