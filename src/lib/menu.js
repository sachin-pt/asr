import cfg from '../config'
import path from 'path'

export default (req) => {
    
    let {event,data,cid,called_number,sid,circle,operator} = req.query;
    let content=''
    
    switch (event) {
        case 'NewCall':
            content = `<?xml version="1.0" encoding="UTF-8"?>     
            <response sid="12345">     
            <collectdtmf l="4" t="#" o="5000">     
            <playtext>Welcome to Makaan , Press 1, for Buy , Press 2, for rent  </playtext>
            </collectdtmf>     
            </response>`
            break;
        case 'GotDTMF': console.log(data);
            break;
        case 'Record': console.log(data);
            break;
    
        default:
            break;
    }
    return Promise.resolve({text:content})
}