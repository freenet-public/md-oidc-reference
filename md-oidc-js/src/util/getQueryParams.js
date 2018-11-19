import _ from 'lodash';

function getQueryParams(url) {
  if (!url) url = window.location.href;
  if (_.includes(url, '?')) {
    let search = url.substring(url.indexOf('?') + 1);

    return JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function (key, value) {
      return (key === '') ? value : decodeURIComponent(value);
    });
  }
  return {};
}

export default getQueryParams;
