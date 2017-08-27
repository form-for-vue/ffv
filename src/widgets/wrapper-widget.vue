<template>
  <b-form-group
    :label="label"
  >
    <slot></slot>

    <div slot="feedback">
      <slot name="feedback"></slot>
    </div>
  </b-form-group>
</template>

<script>
  export default {
    props: {
      label: String,
    }
  }
</script>
