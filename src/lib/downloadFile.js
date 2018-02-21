var axios = require('axios');
export default (url) => {
  return axios.get(url, {
    responseType: 'arraybuffer'
  });
}