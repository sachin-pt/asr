import axios from 'axios'

export default async () => {
  if(process.env.NODE_ENV === 'production') {
    return
  }
  await axios.get('http://localhost:5006/api/menu?event=NewCall&cid=917417246514&called_number=918025149755&sid=9579792868151050&circle=UTTAR+PRADESH+(W)+and+UTTARAKHAND&operator=TataDOCOMO&cid_type=FIXED_LINE_OR_MOBILE&cid_e164=%2B917417246514&request_time=2018-02-22+13%3A36%3A49&cid_country=91');
  await axios.get('http://localhost:5006/api/menu?event=GotDTMF&sid=12345&data=1&cid=917417246514&called_number=918025149755&request_time=2018-02-22+13%3A37%3A05');
  await axios.get('http://localhost:5006/api/menu?event=Recognize&sid=12345&data=&confidence=&type=ggl&url=http%3A%2F%2Frecordings.kookoo.in%2Fakshayverma7%2F9579792868151050_1.wav&lang=&gender=none&cid=917417246514&called_number=918025149755&request_time=2018-02-22+13%3A37%3A15');
}