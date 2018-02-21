import axios from 'axios'

export default () => {
  axios.get('http://localhost:8080/api/menu?event=NewCall&cid=987654321&&sid=123');
  axios.get('http://localhost:8080/api/menu?event=GotDTMF&cid=987654321&&sid=123&data=1');
  axios.get('http://localhost:8080/api/menu?event=Record&cid=987654321&&sid=123&data=http://localhost:8080/download/test.wav');
}