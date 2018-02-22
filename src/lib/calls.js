import asr from './asr'
import sendSMS from './sms'
import axios from "axios";
class Call {
  constructor (id, phone) {
    this.id = id;
    this.phone = phone;
    this.actions = [];
  }
  addAction(action) {
    this.actions.push(action);
  }
  setCallRecord(recording) {
    this.recording = recording;
    
    // call API exposed by Shakib here
    return asr(recording).then(res => {
      let url = `http://10.10.1.153:5006/apis/nc/hack-result?query=${res.data[0]}&${(this.actions || [{ value: '' }])[0].value}`
      console.log("recording",recording)
      console.log("top seller call", url)
      return axios.get(url).then(res =>{
        sendSMS(res, this.phone);
        let topMostAgent = res.data.agents[0]
        console.log("topMostAgent ", topMostAgent);
        return topMostAgent
      }).catch(err => console.log("%%%%%",err))
    })
  }
}

class Calls {
  constructor () {
    this.calls = {}
  }
  getCallDetails(id, phone) {
    const userCalls = this.calls[phone] || {};
    const call = userCalls[id] || new Call(id, phone);
    userCalls[id] = call;
    this.calls[phone] = userCalls;
    return call
  }
  addAction(id, phone, action) {
    this.getCallDetails(id, phone).addAction(action)
    return this
  }
  addRecording(id, phone, recording) {
    return this.getCallDetails(id, phone).setCallRecord(recording)
  }
}
const calls = new Calls()
export default calls