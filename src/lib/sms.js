import axios from "axios";

export default (res, phone)=> {
    let agentData = res.data.agents.map(({ name, contact, rating }) => `${name}(${rating} Star): ${contact}`).join('\n')   
    let agent = `for ${res.data.areas[0].displayText}.\n ${agentData}`
    const data = { phone: phone.toString().slice(-10), smsString: `Top agents \n On Makaan.com you will find top agents rated by real customers.`}
    axios({
        url: 'http://localhost:5010/apis/nc/smsService',
    method: "POST",
    data
    }).catch(err => { 
        console.log("sms error") 
        throw err
    })
}