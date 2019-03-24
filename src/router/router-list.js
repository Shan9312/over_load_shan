/**
 * Created by caoshi on 2018/7/21.
 * 所有模块合集
 */
import CrmRouter from './crm-router';
import CustomerRouter from './customer-router';
import ProjectRouter from './project-router';
import PersonnelControl from './personnel-router';
import SpaceRouter from './space-router';
import AssetsRouter from './assets-router';
import OperationRouter from './operation-router';
import businessConfigRouter from './business-configuration-router';
import ClientModuleRouter from './client-module-router';
import DataExportRouter from './data-export-router';
import statisticsRouter from './statistics-router';
import messageRouter from './message-router';

const routerList = [
  CrmRouter,
  CustomerRouter,
  ProjectRouter,
  PersonnelControl,
  SpaceRouter,
  AssetsRouter,
  OperationRouter,
  businessConfigRouter,
  ClientModuleRouter,
  DataExportRouter,
  statisticsRouter,
  messageRouter,
];

export default routerList;
