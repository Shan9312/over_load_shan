/**
 * Created by caoshi on 2018/5/30.
 */
import loginApi from './login-factory'; // 登录模块
import crmApi from './crm-factory'; // crm模块
import companyApi from './customer-factory'; // 客户模块
import projectApi from './project-factory'; // 项目模块
import financialApi from './financial-factory'; // 合同模块
import manageApi from './manage-factory'; // 用户模块
import roleApi from './role-factory'; // 角色权限模块
import zoneApi from './zone-factory'; // 地区模块
import uploadApi from './upload-factory'; // 文件模块
import personnelApi from './personnel-factory'; // 人员模块
import dictionaryApi from './dictionary-factory'; // 字典模块
import spaceApi from './space-factory'; // 空间模块
import assetsApi from './assets-factory'; // 资产模块
import businessSpaceApi from './business-space-factory'; // 业务空间
import ppmApi from './ppm-factory'; // PPm 模块
import operationApi from './operation-factory'; // 运维模块
import virtualBeaconApi from './virtual-beacon-factory'; // 蓝牙模块
import bulletinApi from './bulletin-factory'; // 公告栏
import clientApi from './client-factory'; // 客户 tracker模块
import taskApi from './task-factory'; // 任务模块
import exportApi from './data-export-factory'; // 任务模块
import statisticsApi from './statistics';

export default (Vue) => {
  Vue.prototype.api =
    {
      loginApi,
      crmApi,
      companyApi,
      projectApi,
      financialApi,
      manageApi,
      roleApi,
      zoneApi,
      uploadApi,
      personnelApi,
      dictionaryApi,
      spaceApi,
      businessSpaceApi,
      assetsApi,
      ppmApi,
      operationApi,
      virtualBeaconApi,
      bulletinApi,
      clientApi,
      taskApi,
      exportApi,
      statisticsApi,
    };
};
