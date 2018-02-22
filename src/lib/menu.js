import Calls from './calls'

export default ({url, event, data, cid: customerNo, called_number: ivrNo, sid, circle, operator}) => {
  let content = {}
  switch (event) {
    case 'NewCall':
      // Calls.addAction(sid, customerNo, {event, value: data })

      content = `<?xml version="1.0" encoding="UTF-8"?>
      <response sid="12345">
      <collectdtmf l="4" t="#" o="5000">
      <playtext>Welcome to Makaan. INDIA's number 1 real estate marketplace. Press 1 for Buy , Press 2 for rent</playtext>
      </collectdtmf>
      </response>`
      break
    case 'GotDTMF':
      Calls.addAction(sid, customerNo, {event: 'service-select', value: data === 1 ? 'buy' : 'rent' })
    
        content = `<?xml version="1.0" encoding="UTF-8"?>
        <response sid="12345">
        <playtext>Speak your location of interest followed by hash</playtext>
        <recognize type="ggl" timeout="10" silence="3" lang="en-IN" />
        <playtext>We are processing your data. Please wait. </playtext>        
        </response> `
        // <record format="wav" silence="3" maxduration="30" >myfilename</record>

      break
    case 'Recognize':
          return Calls.addRecording(sid, customerNo, url).then(({name, contact}) => {
              console.log(contact, 'test')
              content = `<?xml version="1.0" encoding="UTF-8"?>
              <response sid="12345">
              <playtext>WE are connecting you with our agent ${name}</playtext>
              <dial record="true" limittime="1000" timeout="30" moh="default" >09811785389</dial>
              </response>`
              return Promise.resolve({ text: content })
          })
    case 'Dial':
        content = `<?xml version="1.0" encoding="UTF-8"?>
        <response sid="12345">
        <playtext>We are also sending you top agents via SMS .Happy property searching</playtext>
        </response> `

    break

    default:
      // Calls.addAction(sid, customerNo, {event, value: data })
      break
  }
  return Promise.resolve({text: content})
}