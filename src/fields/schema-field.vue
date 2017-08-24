<template>
  <component
    :is="`${schema.type}-field`"
    :name="name"
    :schema="schema"
    :uiSchema="uiSchema"
    :value="value"
    @input="value => $emit('input', value)"
  ></component>
</template>

<script>
  const COMPONENT_TYPES = {
    array: "ArrayField",
    boolean: "BooleanField",
    integer: "NumberField",
    number: "NumberField",
    object: "ObjectField",
    string: "StringField",
  };

  export default {
    props: {
      name: String,
      schema: Object,
      uiSchema: Object,
      value: null
    }
  }
</script>
