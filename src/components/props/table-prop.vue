<template>
  <div :class="`col-md-${size} mt-2 border`">
    <div class="row justify-content-center">
      <schema-prop
        :schema="schema.items"
        :uiSchema="uiSchema.items"
        :errorSchema="internalErrorSchema"
        :value="itemValue"
        :registry="registry"
        @input="handleInput"
        @blur="handleBlur"
      />

    </div>

    <div class="row justify-content-center mt-4 mb-5">
      <b-btn
        class="table-prop__add-btn-text px-3"
        @click="add"
        variant="success"
        :disabled="isInternalValueEmpty()">
        {{ uiOptions.addBtnText || buttonText }}
      </b-btn>
    </div>
    <div class="text-danger" v-for="error in errors" :key="error">{{ error }}</div>
    <table class="table table-prop__table" v-show="this.internalValue && this.internalValue.length">
      <thead>
        <tr>
          <th v-for="field in fields" :key="field.label">{{ field.label }}</th>
          <th><!--empty column header for removal action--></th>
        </tr>
      </thead>
      <draggable v-model="flattenValue" :element="'tbody'">
        <tr v-for="(item, index) in flattenValue" :key="item">
          <td v-for="field in fields" :key="field.key">{{ item[field.key] }}</td>
          <td>
            <button
              type="button"
              class="btn btn-info m-1"
              @click.stop="select(index)">✎</button>
            <button
              type="button"
              class="btn btn-danger m-1"
              @click.stop="remove(index)">🗙</button>
          </td>
        </tr>
      </draggable>
    </table>
  </div>
</template>

<script>
  import { arrayMixin, objectMixin } from '../mixins'
  import draggable from 'vuedraggable'
  import { isEmpty } from '../../utils'
  import { validateFormData } from '../../validate'

  export default {
    components: {
      draggable
    },

    mixins: [arrayMixin, objectMixin],

    props: {
      name: String,
      schema: Object,
      uiSchema: Object,
      errorSchema: [Object, Boolean],
      idSchema: Object,
      value: Array,
      registry: Object,
      uiOptions: Object,
    },

    data () {
      return {
        itemValue: null,
        internalValue: this.value || [],
        internalErrorSchema: null,
        index: Array.isArray(this.value) ? this.value.length : 0,
        size: 12,
        buttonText: '+Add'
      }
    },

    computed: {
      itemsProps () {
        return this.schema && this.schema.items ? this.schema.items.properties : []
      },
      itemsUiOptions () {
        return this.uiSchema.items && this.uiSchema.items['ui:options'] ? this.uiSchema.items['ui:options'] : {}
      },
      fields () {
        return this.orderProperties(Object.keys(this.itemsProps), this.itemsUiOptions.order).map(propName => {
          return {
            key: propName,
            label: this.itemsProps[propName].title || propName,
          }
        })
      },
      flattenValue: {
        get () {
          return (this.value || []).map(item => {
            if (typeof item === 'object') {
              return Object.keys(item).reduce((flattenedItem, propName) => {
                flattenedItem[propName] = this.flattenProp(propName, item[propName])
                return flattenedItem
              }, {})
            }
          })
        },
        set (value) {
          this.internalValue = value
          this.$emit('input', { value })
        }
      },
    },

    methods: {
      add () {
        this.validate({ allErrors: true })
        if (!this.isInternalValueEmpty() && !this.internalErrorSchema) {
          this.onAddClick()
          this.internalValue.splice(this.index, 1, this.itemValue)
          this.$emit('input', { value: this.internalValue })
          this.index = this.internalValue.length
          // TODO set itemValue to null is not working
          this.itemValue = null
          this.buttonText = '+Add'
        }
      },
      validate (options = { allErrors: false }) {
        const { errorSchema } = validateFormData(this.schema.items, this.itemValue, options)
        this.internalErrorSchema = !isEmpty(errorSchema) ? errorSchema : null
      },
      select (index) {
        this.index = index
        this.itemValue = this.internalValue[index]
        this.buttonText = 'Update'
      },
      remove (index) {
        this.onDropIndexClick(index)
        this.internalValue = this.internalValue.filter((_, i) => i !== index)
        this.$emit('input', { value: this.internalValue })
        this.index = this.internalValue.length
      },
      reorderUp (index) {
        if (index > 0) {
          this.onReorderClick(index, index - 1)
        }
      },
      reorderDown (index) {
        if (index < this.internalValue.length - 1) {
          this.onReorderClick(index, index + 1)
        }
      },
      handleInput ({ value }) {
        this.itemValue = value
      },
      handleBlur ({ value }) {
        this.itemValue = value
      },
      flattenProp (name, value) {
        function flatten (prop) {
          if (Array.isArray(prop)) {
            return prop.map(child => {
              return flatten.call(this, child)
            }).join(',')
          } else if (typeof prop === 'object') {
            if (this.uiOptions.flattener) {
              return prop[this.uiOptions.flattener[name]]
            } else {
              throw new Error('[ffv] ui:options flattener not available! provide flattener object when value array contains complex objects')
            }
          } else {
            return prop
          }
        }

        if (value) {
          return flatten.call(this, value)
        }
      },
      // TODO checking if all values are not null, empty string ('')
      isInternalValueEmpty () {
        if (this.itemValue) {
          return Object.keys(this.itemValue).every(prop => {
            return !this.itemValue[prop] || this.itemValue[prop] === '' || (Array.isArray(this.itemValue[prop]) && !this.itemValue[prop].length)
          })
        } else {
          return true
        }
      },
    }
  }
</script>

<style lang="scss">

  .table-prop__add-btn-text {
    color: white;
    border: 0;
    border-radius: 0;
  }

  .table-prop__table__action-head {
    width: 6%;
    visibility: hidden;
  }

  .table-prop__table__col {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  #table-prop__table.table {
    td {
      border-top: none;
      border-bottom: none;
    }
  }

  .table-prop__table.table {
    th,
    td {
      vertical-align: middle;
    }

    tr td:last-child {
      width: 1%;
      white-space: nowrap;
    }
  }

  #table-prop__table.table-hover {
    tbody tr {
      &:hover {
        color: black;
        transition: 0.2s;
        transition-timing-function: linear;

        .table-prop__table__action-col {
          color: white;
        }
      }
    }
  }
</style>
