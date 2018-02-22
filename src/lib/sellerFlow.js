/* global Promise */
import Calls from './calls'
import axios from 'axios/index'
import sendSMS from './sms'

let dataSet = {}
export default ({url, event, data, cid: customerNo, sid}) => {
  let content = ''
  switch (event) {
    case 'NewCall':
      // Calls.addAction(sid, customerNo, {event, value: data })
      dataSet = {phone: customerNo}
      content = `<?xml version="1.0" encoding="UTF-8"?>
      <response sid="${sid}">
      <collectdtmf l="4" t="#" o="5000">
      <playtext>Welcome to Makaan. INDIA's number 1 real estate marketplace. Press 1 for Buy , Press 2 for rent</playtext>
      </collectdtmf>
      </response>`
      break
    case 'GotDTMF':
      if (!dataSet.service) {
        const service = data === 1 ? 'buy' : 'rent'
        dataSet.service = service
        content = `<?xml version="1.0" encoding="UTF-8"?>
      <response sid="${sid}">
      <collectdtmf l="4" t="#" o="5000">
      <playtext>Specify Construction status. 1 for Under Construction, 2 for Ready to move in</playtext>
      </collectdtmf>
      </response>`
      } else if (!dataSet.status) {
        dataSet.status = data
          content = `<?xml version="1.0" encoding="UTF-8"?>
      <response sid="${sid}">
      <collectdtmf l="4" t="#" o="5000">
      <playtext>How many bedrooms are there in this property</playtext>
      </collectdtmf>
      </response>`
      }
      else if (!dataSet.bedroom) {
        dataSet.bedroom = data
        content = `<?xml version="1.0" encoding="UTF-8"?>
      <response sid="${sid}">
      <collectdtmf l="4" t="#" o="5000">
      <playtext>Enter area of property in square feet</playtext>
      </collectdtmf>
      </response>`
      } else if (!dataSet.area) {
        dataSet.area = data
        content = `<?xml version="1.0" encoding="UTF-8"?>
      <response sid="${sid}">
      <collectdtmf l="4" t="#" o="5000">
      <playtext>Enter price of property in rupees</playtext>
      </collectdtmf>
      </response>`
      } else if (!dataSet.price) {
        dataSet.price = data
        content = `<?xml version="1.0" encoding="UTF-8"?>
        <response sid="${sid}">
        <playtext>Please tell us the locality of this property followed by hash</playtext>
        <recognize type="ggl" timeout="10" silence="3" lang="en-IN" />
        </response> `
      }

      break
    case 'Recognize':
      return Calls.addAction(sid, customerNo, dataSet).addRecording(sid, customerNo, {url, data}).then(res => {
        dataSet.locality = res.data[0]
        let url = `http://localhost:5010/apis/nc/hack-result?query=${dataSet.locality}&${dataSet.service}`
        return axios.get(url).then(res =>{
          if (res.data.areas.length) {
          const {localityId, longitude, latitude} = res.data.areas[0]
            return {localityId, longitude, latitude }
          }
          return Promise.reject('No locality matched')
        }).catch ((err) => {console.log(err); return {'localityId': '51708', 'latitude': 28.44568825, 'longitude': 77.04057311999998}})
          .then(locality => {
            let url = `'https://beta-seller.makaan-ws.com/xhr/publish?sellerId=5638944`
            return axios({
              url,
              data: {
                'listingLatitude': locality.latitude,
                'listingLongitude': locality.longitude,
                'constructionStatusId': dataSet.status,
                'propertyId': null,
                'currentListingPrice': {'price': dataSet.price},
                'furnishings': [],
                'otherInfo': {
                  'size': dataSet.area,
                  'bedrooms': dataSet.bedroom,
                  'unitType': 'Apartment',
                  'project': locality
                },
                'negotiable': false,
                'listingCategory': 'Resale',
                'sourceId': 107,
                'description': `${dataSet.area} sq. ft. ${data.bedroom} BHK Apartment in ${data.locality} ar Rs. ${dataSet.price}`,
                'specifications': [],
                'sellerListingTimestamp': '5638944-1519285624110'
              },
              headers: {Cookie: 'JSESSIONID=3eb514c3-e935-49bc-bffb-1494fda970a2;'}
            }).then(() => {
              content = `<?xml version="1.0" encoding="UTF-8"?>
              <response sid="${sid}">
              <playtext>Your Listing has been created, you will receive a SMS with link to upload photos</playtext>
              </response>`
              return Promise.resolve({text: content})
            })
          })
      })
    default:
      // Calls.addAction(sid, customerNo, {event, value: data })
      break
  }
  return Promise.resolve({text: content})
}