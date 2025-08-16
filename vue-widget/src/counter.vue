<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>

<script setup lang="ts">
import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue';

const count = ref(0);

const increment = () => {
  count.value++;
  console.log(count.value);
};

onMounted(() => {
  console.log('onMounted');
  console.log(count.value);
});

onUnmounted(() => {
  console.log('onUnmounted');
});

onActivated(() => {
  console.log('onActivated');
  console.log(count.value);
});

onDeactivated(() => {
  console.log('onDeactivated');
  console.log(count.value);
});
</script>
