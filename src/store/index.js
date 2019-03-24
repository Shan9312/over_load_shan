/**
 * Created by caoshi on 2018/5/30.
 */

import Vue from 'vue';
import vuex from 'vuex';
import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

Vue.use(vuex);

const Vuex = new vuex.Store({
  state,
  mutations,
  actions,
  getters,
});

export default Vuex;
