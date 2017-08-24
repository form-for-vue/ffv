<template>
  <b-form-group
    :label="label"
    >
    <slot></slot>
  </b-form-group>
</template>

<script>
  export default {
    props: {
      label: String,
    }
  }
</script>
