import speech from '@google-cloud/speech'
import cfg from '../config'
import path from 'path'
import downloader from './downloadFile'

let client = null
export default (fileName) => {
  // Creates a client - singleton
  !client && (client = new speech.SpeechClient({
    projectId: cfg.gAsrProject,
    keyFilename: path.resolve(__dirname + '/keyFile.json')
  }))

  // Reads a local audio file and converts it to base64
  return downloader(fileName).then(({data}) => {
    const audioBytes = data.toString('base64')
    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
      content: audioBytes,
    }
    const config = {
      languageCode: 'en-IN',
      maxAlternatives: 5
    }
    const request = {
      audio: audio,
      config: config,
    }

    // Detects speech in the audio file
    return client
      .recognize(request)
      .then(dta => {
        const [{results: [{alternatives = []}] = [{}]} = {}] = dta || [{}]
        let res = alternatives.filter(({confidence}) => confidence >= 0.8).slice(0, 2)
        res = (res.length ? res : [alternatives[0]] || [])
        const data = res.map(({transcript}) => transcript)
        console.log("speech data", data);
        
        return {data}
      })
  })
}