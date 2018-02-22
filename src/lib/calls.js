import asr from './asr'
import sendSMS from './sms'
import axios from "axios";
class Call {
  constructor(id, phone) {
    this.id = id;
    this.phone = phone;
    this.actions = [];
  }
  addAction(action) {
    this.actions.push(action);
  }
  setCallRecord({ url, data }) {
    this.recording = url;
    this.data = data;
    if (data) {
      console.log("data", data)
      return this.doAction(data)
    }
    // call API exposed by Shakib here
    return asr(url).then(res => {
      console.log("recording", url)
      return this.doAction(res.data[0])
    })
  }
  doAction(text) {
    console.log('text', text);
    let type = (this.actions || [{ value: '' }])[0].value
    console.log('type', type);
    let url = `http://10.10.1.153:5006/apis/nc/hack-result?query=${text}&${type}`
    console.log("top seller call", url)
    return axios.get(url).then(res => {
      sendSMS(res, this.phone);
      let topMostAgent = res.data.agents[0]
      console.log("topMostAgent ", topMostAgent.name);
      return topMostAgent
    }).catch(err => console.log("%%%%%", err))

  }
}

class Calls {
  constructor() {
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
  addRecording(id, phone, { url, data }) {
    return this.getCallDetails(id, phone).setCallRecord({ url, data })
  }
}
const calls = new Calls()
export default calls