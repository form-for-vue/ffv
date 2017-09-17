<template>
  <component
    :is="getWidget(schema, uiOptions.widget || 'checkbox', registry.widgets)"
    :label="uiOptions.noLabel ? undefined : schema.title"
    :description="description"
    :required="required"
    :disabled="disabled"
    :invalid="invalid"
    :value="value ? value : defaultValue"
    :classNames="classNames"
    :feedbacks="feedbacks"
    @input="value => $emit('input', value)"
    @change="value => $emit('change', value)"
  ></component>
</template>

<script>
  import CheckboxWidget from '@/widgets/checkbox-widget'
  import { getUiOptions } from '@/utils'
  import { mixin } from '@/mixins'

  export default {
    components: {
      CheckboxWidget
    },

    mixins: [mixin],

    props: {
      name: String,
      label: String,
      description: String,
      schema: Object,
      uiSchema: Object,
      required: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      invalid: Boolean,
      value: {
        type: Boolean,
        default: false,
      },
      defaultValue: Boolean,
      classNames: String,
      feedbacks: Array,
      registry: Object,
    },

    data () {
      const uiOptions = getUiOptions(this.schema, this.uiSchema)
      return {
        uiOptions,
      }
    },
  }
</script>
