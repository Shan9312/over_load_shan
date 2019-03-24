/**
 * Created by caoshi on 2018/7/12.
 * 验证插件
 * 自定义 电话 邮箱 特殊验证
 *
 */
// 验证手机号是否正确
const phone = (rule, value, cb) => {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
  if (rule.required) {
    if (!value) {
      cb(new Error('请输入手机号码'));
    } else if (!reg.test(value)) {
      cb(new Error('请输入正确手机号码'));
    } else {
      cb();
    }
  } else if (value && !reg.test(value)) {
    cb(new Error('请输入正确手机号码'));
  } else {
    cb();
  }
};

// 验证邮箱是否正常
const email = (rule, value, cb) => {
  const reg = new RegExp('^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$');
  if (rule.required) {
    if (!value) {
      cb(new Error('请输入邮箱'));
    } else if (!reg.test(value)) {
      cb(new Error('请输入正确邮箱账号'));
    } else {
      cb();
    }
  } else if (value && !reg.test(value)) {
    cb(new Error('请输入正确邮箱账号'));
  } else {
    cb();
  }
};
// 客户编码 只能是前两位英文后四位数字
const companyCode = (rule, value, cb) => {
  const reg = new RegExp('^[a-zA-Z]{2}[0-9]{3}$');
  if (rule.required) {
    if (!value) {
      cb(new Error('请输入客户编码'));
    } else if (!reg.test(value)) {
      cb(new Error('客户编码前两位字母后三位数字'));
    } else {
      cb();
    }
  } else if (value && !reg.test(value)) {
    cb(new Error('客户编码前两位字母后三位数字'));
  } else {
    cb();
  }
};
// 只能是英文和数字
const englishAndNum = (rule, value, cb) => {
  const reg = new RegExp('^[a-zA-Z0-9]+$');
  if (rule.required) {
    if (!value) {
      cb(new Error('请输入信息'));
    } else if (!reg.test(value)) {
      cb(new Error('只能输入英文和数字'));
    } else {
      cb();
    }
  } else if (value && !reg.test(value)) {
    cb(new Error('只能输入英文和数字'));
  } else {
    cb();
  }
};

//  只能是数字正整数
const positiveInteger = (rule, value, cb) => {
  const reg = new RegExp('^[0-9]*$');
  if (rule.required) {
    if (!value) {
      cb(new Error('请输入信息'));
    } else if (!reg.test(value)) {
      cb(new Error('只能输入正整数'));
    } else {
      cb();
    }
  } else if (value && !reg.test(value)) {
    cb(new Error('只能输入正整数'));
  } else {
    cb();
  }
};
// 数字 可以带小数
const number = (rule, value, cb) => {
  const reg = new RegExp('^[+]?[0-9]*\\.?[0-9]+$');
  if (rule.required) {
    if (!value && Number(value) !== 0) {
      cb(new Error('请输入信息'));
    } else if (!reg.test(value)) {
      cb(new Error('只能输入正数字'));
    } else {
      cb();
    }
  } else if (value && !reg.test(value)) {
    cb(new Error('只能输入正数字'));
  } else {
    cb();
  }
};
// money 金额
const money = (rule, value, cb) => {
  const reg = new RegExp('(^[1-9]([0-9]+)?(\\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\\.[0-9]([0-9])?$)');
  if (rule.required) {
    if (!value && Number(value) !== 0) {
      cb(new Error('请输入金额'));
    } else if (!reg.test(value)) {
      cb(new Error('请输入正确的金额'));
    } else {
      cb();
    }
  } else if (value && !reg.test(value)) {
    cb(new Error('请输入正确的金额'));
  } else {
    cb();
  }
};
// 数字 可以是负数
const negNumber = (rule, value, cb) => {
  const reg = new RegExp('^[+-]?[0-9]+(.[0-9]+)?$');
  if (rule.required) {
    if (!value && Number(value) !== 0) {
      cb(new Error('请输入信息'));
    } else if (!reg.test(value)) {
      cb(new Error('只能输入数字'));
    } else {
      cb();
    }
  } else if (value && !reg.test(value)) {
    cb(new Error('只能输入数字'));
  } else {
    cb();
  }
};

// 验证角色中文名称
const nameCn = (rule, value, cb) => {
  const reg = /^[\u4E00-\u9FFF-a-zA-Z]+?$/;
  if (rule.required) {
    if (!value) {
      cb(new Error('请输入名称'));
    } else if (!reg.test(value)) {
      cb(new Error('请输入正确格式(只能是汉字/英文)'));
    } else {
      cb();
    }
  } else if (value && !reg.test(value)) {
    cb(new Error('请输入正确格式(只能是汉字/英文)'));
  } else {
    cb();
  }
};


// 验证角色英文名称
const nameEn = (rule, value, cb) => {
  const reg = /^[0-9a-zA-Z]+?$/;
  if (rule.required) {
    if (!value) {
      cb(new Error('请输入姓名'));
    } else if (!reg.test(value)) {
      cb(new Error('请输入正确格式(英文和数字)'));
    } else {
      cb();
    }
  } else if (value && !reg.test(value)) {
    cb(new Error('请输入正确格式(英文和数字)'));
  } else {
    cb();
  }
};

//  密码输入验证
const password = (rule, value, cb) => {
  const reg = /^[A-Za-z0-9]{6,11}$/;
  if (rule.required) {
    if (!value) {
      cb(new Error('请输入密码'));
    } else if (!reg.test(value)) {
      cb(new Error('请输入正确格式(6-11位英文或数组)'));
    } else {
      cb();
    }
  } else if (value && !reg.test(value)) {
    cb(new Error('请输入正确格式(6-11位英文或数组)'));
  } else {
    cb();
  }
};


module.exports = {
  phone,
  email,
  companyCode,
  englishAndNum,
  positiveInteger,
  number,
  money,
  nameEn,
  nameCn,
  password,
  negNumber,
};

