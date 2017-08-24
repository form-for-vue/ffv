<template>
  <form>
    <schema-field
      :schema="schema"
      :value="value"
      @input="value => $emit('input', value)"
    ></schema-field>
  </form>
</template>

<script>
  //  import validateFormData from '../validate'

  export default {
    props: {
      schema: {
        type: Object,
        required: true
      },
      noValidate: {
        type: Boolean,
        default: false
      },
      noHtml5Validate: {
        type: Boolean,
        default: false
      },
      liveValidate: {
        type: Boolean,
        default: false
      },
      id: String,
      name: String,
      method: String,
      target: String,
      action: String,
      onSubmit: Function,
      value: Object
    },

    methods: {
      validate () {

      }
//      onSubmit (event) {
//        if (!this.noValidate) {
// //          const {errors} = this.validate(this.formData)
//        }
//
//        if (this.onSubmit) {
//          this.onSubmit()
//        }
//      }
    }
  }
</script>
