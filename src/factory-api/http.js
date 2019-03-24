/**
 * Created by caoshi on 2018/5/16.
 */
import axios from 'axios';
import VueCookie from 'vue-cookie';
import { Message, Loading } from 'element-ui';
import appConfig from '../appConfig';
import router from '../router';

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = '/api';
} else {
  axios.defaults.baseURL = appConfig.API.BASE_URL;
}
let loading;
const Axios = axios.create({
  timeout: 10000, // 接口超时的时间
  responseType: 'json',
  withCredentials: false, // 表示跨域请求时是否需要使用凭证
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});
// 添加接口请求拦截器 传参序列化
Axios.interceptors.request.use(
  (config) => {
    config.headers = {
      token: VueCookie.get('token'),
    };
    // 序列化
    if (config.url !== '/user/manage/loginName/repeat/check' && config.url !== '/task/get/week') {
      loading = Loading.service({
        lock: true,
        text: '玩命加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0)',
      });
    }
    return config;
  },
  (error) => {
    Message({
      message: error,
    });
    return Promise.reject(error.data.error.message);
  },
);

// 添加响应拦截器

Axios.interceptors.response.use(
  (res) => {
    // 如果接口有返回数据且 返回报错信息
    setTimeout(() => {
      loading.close();
    }, 500);
    // 若后端返回 的类型是 文件流 则直接返回 res;
    const type = res.headers['content-type'];
    if (type === 'application/octet-stream;charset=UTF-8') {
      return res.data;
    }
    if (res.headers['content-type'] === 'application/vnd.ms-excel;charset=utf-8') {
      let dis = res.headers['content-disposition'];
      dis = (dis.split(';')[1].split('=')[1]);
      dis = decodeURI(dis.replace(/["]/g, ''));
      const blob = new Blob([res.data]);
      return { blobs: blob, name: dis };
    }
    //
    const code = Number(res.data.code);
    if (code === 10000) {
      return res.data.data;
    } else if (code === 20300) {
      Message.error('登录token无效,请重新登录');
      router.push({
        path: '/login',
        query: { redirect: router.currentRoute.fullPath }, // 从那个页面跳转
      });
      return false;
    }
    Message.error(res.data.msg);
    return false;
  },
);
export default Axios;
