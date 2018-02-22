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
      <playtext>Welcome to Makaan. INDIA's number 1 real estate platform. Press 1 for Buy , Press 2 for rent</playtext>
      </collectdtmf>
      </response>`
      break
    case 'GotDTMF':
      dataSet.service = data === 1 ? 'buy' : 'rent'
      content = `<?xml version="1.0" encoding="UTF-8"?>
        <response sid="${sid}">
        <playtext>Tell us your location of interest. followed by hash. Like sector 32. gurgaon.</playtext>
        <record format="wav" silence="3" maxduration="30" >${sid}</record>
        </response> `
        // <recognize type="ggl" timeout="10" silence="3" lang="en-IN" />
        // <playtext>We are processing your data. Please wait. </playtext>

      break
    case 'Record':
    case 'Recognize':
      if (data.indexOf('.mp3')>=0){
        url = data
        data = null
      }
      return Calls.addAction(sid, customerNo, dataSet).addRecording(sid, customerNo, {url, data}).then(res => {
        
        let text = res.data[0];
        console.log("text", text)
        let url = `http://localhost:5010/apis/nc/hack-result?query=${text}&${dataSet.service}`
        console.log("top seller call", url)
        
        return axios.get(url).then(res =>{
        if (!res.data.agents.length) {
          return Promise.reject('No agents found')
        }
          sendSMS(res, customerNo);
          return res.data.agents[0]
        })
      }).then(({name, contact}) => {
        console.log('contact', name)
        content = `<?xml version="1.0" encoding="UTF-8"?>
              <response sid="${sid}">
              <playtext>WE are connecting to our agent</playtext>
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