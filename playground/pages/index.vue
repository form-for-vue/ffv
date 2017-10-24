<template>
  <div class="d-flex flex-column justify-content-center align-items-center">
    <b-card class="w-100 bg-primary">
      <b-select
        class="w-25"
        :value="selectedValue"
        :options="formSelectOptions"
        @input="changeForm"
      ></b-select>
    </b-card>
    <v-form
      ref="ffv"
      :schema="schema"
      :ui-schema="uiSchema"
      v-model="value">
    </v-form>
  </div>
</template>

<script>
  import { samples } from '~/static/samples'

  export default {
    asyncData () {
      const simple = samples.simple
      return {
        schema: simple.schema,
        uiSchema: simple.uiSchema,
        value: simple.value,
        formSelectOptions: [
          {value: samples.simple, text: 'Simple'},
          {value: samples.single, text: 'Single'},
        ],
        selectedValue: samples.simple,
      }
    },

    methods: {
      changeForm(val) {
        this.schema = val.schema
        this.uiSchema = val.uiSchema
        this.value = val.value
      },
    }
  }
</script>
