import buyerFlow from './buyerFlow'
import sellerFlow from './sellerFlow'


export default ({url, event, data, cid: customerNo, sid}) => {
  if(customerNo.toString().indexOf('8501984499') >= 0 ||customerNo.toString().indexOf('9811785389') >= 0){
    return sellerFlow({url, event, data, cid: customerNo, sid})
  }
  return buyerFlow({url, event, data, cid: customerNo, sid})
}