<template>
  <div id="app">
    <HelloWorld/>

    <TreeView
      :industries="computedIndustries"
      :id="id">
    </TreeView>

    <ul>
      <li v-for="industry in computedIndustryModel" :key="industry[id]">
        [{{ industry.sic }}] {{ industry.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import TreeView from './components/IndustryTreeView.vue'
import store from './store.js'

export default {
  name: 'app',
  store,
  components: {
    HelloWorld,
    TreeView
  },

  data () {
    return {
      id: 'sic'
    }
  },

  computed: {
    computedIndustryModel () {
      return store.getters.getIndustryModel
    },

    computedIndustries () {
      return store.getters.getMainIndustryTree
    }
  }
}
</script>
