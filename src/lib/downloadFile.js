import axios from 'axios'

export default (url) => {
  return axios.get(url, {
    responseType: 'arraybuffer'
  });
}