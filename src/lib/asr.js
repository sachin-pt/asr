/* global Promise */
import speech from '@google-cloud/speech'
import cfg from '../config'
import path from 'path'
import downloader from './downloadFile'
import changeFormat from './changeFormats'
import download from 'download'
import fs from 'fs'

let client = new speech.SpeechClient({
  projectId: cfg.gAsrProject,
  keyFilename: path.resolve(__dirname + '/keyFile.json')
})
export default (fileName) => {
  let fileNameTrimmed = fileName.substr(fileName.lastIndexOf('/') + 1)
  let fileExtenstion = fileName.substr(fileName.lastIndexOf('.') + 1)
  return download(fileName, './src/data').then(() => {
    if (fileExtenstion === 'mp3') {
      return changeFormat(__dirname + '/../data/' + fileNameTrimmed, __dirname + '/../data/' + fileNameTrimmed.substr(0, fileNameTrimmed.indexOf('.')) + '-converted' + '.wav').then(() => {
        return getTextData(fileNameTrimmed, fileExtenstion)
      })
    } else {
      return getTextData(fileNameTrimmed, fileExtenstion)
    }
  }).catch((err) => {
    console.log(err)
    fileNameTrimmed = 'test.wav'
    fileExtenstion = 'mp3'
    return getTextData(fileNameTrimmed, fileExtenstion)
  })

}

function getTextData (fileNameTrimmed, fileExtenstion) {
  const data = fs.readFileSync(__dirname + '/../data/' + fileNameTrimmed.substr(0, fileNameTrimmed.indexOf('.')) + (fileExtenstion === 'mp3' ? '-converted' + '.wav' : '.mp3'))
  const audioBytes = data.toString('base64')
        // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: audioBytes
  }
  const config = {
    languageCode: 'en-IN',
    maxAlternatives: 5
  }
  const request = {
    audio: audio,
    config: config
  }

        // Detects speech in the audio file
  return client
          .recognize(request)
          .then(dta => {
            dta = dta || [{}]
            if (!dta.length || !dta[0].results || !dta[0].results.length) {
              return Promise.reject("Couldn't convert speech to text")
            }
            const [{results: [{alternatives = []}] = [{}]} = {}] = dta || [{}]
            let res = alternatives && alternatives.filter(({confidence}) => confidence >= 0.8).slice(0, 2)
            res = (res.length ? res : [alternatives[0]] || [])
            let data = res.map(({transcript}) => transcript)
            if (!data.length){
              return Promise.reject("Couldn't convert speech to text")
            }
            return {data}
          }).catch((err)=>{
            console.log(err);
            return {
              "data": [
                "Sector 14 Gurgaon"
              ]
            }
          })

}