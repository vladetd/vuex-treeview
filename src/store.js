import Vue from 'vue'
import Vuex from 'vuex'
import data from '../data.json'
import _ from 'lodash'

Vue.use(Vuex)

const treevuewModule = {
  state: {
    industries: data.initialData,
    allData: data,
    industryModel: []
  },
  mutations: {
    setIndustryModel (state, industries) {
      let models = _.concat(state.industryModel, industries).filter(item => {
        return item.checked === true
      })
      state.industryModel = models
      state.industryModel = _.uniqBy(state.industryModel, 'sic')
    },

    deleteSubIndustriesFromIndustry (state, industry) {
      Vue.delete(industry, 'subArray')
    },

    setSubIndustriesToIndustry (state, {industry, subArray}) {
      let flattenIndustries = _.flatMapDeep(state.industries, function (industry) {
        if (industry.subArray) {
          return [industry, industry.subArray]
        } else {
          return [industry]
        }
      })

      let mainIndustry = _.find(flattenIndustries, { sic: industry.sic })

      subArray.forEach(item => {
        item.checked = false
        item.parent = industry.sic
      })
      Vue.set(mainIndustry, 'subArray', subArray)
    }
  },
  actions: {
    removeSubtreeForIndustry ({commit, state}, industry) {
      commit('deleteSubIndustriesFromIndustry', industry)
    },
    getSubtreeForIndustry ({commit, state}, industry) {
      let subArray = state.allData['sic-' + industry.sic]

      if (subArray !== undefined) {
        commit('setSubIndustriesToIndustry', {
          industry: industry, subArray: subArray
        })
      }
    },

    checkIndustryChildren ({commit, state}, industry) {
      // if the checked industry is a parent
      if (industry.subArray && industry.subArray.length > 0) {
        let flattenIndustries = _.flatMapDeep(industry.subArray, function (industry) {
          if (industry.subArray) {
            return [industry, industry.subArray]
          } else {
            return [industry]
          }
        })

        flattenIndustries.forEach(function (item) {
          item.checked = industry.checked
        })
        commit('setIndustryModel', flattenIndustries)
      }
    },

    checkIndustryParent ({commit, state, dispatch}, industry) {
      let newCheckedState = null
      let flattenMainIndustryTree = _.flatMapDeep(state.industries, function (industry) {
        if (industry.subArray) {
          return [industry, industry.subArray]
        } else {
          return [industry]
        }
      })

      if (industry.parent !== undefined) {
        let parentIndustrySic = industry.parent
        let parentIndustry = _.find(flattenMainIndustryTree, { sic: parentIndustrySic })

        let filtered = _.filter(parentIndustry.subArray, function (industry) {
          return industry.checked === false
        })

        newCheckedState = (filtered.length === 0)
        parentIndustry.checked = newCheckedState
        if (newCheckedState) {
          commit('setIndustryModel', parentIndustry)
          dispatch('checkIndustryParent', parentIndustry)
        }
      }
    },

    checkIndustry ({commit, dispatch}, industry) {
      industry.checked = !industry.checked

      // Add industry to model
      commit('setIndustryModel', industry)
      dispatch('checkIndustryChildren', industry)
      dispatch('checkIndustryParent', industry)
    }
  },
  getters: {
    getMainIndustryTree (state) {
      return state.industries
    },

    getSubtreeForIndustry: (state) => (id) => {
      let subArray = state.allData['sic-' + id]
      if (subArray !== undefined) return subArray
      return []
    },

    getIndustryModel (state) {
      return _.sortBy(state.industryModel, ['sic'])
    }
  }
}

export default new Vuex.Store({
  modules: {
    treevuewModule
  }
})
