<template>
  <div>
    <schema-prop
      v-for="item in items"
      :schema="item.schema"
      :uiSchema="item.uiSchema"
      :errorSchema="item.errorSchema"
      :value="item.value"
      @input="itemVal => $emit('input', items.splice(item.index, 1, itemVal))"
      @blur="itemVal => $emit('blur', items.splice(item.index, 1, itemVal))"
    ></schema-prop>
  </div>
</template>

<script>
  export default {
    props: {
      schema: Object,
      uiSchema: Object,
      errorSchema: [Object, Boolean],
      required: Boolean,
      value: Object
    },

    computed: {
      items () {
        this.schema.items.map((item, index) => {
          const itemValue = (this.value || {})[index]
          const itemSchema = this.schema.items[index]
          const itemUiSchema = this.uiSchema && this.uiSchema[index] !== undefined ? this.uiSchema[index] : {}
          const itemErrorSchema = this.errorSchema && this.errorSchema[index] !== undefined ? this.errorSchema[index] : {}
          return {
            index: index,
            value: itemValue,
            schema: itemSchema,
            uiSchema: itemUiSchema,
            errorSchema: itemErrorSchema
          }
        })
      }
    }
  }
</script>
