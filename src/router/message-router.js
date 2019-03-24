/**
 * Created by on 2019/02/20.
 */
const messageCenter = () => import('../my-app/message-center/message-center.vue'); // 消息中心总览
const messageList = () => import('../my-app/message-center/message-list.vue'); // 消息列表

const router = {
  path: '/message',
  name: 'message',
  redirect: '/message/message-list/:id',
  meta: {
    breadcrumbName: '消息中心',
    title: '消息中心',
  },
  component: messageCenter,
  children: [
    {
      path: '/message/message-list/:id',
      name: 'messageList',
      meta: {
        breadcrumbName: '消息提醒',
        title: '消息提醒',
      },
      component: messageList,
    },
  ],
};

export default router;
