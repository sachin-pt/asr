import asr from './asr'
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
    asr(recording).then(res => {
      axios.get(`http://10.10.1.153:5006/apis/nc/hack-result?query=${res.data[0]}&${(this.actions || [{value: ''}])[0].value}`).then(res =>{
        let agentData = res.data.agents.map(({ name, contact, rating }) => `${name}(${rating} Star): ${contact}`).join('\n')   
        const data = { phone: this.phone.toString().slice(-10), smsString: `Top agents for ${res.data.areas[0].displayText}.\n ${agentData} \n On Makaan.com you will find top agents rated by real customers.`}  
      console.log(data)
        return axios({
          url: 'http://10.10.1.153:5006/apis/nc/smsService',
          method: "POST",
          data
        })
      }).catch(err => console.log(err))
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
    this.getCallDetails(id, phone).setCallRecord(recording)
    return this
  }
}
const calls = new Calls()
export default calls