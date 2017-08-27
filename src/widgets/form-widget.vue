<template>
  <b-form @submit="onSubmit" :novalidate="noHtml5Validate">
    <slot></slot>

    <slot name="actions"></slot>
  </b-form>
</template>

<script>
  export default {
    props: {
      onSubmit: Function,
      noHtml5Validate: Boolean,
    }
  }
</script>
