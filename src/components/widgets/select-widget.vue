<template>
  <wrapper-widget :id="id" :classNames="classNames" :size="size">
    <div class="col-md-12">
      <b-form-select
        :value="value"
        :required="required"
        :disable="disabled"
        :options="[]"
        :state="invalid ? 'invalid' : 'null'"
        @input="handleInput"
        @change="handleBlur"
      >
        <option v-if="displayLabel" :value="null" v-html="placeholder"></option>
        <option
          v-for="option in enumOptions"
          :key="option.value"
          :value="option.value"
          v-html="option.label"></option>
      </b-form-select>
    </div>

    <div v-if="displayLabel" slot="label" v-html="label"></div>

    <p
      v-if="displayLabel"
      slot="description"
      style="text-align: justify;"
      class="text-muted"
      v-html="description">
    </p>

    <template slot="feedback" v-if="displayErrors">
      <div v-for="error in errors" :key="error">{{ error }}</div>
    </template>
  </wrapper-widget>
</template>

<script>
  import WrapperWidget from './wrapper-widget.js'
  import widgetMixin from '../mixins/widget-mixin'

  export default {
    name: 'select-widget',

    components: {
      WrapperWidget,
    },

    mixins: [widgetMixin],

    props: {
      value: {
        type: [String, Number],
        default: null,
      },
      placeholder: String,
      enumOptions: Array,
    },
  }
</script>
