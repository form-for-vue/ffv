<template>
  <b-alert
    variant="danger"
    :show="errors && errors.length > 0"
  >
    <p v-for="error in errors" :key="error">{{ error }}</p>
  </b-alert>
</template>

<script>
  export default {
    props: {
      errors: Array,
    }
  }
</script>
