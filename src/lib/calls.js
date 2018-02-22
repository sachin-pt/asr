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
    return this
  }
  setCallRecord({ url, data }) {
    this.recording = url;
    this.data = data;
    if (data) {
      console.log("data", data)
      return Promise.resolve({data: [data]})
    }
    // call API exposed by Shakib here
    return asr(url)
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