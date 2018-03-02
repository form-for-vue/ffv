<template>
  <div class="card">
    <field-customizer v-for="(item, index) in value" v-model="value[index]" :key="item.id"></field-customizer>
    <div class="row col-12 justify-content-center">
      <button type="button"
              class="btn btn-primary"
              @click="value.push({
                  id: `Field-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                  type: 'text',
                  size: 12,
                })">
        Add Field
      </button>
    </div>
  </div>
</template>

<script>
  import FieldCustomizer from '../components/field-customizer'
  export default {
    props: {
      value: Array,
    },
    components: {
      FieldCustomizer
    },
  }
</script>
