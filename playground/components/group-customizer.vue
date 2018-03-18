<template>
  <div class="card bg-light m-1">
    <div class="card-header bg-secondary text-light">
      <div class="row align-items-center">
        <div class="col">Group Of Fields</div>
        <button
          type="button"
          class="btn btn-danger m-1"
          @click.stop="$emit('remove', {id})">🗙</button>
      </div>
    </div>
    <div class="p-2">
      <transition-group name="flip-list">
        <field-customizer
          v-for="(item, index) in value"
          v-model="value[index]"
          @move="handleFieldMove"
          @remove="handleRemove"
          :key="item.id"/>
      </transition-group>
      <div class="row col-12 justify-content-center">
        <button type="button"
                class="btn btn-primary m-1"
                @click="value.push({
                    id: `Field-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                    type: 'text',
                    size: 12,
                  })">
          Add Field
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import FieldCustomizer from '../components/field-customizer'
  export default {
    components: {
      FieldCustomizer
    },
    methods: {
      move (array, from, to) {
        if (array.length === 1) return array
        array.splice(to, 0, array.splice(from, 1)[0])
        return array
      },
      handleFieldMove ({ id, dir }) {
        const from = this.value.findIndex(item => item.id === id)
        const to = from + dir
        if (to < 0 || to > this.value.length - 1) {
          this.$emit('move', { id: this.id, from, dir })
          return
        }
        this.move(this.value, from, to)
      },
      handleRemove({ id }){
        const from = this.value.findIndex(item => item.id === id)
        this.value.splice(from, 1)
      },
    },
    props: {
      value: Array,
      id: String,
    },
  }
</script>
