
const filter = (num) => {
  if (!num) {
    return '0.00';
  }
  const source = parseFloat(num).toFixed(2).toString().split('.'); // 按小数点分成2部分
  source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), '$1,'); // 只将整数部分进行都好分割
  return source.join('.'); // 再将小数部分合并进来
};
export default filter;
