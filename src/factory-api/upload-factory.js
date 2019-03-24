/**
 * Created by caoshi on 2018/5/30.
 */
const uploadApi = () => ({
  download: '/file/download', // 下载文件
  upload: '/file/upload/qiniu', // 上传文件
  uploadFile: '/file/upload/space', // 导入空间
  uploadPoint: '/file/upload/asset/beacon', // 导入蓝牙资产
});

export default uploadApi();
