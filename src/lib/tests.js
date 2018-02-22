import axios from 'axios'

export default () => {
  if (process.env.NODE_ENV === 'production') {
    return
  }
  axios.get('http://localhost:8080/api/menu?event=GotDTMF&cid=9811785389&&sid=123&data=1')
  axios.get('http://localhost:8080/api/menu?event=Recognize&cid=9811785389&&sid=123&url=http://recordings.kookoo.in/akshayverma7/akshayverma7_9579719283333753.mp3')
}
