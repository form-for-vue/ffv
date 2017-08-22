<template>
  <form
    :class="className"
    :id="id"
    :name="name"
    :method="method"
    :target="target"
    :action="action"
    :autocomplete="autocomplete"
    :novalidate="noHtml5Validate"
    @submit.prevent="this.onSubmit"
  >
    <schema-field
      :schema="schema"
      :formData="formData"
    ></schema-field>
  </form>
</template>

<script>
  //  import validateFormData from '../validate'

  export default {
    name: 'ffv',

    props: {
      schema: {
        type: Object,
        required: true
      },
      formData: Object,
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
      className: String,
      id: String,
      name: String,
      method: String,
      target: String,
      action: String,
      autocomplete: String,
      onSubmit: Function
    },

    model: {
      prop: 'formData',
      event: 'change'
    },

    methods: {
      validate () {

      },
      onSubmit (event) {
        if (!this.noValidate) {
//          const {errors} = this.validate(this.formData)
        }

        if (this.onSubmit) {
          this.onSubmit()
        }
      }
    }
  }
</script>
