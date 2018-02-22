import axios from "axios";

export default (res, phone)=> {
    let agentData = res.data.agents.map(({ name, contact, rating }) => `${name}(${rating} Star): ${contact}`).join('\n')   
    const data = { phone: phone.toString().slice(-10), smsString: `Top agents for ${res.data.areas[0].displayText}.\n ${agentData} \n On Makaan.com you will find top agents rated by real customers.`}  
    axios({
    url: 'http://10.10.1.153:5006/apis/nc/smsService',
    method: "POST",
    data
    }).catch(err => { 
        console.log("sms error") 
        throw err
    })
}