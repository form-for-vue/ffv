<template>
  <div :id="id" class="form-group mb-0" :class="{[classNames]: classNames, [`col-md-${size}`]: size}">
    <div class="row col-md-12 align-items-center h-100">
      <b-form-checkbox
        :checked="value"
        :required="required"
        :disabled="disabled"
        :invalid="invalid ? 'invalid' : 'null'"
        @change="handleChange"
      >
        <div v-if="displayLabel" v-html="label"></div>
      </b-form-checkbox>

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
    </div>
  </div>
</template>

<script>
  import widgetMixin from '../mixins/widget-mixin'

  export default {
    name: 'checkbox-widget',

    mixins: [widgetMixin],

    props: {
      value: Boolean,
    },

    methods: {
      handleChange (value) {
        this.handleInput(value)
        this.handleBlur(value)
      },
    },
  }
</script>
