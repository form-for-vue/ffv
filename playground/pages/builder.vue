<template>
  <div class="d-flex">
    <div class="col-6">
      <template v-for="(item, index) in fields">
        <group-customizer v-if="Array.isArray(item)" v-model="fields[index]"></group-customizer>
        <field-customizer v-else v-model="fields[index]" :key="item.id"></field-customizer>
      </template>
      <div class="row col-12 justify-content-center">
        <button type="button"
                class="btn btn-primary m-1"
                @click="fields.push({
                  id: `Field-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                  type: 'text',
                  size: 12,
                })">
          Add Field
        </button>
        <button type="button"
                class="btn btn-primary m-1"
                @click="fields = [...fields, []]">
          Add Group
        </button>
      </div>
    </div>
    <div class="col-6">
    <v-form
      ref="preview"
      :schema="generatedSchema"
      :ui-schema="generatedUiSchema">
    </v-form>
    </div>
  </div>
</template>

<script>
  import FieldCustomizer from '../components/field-customizer'
  import GroupCustomizer from '../components/group-customizer'

  const defaultSchema = {
    "type": "object",
    "properties": {}
  }
  const defaultUiSchema = {
    "ui:options": {
      // "$id": ""
    },
  }
  const defaultWidget = {
    schema: {},
    uiSchema: {}
  }

  export default {
    data () {
      return {
        generatedSchema: defaultSchema,
        generatedUiSchema: defaultUiSchema,
        defaultWidget: defaultWidget,
        fields: [],
      }
    },
    components: {
      FieldCustomizer,
      GroupCustomizer,
    }
  }
</script>
