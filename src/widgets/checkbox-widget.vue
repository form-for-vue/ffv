<template>
  <b-form-checkbox v-model="localValue">{{ label }}</b-form-checkbox>
</template>

<script>
  export default {
    name: 'checkbox-widget',
    data () {
      return {
        localValue: false
      }
    },
    props: {
      label: String,
      value: Boolean
    },
    created () {
      this.localValue = this.value
    },
    watch: {
      localValue (val, oldVal) {
        if (val === oldVal) return
        this.$emit('input', val)
      }
    }
  }
</script>
