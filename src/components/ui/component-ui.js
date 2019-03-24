/**
 * Created by caoshi on 2018/12/18.
 */
import itemUi1 from './info-item-ui';
import itemUi2 from './child-tag-ui';
import itemUi3 from './client-tag-ui';
import itemUi4 from './grade-ui';
import itemUi5 from './item-tag-ui';
import itemUi6 from './relation-tag-ui';
import itemUi7 from './task-btn-ui';
import itemUi8 from './statistics-btn-ui';
import itemUi9 from './yetai-ui';

const infoItemUi = {
  install: (Vue) => {
    Vue.component('infoItemUi', itemUi1);
  },
};
const childTagUi = {
  install: (Vue) => {
    Vue.component('childTagUi', itemUi2);
  },
};
const clientTagUi = {
  install: (Vue) => {
    Vue.component('clientTagUi', itemUi3);
  },
};
const gradeUi = {
  install: (Vue) => {
    Vue.component('gradeUi', itemUi4);
  },
};
const itemTagUi = {
  install: (Vue) => {
    Vue.component('itemTagUi', itemUi5);
  },
};
const relationTagUi = {
  install: (Vue) => {
    Vue.component('relationTagUi', itemUi6);
  },
};
const taskBtnUi = {
  install: (Vue) => {
    Vue.component('taskBtnUi', itemUi7);
  },
};
const statisticsUi = {
  install: (Vue) => {
    Vue.component('statisticsUi', itemUi8);
  },
};
const yetaiUi = {
  install: (Vue) => {
    Vue.component('yetaiUi', itemUi9);
  },
};
export { infoItemUi, childTagUi, clientTagUi, gradeUi,
  itemTagUi, relationTagUi, taskBtnUi, statisticsUi, yetaiUi };
