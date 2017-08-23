<template>
  <b-form-checkbox
    v-model="value"
  ></b-form-checkbox>
</template>

<script>
  export default {
    props: {
      schema: {
        type: Object
      },
      value: {
        type: Object,
      },
    },
  }
</script>
