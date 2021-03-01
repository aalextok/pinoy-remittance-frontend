<template>
  <div class="card">
    <div class="card-header">
      <p class="card-header-title">
        <slot name="header"></slot>
      </p>
      <div class="card-header-icon" aria-label="more options" @click="toggleCard">
        <span class="icon">
          <i class="fas" :class="[isCardOpen ? 'fa-angle-down' : 'fa-angle-right']" aria-hidden="true"></i>
        </span>
      </div>
    </div>
    <div class="card-content" v-if="isCardOpen">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Card',
  setup: () => {
    const isCardOpen = ref(false);
    const toggleCard = () => {
      isCardOpen.value = !isCardOpen.value;
    };

    return {
      isCardOpen,
      toggleCard,
    };
  } 
}
</script>