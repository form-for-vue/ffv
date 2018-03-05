<template>
  <div class="d-flex">
    <div class="col-6">
      <transition-group name="flip-list">
        <template v-for="(item, index) in fields">
          <group-customizer
            v-if="item.type === 'group'"
            :key="item.id"
            v-model="fields[index]['value']"
            :id="item.id"
            @move="handleGroupPop"/>
          <field-customizer
            v-else
            v-model="fields[index]"
            :key="item.id"
            @move="handleFieldMove"/>
        </template>
      </transition-group>
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
                @click="fields = [...fields, {
                    type: 'group',
                    id: `Group-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                    value: [],
                  }
                ]">
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
    components: {
      FieldCustomizer,
      GroupCustomizer,
    },
    data () {
      return {
        generatedSchema: defaultSchema,
        generatedUiSchema: defaultUiSchema,
        defaultWidget: defaultWidget,
        fields: [],
      }
    },
    methods: {
      move (array, from, to) {
        if (array.length === 1) return array
        array.splice(to, 0, array.splice(from, 1)[0])
        return array
      },
      handleFieldMove ({ id, dir }) {
        const from = this.fields.findIndex(item => item.type !== 'group' && item.id === id)
        const to = from + dir
        if (to < 0 || to > this.fields.length - 1) {
          return
        }
        if (this.fields[to]['type'] !== 'group') {
          this.move(this.fields, from, to)
        } else {
          const pop = this.fields.splice(from, 1)[0]
          setTimeout(()=>{
            dir < 0 ? this.fields[to]['value'].push(pop) : this.fields[to - 1]['value'].splice(0, 0, pop)
          }, 10)
        }
      },
      handleGroupPop ({ id, from, dir }) {
        const groupIndex = this.fields.findIndex(item => item.type === 'group' && item.id === id)
        const pop = this.fields[groupIndex]['value'].splice(from, 1)[0]
        this.fields.splice(dir < 0 ? groupIndex : groupIndex + dir, 0, pop)
      },
    },
  }
</script>

<style>
  .flip-list-move {
    transition: transform 0.5s;
  }
</style>
