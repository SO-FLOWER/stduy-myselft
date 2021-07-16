/**
 * 返回地址的参数
 * @param {string} url  网页地址
 */
export function parseURL(url = window.location.search) {
  if (!url) return {};
  url = decodeURI(url);
  const params = {};
  const regex = /[\?&]([^=]+)=([\w\-\.=]*)/g;
  let results;
  while ((results = regex.exec(url)) != null) {
    params[results[1]] = results[2];
  }
  return params;
}
