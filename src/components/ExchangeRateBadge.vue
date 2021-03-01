<template>
  Exchange Rate:&nbsp;
  <span v-if="rateExists" class="notification is-success is-light">
    <div>
      <i class="fas fa-university"></i>
      &#3647;{{ rate.bank.baht }} = &#8369;{{ rate.bank.peso }}
    </div>
    <div>
      <i class="fas fa-money-bill"></i>
      &#3647;{{ rate.remittance.baht }} = &#8369;{{ rate.remittance.peso }}
    </div>
  </span>
  <span v-else class="notification is-danger is-light">?</span>
</template>
<script>
export default {
  name: 'ExchangeRateBadge',
  props: [ 'rate', 'rateExists' ],
}
</script>
