// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import 'babel-polyfill'; // 兼容360 兼容模式空白
import { Button, Select, Input, Table, TableColumn, MessageBox, Icon,
  Pagination, Menu, MenuItem, Submenu, scrollbar, Upload, DatePicker, TimePicker,
  Option, BreadcrumbItem, Breadcrumb, Form, FormItem, Col, Row, Dialog,
  Checkbox, CheckboxGroup, Message, Tabs, TabPane, Radio, Rate, RadioButton, RadioGroup, Cascader,
  Switch, Collapse, CollapseItem, Popover, Tree, MenuItemGroup, Dropdown, DropdownItem, DropdownMenu, Tooltip, Tag, Card, Progress } from 'element-ui'; // 按需引入ele UI 组件
import echarts from 'echarts';

import VueAwesomeSwiper from 'vue-awesome-swiper'; // vue swiper
import VueDirectiveImagePreviewer from 'vue-directive-image-previewer';

import Day from 'dayjs'; // 日期格式化插件
import VueCookie from 'vue-cookie'; // cookie 插件
import uuid from 'uuid/v4'; // 生成UUID

// 这里是自定义的公共组件进引入
import 'swiper/dist/css/swiper.css'; // swiper css 样式
import 'vue-directive-image-previewer/dist/assets/style.css';

import panelContentHeader from './components/common/panel-content-header'; // 面包屑组件
import { infoItemUi, childTagUi, clientTagUi, gradeUi, itemTagUi, relationTagUi, taskBtnUi,
  statisticsUi, yetaiUi } from './components/ui/component-ui'; // ui组件
import axios from './factory-api/http'; // 请求配置
import App from './App';
import router from './router';
import './assets/css/reset.css';
import './assets/css/common.less'; // 公共样式
import $api from './factory-api/index'; // api接口
import store from './store';
import directive from './unit/directives'; // 引入指令配置文件
import Filter from './unit/filter/filterNum'; // 引入公用的数据过滤方法

Vue.use(VueDirectiveImagePreviewer); // 图片点击放大

// reset css 重置默认样式
Vue.config.productionTip = false;
// 使用自定义的公共组件
Vue.use(yetaiUi);
Vue.use(panelContentHeader);
Vue.use(infoItemUi);
Vue.use(childTagUi);
Vue.use(clientTagUi);
Vue.use(gradeUi);
Vue.use(infoItemUi);
Vue.use(itemTagUi);
Vue.use(relationTagUi);
Vue.use(taskBtnUi);
Vue.use(statisticsUi);
Vue.use($api);
Vue.use(directive);
Vue.use(VueCookie);
Vue.use(VueAwesomeSwiper);

Vue.prototype.$eventBus = store.state.leftNav;
Vue.prototype.$day = Day;
Vue.prototype.$echarts = echarts;
Vue.prototype.$message = Message; // 消息提示组件
Vue.prototype.$msgbox = MessageBox; // 消息提示框
Vue.prototype.$confirm = MessageBox.confirm; // 确认弹窗
Vue.filter('filterNum', Filter);
// ele 的公共组件
Vue.component(Icon.name, Icon); // 按钮组件
Vue.component(Radio.name, Radio); // 按钮组件
Vue.component(Rate.name, Rate); // 评分
Vue.component(Card.name, Card); // 卡片组件
Vue.component(Button.name, Button); // 按钮组件
Vue.component(Select.name, Select); // 下拉组件
Vue.component(Input.name, Input); // 输入框组件
Vue.component(Table.name, Table); // 表格组件
Vue.component(TableColumn.name, TableColumn); // 表格组件
Vue.component(Pagination.name, Pagination); // 分页组件
Vue.component(Menu.name, Menu);// 菜单
Vue.component(MenuItem.name, MenuItem); // 菜单
Vue.component(BreadcrumbItem.name, BreadcrumbItem); // 面包屑组件
Vue.component(Breadcrumb.name, Breadcrumb); // 面包屑组件
Vue.component(Submenu.name, Submenu); // 菜单组件
Vue.component(scrollbar.name, scrollbar); // 滚动条组件
Vue.component(Option.name, Option); // 下拉条目组件
Vue.component(Form.name, Form); // 表单组件
Vue.component(FormItem.name, FormItem); // 表单组件
Vue.component(Row.name, Row); // 布局组件
Vue.component(Col.name, Col); // 布局组件
Vue.component(Upload.name, Upload); // 上传组件
Vue.component(DatePicker.name, DatePicker); // 时间选择组件
Vue.component(Dialog.name, Dialog); // 弹出框
Vue.component(Checkbox.name, Checkbox); // CheckBox
Vue.component(CheckboxGroup.name, CheckboxGroup); // CheckboxGroup
Vue.component(Tabs.name, Tabs); //  标签页
Vue.component(TabPane.name, TabPane); //  标签页
Vue.component(Cascader.name, Cascader); // 级联选择器
Vue.component(Switch.name, Switch); // 滑块
Vue.component(RadioButton.name, RadioButton); // 单选按钮
Vue.component(RadioGroup.name, RadioGroup); // 按钮组
Vue.component(Collapse.name, Collapse); // 折叠面板
Vue.component(CollapseItem.name, CollapseItem); // 折叠面板
Vue.component(Popover.name, Popover); // 文字提示
Vue.component(Tree.name, Tree); // 树形控件 NavMenu
Vue.component(MenuItemGroup.name, MenuItemGroup); // 文字提示
Vue.component(Dropdown.name, Dropdown); // 下拉菜单
Vue.component(DropdownItem.name, DropdownItem); // 下拉菜单
Vue.component(DropdownMenu.name, DropdownMenu); // 下拉菜单
Vue.component(Tooltip.name, Tooltip); // 下拉菜单
Vue.component(Tag.name, Tag); // 下拉菜单
Vue.component(TimePicker.name, TimePicker); // 时间选择器
Vue.component(Progress.name, Progress); // 进度条
Vue.prototype.$http = axios;
Vue.prototype.$uuid = uuid; // 生成UUID
// 设置页面title
Vue.prototype.$setTitle = (name) => {
  if (name) {
    document.title = `${document.title}-${name}`;
  }
};
// 删除标签页
Vue.prototype.$deleteTag = () => {
  store.state.deleteTagNum += 1;
};
/**
 * 取消
 * 返回上一页
 * */
Vue.prototype.$cancel = () => {
  Vue.prototype.$deleteTag();
  router.go(-1);
};

// eslint 规定 new 新的对象一定要有引用，设置跳过eslint 代码检测
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});

