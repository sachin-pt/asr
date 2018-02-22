import speech from '@google-cloud/speech'
import cfg from '../config'
import path from 'path'
import downloader from './downloadFile'
import changeFormat from './changeFormats'
import download from 'download'
import fs from 'fs'

let client = null
export default (fileName) => {
  // Creates a client - singleton
  !client && (client = new speech.SpeechClient({
    projectId: cfg.gAsrProject,
    keyFilename: path.resolve(__dirname + '/keyFile.json')
  }))
  const fileNameTrimmed = fileName.substr(fileName.lastIndexOf('/') + 1)
  const options = {
    directory: './src/data',
    filename: 'temp-' + fileNameTrimmed
  }
  return download(fileName, './src/data').then(() => {
    return changeFormat(__dirname + '/../data/' + fileNameTrimmed, __dirname + '/../data/' + fileNameTrimmed.substr(0, fileNameTrimmed.indexOf('.')) + '-converted' + '.wav').then(() => {
      const data = fs.readFileSync(__dirname + '/../data/' + fileNameTrimmed.substr(0, fileNameTrimmed.indexOf('.')) + '-converted' + '.wav')
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
                  const [{results: [{alternatives = []}] = [{}]} = {}] = dta || [{}]
                  let res = alternatives.filter(({confidence}) => confidence >= 0.8).slice(0, 2)
                  res = (res.length ? res : [alternatives[0]] || [])
                  const data = res.map(({transcript}) => transcript)
                  return {data}
                })
    })
  })

  // Reads a local audio file and converts it to base64
}
