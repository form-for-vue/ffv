<template>
  <div class="card m-1">
    <div class="card-header" @click="$store.commit('changeEditingField', value.id)">
      <div class="row align-items-center">
        <div class="col">{{ key }}</div>
        <button
          type="button"
          class="btn btn-info m-1"
          @click.stop="$emit('move', {id: value.id, dir: -1})">⮝</button>
        <button
          type="button"
          class="btn btn-info m-1"
          @click.stop="$emit('move', {id: value.id, dir: 1})">⮟</button>
        <button
          type="button"
          class="btn btn-danger m-1"
          @click.stop="$emit('remove', {id: value.id})">🗙</button>
      </div>
    </div>
    <transition name="slide">
      <div v-show="$store.getters.shouldShow(value.id)" class="p-1">
        <div class="form-group row justify-content-around">
          <label for="field-key" class="col-2 col-form-label">key</label>
          <div class="col">
            <input
              class="form-control"
              type="text"
              v-model="value.key"
              @input="emitChange($event, 'key')"
              :placeholder="`Enter a key for field`"
              id="field-key">
          </div>
        </div>
        <div class="form-group row justify-content-around">
          <label for="field-label" class="col-2 col-form-label">Label</label>
          <div class="col">
            <input
              class="form-control"
              type="text"
              v-model="value.label"
              @input="emitChange($event, 'label')"
              :placeholder="`Enter a label for ${key}`"
              id="field-label">
          </div>
        </div>
        <div class="form-group row justify-content-around">
          <label for="field-description" class="col-2 col-form-label">Description</label>
          <div class="col">
            <input
              class="form-control"
              type="text"
              v-model="value.description"
              @input="emitChange($event, 'description')"
              :placeholder="`Enter a description for ${key}`"
              id="field-description">
          </div>
        </div>
        <div class="form-group row justify-content-around">
          <label for="field-type" class="col-2 col-form-label">Type</label>
          <div class="col">
            <select class="form-control" id="field-type" v-model="value.type" @input="emitChange($event, 'type')">
              <option value="text">Text</option>
              <option value="password">Password</option>
              <option value="textarea">Text Area</option>
              <option value="file">File</option>
              <option value="select">Select</option>
              <option value="radio">Radio</option>
              <option value="boolean">Boolean</option>
              <option value="number">Number</option>
              <option value="integer">Integer</option>
            </select>
          </div>
        </div>
        <div v-if="value.enum" class="form-group row justify-content-around mx-2 px-2 border">
          <label for="field-type" class="col-2 col-form-label">Options</label>
          <div class="col">
            <input
              v-for="(item, index) in value.enum"
              :key="index"
              class="form-control my-2"
              type="text"
              v-model="value['enum'][index]"
              @input="emitChange($event, 'enum', index)"
              :id="`option-${index}`">
            <button type="button"
                    class="btn btn-primary my-2"
                    @click="value['enum'].push('')">
              Add Option
            </button>
          </div>
        </div>
        <div class="form-group row justify-content-start">
          <label for="field-required" class="col-2 col-form-label">Required</label>
          <div class="row col-1 align-items-center">
            <input
              class="form-control"
              type="checkbox"
              v-model="value.required"
              @change="emitChange($event, 'required')"
              id="field-required">
          </div>
        </div>
        <div class="form-group row justify-content-around">
          <label for="field-size" class="col-2 col-form-label">Size</label>
          <div class="col">
            <input
              class="form-control"
              type="number"
              min="1"
              max="12"
              v-model="value.size"
              @input="emitChange($event, 'size')"
              :placeholder="`Enter number of bootstrap columns for ${key}`"
              id="field-size">
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Object,
      }
    },
    data () {
      return {
        key: (this.value.key || this.value.id).slice(),
        show: true
      }
    },
    methods: {
      emitChange(e, field, enumIndex) {
        if (field === 'key') {
          this.key = (this.value.key || this.value.id).slice()
        } else if (field === 'type') {
          const type = e.target.value
          if (type === 'select' || type === 'radio') {
            this.value['enum'] = []
            this.$emit('input', this.value)
          } else {
            delete this.value['enum']
            this.$emit('input', this.value)
          }
        }
        if (field === 'enum') {
          this.value['enum'][enumIndex] = e.target.value
          this.$emit('input', this.value)
        } else {
          this.$emit('input',
            Object.assign({}, this.value, {[field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value}))
        }
      },
    }
  }
</script>

<style>
  .slide-enter-active,
  .slide-leave-active {
    max-height: 200px;
  }

  .slide-enter,
  .slide-leave-to /* .slide-leave-active below version 2.1.8 */ {
    max-height: 0;
    overflow-y: hidden;
    -webkit-transition: max-height 0.3s ease-in-out;
    -moz-transition: max-height 0.3s ease-in-out;
    -o-transition: max-height 0.3s ease-in-out;
    transition: max-height 0.3s ease-in-out;
  }

  .form-control:focus {
    box-shadow: 0 0 0;
  }
</style>
