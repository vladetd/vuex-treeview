<template>
  <div>
    <ul>
      <li v-for="industry in industries" :key="industry.sic">
        <input @click="onCheckChecked(industry, $event)" :checked="industry.checked" :value="industry" type="checkbox"> [{{ industry.sic }}] {{ industry.name }}

        <b @click="generateSubtree(industry)">
          <i v-if="!industry.subArray" class="pointer">+</i>
          <i v-if="industry.subArray && industry.subArray.length >= 0" class="pointer">-</i>
        </b>

        <div v-if="industry.subArray">
          <industry-treeview :industries="industry.subArray"></industry-treeview>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import store from '../store.js'
import {mapActions} from 'vuex'

export default {
  name: 'industry-treeview',
  store,
  /**
  * industries - the industries that are listed in the (sub)tree
  * resettreefilters - flag for (de)selecting the filters.
  * @type {Array}
  */
  props: [
    'industries',
    'id',
    'generateSubtreeview'
  ],

  methods: {
    ...mapActions([
      'getSubtreeForIndustry', // map `this.increment()` to `this.$store.dispatch('increment')`
      'checkIndustry',
      'removeSubtreeForIndustry'
    ]),

    /**
    * When an industry is clicked - dispatch that industry
    * to the main component to be inserted in the filters
    * @param  {object} industry
    * @return {void}
    */
    onCheckChecked (industry, event) {
      if (industry !== undefined) {
        this.checkIndustry(industry)
      }
    },

    /**
    * If the industry is not checked - retrieve its subtree.
    * If the industry is checked - delete its subtree.
    * @param  {object} industry
    * @return {void}
    */
    generateSubtree (industry) {
      if (industry.subArray && industry.subArray.length > 0) {
        this.removeSubtreeForIndustry(industry)
      } else {
        this.getSubtreeForIndustry(industry)
      }
    }
  }
}
</script>

<style>
.pointer {
  cursor: pointer;
}
</style>
