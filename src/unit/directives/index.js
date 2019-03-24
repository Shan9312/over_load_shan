/**
 * Created by caoshi on 2018/6/12.
 */

export default {
  install(Vue) {
    // 布局指令
    // 内容指令
    Vue.directive('content', {
      bind(el) {
        el.classList.add('panel-content');
      },
    });
    Vue.directive('full-content', {
      bind(el) {
        el.style.height = `${document.documentElement.clientHeight - 175}px`;
      },
    });
    Vue.directive('content-inline', {
      bind(el) {
        el.classList.add('panel-content-inline');
      },
    });
    // table 指令
    Vue.directive('table', {
      bind(el) {
        el.classList.add('table-content');
      },
    });
    // 编辑页 指令
    Vue.directive('edit', {
      componentUpdated(el) {
        el.classList.add('edit-content');
      },
    });
    // 页面一级标题
    Vue.directive('contentTitle', {
      bind(el) {
        el.classList.add('content-title');
      },
    });
    // 页面一级标题
    Vue.directive('contentInlineTitle', {
      bind(el) {
        el.classList.add('content-inline-title');
      },
    });
    // padding为0的内容区域
    Vue.directive('listNoPadding', {
      bind(el) {
        el.classList.add('list-no-padding');
      },
    });
    // 小的内容滚动 y 轴
    Vue.directive('scroll-y', {
      bind(el) {
        el.classList.add('scrollbar-default-y');
      },
    });
    // 小的内容滚动 y 轴
    Vue.directive('scroll-x', {
      bind(el) {
        el.classList.add('scrollbar-default-x');
      },
    });
    // 小的内容滚动 y 轴
    Vue.directive('border', {
      bind(el) {
        el.classList.add('border');
      },
    });
  },
};
