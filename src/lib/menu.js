import Calls from './calls'

export default ({url, event, data, cid: customerNo, called_number: ivrNo, sid, circle, operator}) => {
  let content = {}
  switch (event) {
    case 'NewCall':
      // Calls.addAction(sid, customerNo, {event, value: data })
      content = {
        response: [{
          _attr: {
            sid
          }
        },
          {
            collectdtmf: [{
              _attr: {
                l: '4',
                t: '#',
                o: '5000'
              }
            }, {
              playtext: "Welcome to Makaan. INDIA's number 1 real estate marketplace. Press 1 for Buy , Press 2 for rent"
            }]
          }]
      }

      // content = `<?xml version="1.0" encoding="UTF-8"?>
      // <response sid="12345">
      // <collectdtmf l="4" t="#" o="5000">
      // <playtext>Welcome to Makaan , Press 1, for Buy , Press 2, for rent  </playtext>
      // </collectdtmf>
      // </response>`
      break
    case 'GotDTMF':
      Calls.addAction(sid, customerNo, {event: 'service-select', value: data === 1 ? 'buy' : 'rent' })

      content = {
        response: [{_attr: {sid}}, {
          playtext: 'Speak your location of interest followed by hash'
        }, {
        //   record: [{_attr: {format: 'wav', silence: '3', maxduration: '30'}}, 'myfilename']
                recognize: [{ _attr: { type: 'ggl', timeout: '10', silence: '3', lang:'en-IN'}}]
        }]
      }

    //   <response> 
    //    <playtext speed="2" quality="normal" >Please record your feedback </playtext>    
    //    <recognize type="ggl" timeout="10" silence="3" lang="en-IN" />
    //   </response>
      // `<?xml version="1.0" encoding="UTF-8"?>
      // <response sid="12345">
      // <playtext>enter your location</playtext>
      // <record format="wav" silence="3" maxduration="30" >myfilename</record>
      // </response> `

      break
    case 'Recognize':
          Calls.addRecording(sid, customerNo, url)
          content = {
            response: [{_attr: {sid}}, {
              playtext: 'We are sending you top agents via SMS .Happy property searching'
            }]
          }
    break

    default:
      // Calls.addAction(sid, customerNo, {event, value: data })
      break
  }
  return Promise.resolve({text: content})
}