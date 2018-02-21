import asr from './asr'
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
    asr(recording).then(res => console.log(res)).catch(err => console.log(err)).then(() => console.log(JSON.stringify(calls)))
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
    this.getCallDetails(id, phone).setCallRecord(recording)
    return this
  }
}
const calls = new Calls()
export default calls