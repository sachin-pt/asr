import axios from 'axios'

export default () => {
  return;
  if(process.env.NODE_ENV === 'production') {
    return
  }
  axios.get('http://localhost:5006/api/menu?event=GotDTMF&cid=9811785389&&sid=123&data=1');
  axios.get('http://localhost:5006/api/menu?event=Recognize&cid=9811785389&&sid=123&url=http://localhost:5006/download/test.wav');
}