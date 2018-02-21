import Calls from './calls'

export default ({event, data, cid: customerNo, called_number: ivrNo, sid, circle, operator}) => {
  let content = {}
  switch (event) {
    case 'NewCall':
      Calls.addAction(sid, customerNo, {event, value: data })
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
              playtext: 'Welcome to Makaan , Press 1, for Buy , Press 2, for rent'
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
      Calls.addAction(sid, customerNo, {event: 'service-select', value: data === 1 ? 'Buy' : 'rent' })

      content = {
        response: [{_attr: {sid}}, {
          playtext: 'Please speak the location you want to search'
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
    case 'Record':
      Calls.addRecording(sid, customerNo, data)
      break
    case 'Recognize':
        console.log(data);
    break

    default:
      Calls.addAction(sid, customerNo, {event, value: data })
      break
  }
  return Promise.resolve({text: content})
}