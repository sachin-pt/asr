/* global Promise */
import Calls from './calls'
import axios from 'axios/index'
import sendSMS from './sms'
let dataSet = {}
export default ({url, event, data, cid: customerNo, sid}) => {
  let content = ''
  switch (event) {
    case 'NewCall':
    dataSet = {}
      // Calls.addAction(sid, customerNo, {event, value: data })

      content = `<?xml version="1.0" encoding="UTF-8"?>
      <response sid="${sid}">
      <collectdtmf l="4" t="#" o="5000">
      <playtext>Welcome to Makaan. INDIA's number 1 real estate marketplace. Press 1 for Buy , Press 2 for rent</playtext>
      </collectdtmf>
      </response>`
      break
    case 'GotDTMF':
      dataSet.service = data === 1 ? 'buy' : 'rent'
      content = `<?xml version="1.0" encoding="UTF-8"?>
        <response sid="${sid}">
        <playtext>Speak your location of interest followed by hash</playtext>
        <recognize type="ggl" timeout="10" silence="3" lang="en-IN" />
        </response> `
      // <playtext>We are processing your data. Please wait. </playtext>
      // <record format="wav" silence="3" maxduration="30" >myfilename</record>

      break
    case 'Recognize':
      return Calls.addAction(sid, customerNo, dataSet).addRecording(sid, customerNo, url).then(res => {
        let url = `http://10.10.1.153:5006/apis/nc/hack-result?query=${res.data[0]}&${dataSet.service}`
        return axios.get(url).then(res =>{
        if (!res.data.agents.length) {
          return Promise.reject('No agents found')
        }
          sendSMS(res, customerNo);
          return res.data.agents[0]
        })
      }).then(({name, contact}) => {
        console.log('contact', contact)
        content = `<?xml version="1.0" encoding="UTF-8"?>
              <response sid="${sid}">
              <playtext>WE are connecting you with our agent ${name}</playtext>
              <dial record="true" limittime="1000" timeout="30" moh="default" >${'09811785389' || `0${contact.toString().slice(-10)}`}</dial>
              </response>`
        return Promise.resolve({ text: content })
      })
    case 'Dial':
      content = `<?xml version="1.0" encoding="UTF-8"?>
        <response sid="${sid}">
        <playtext>We are also sending you top agents via SMS .Happy property searching</playtext>
        </response> `

      break

    default:
      // Calls.addAction(sid, customerNo, {event, value: data })
      break
  }
  return Promise.resolve({text: content})
}