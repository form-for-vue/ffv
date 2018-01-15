<template>
  <b-form @submit="onSubmit" :novalidate="noHtml5Validate">
    <slot></slot>

    <slot name="actions"></slot>
  </b-form>
</template>

<script>
  export default {
    props: {
      onCustomSubmit: Function,
      noHtml5Validate: Boolean,
    },

    methods: {
      onSubmit () {
        if (this.onCustomSubmit) {
          this.onCustomSubmit()
        }
      },
    },
  }
</script>
