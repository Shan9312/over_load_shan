/**
 * Created by caoshi on 2018/5/30.
 */

import * as types from '../mutation-type';

const mutations = {
  [types.CURRENT_VIEW_NAME](state, data) {
    state.router.pathName = data;
  },
  [types.CURRENT_VIEW_CATEGORY](state, data) {
    state.router.category = data;
  },
  [types.CURRENT_USER_INFO](state, data) {
    state.user.info = data;
  },
  [types.CHANGE_PROJECT_LIST](state, data) {
    state.projectList = data;
  },
  [types.CHANGE_PROJECT_ID](state, data) {
    state.projectId = data;
  },
  [types.CURRENT_CONTENT_MOVE_Y](state, data) {
    state.event.moveY = data;
  },
  [types.SAVE_IDOBJ_VALUE](state, data) {
    state.event.objId = data;
  },
  [types.CHANGE_INFINITE_ITEM](state, data) {
    state.infiniteItem = data;
  },
  [types.CHANGE_ROUTER_SWITCH_TYPE](state, data) {
    state.routerSwitch = data;
  },
};
export default mutations;
