import fs from 'fs'
import speech from '@google-cloud/speech'
import cfg from '../config'
import path from 'path'
let client = null
export default (fileName) => {
  // Creates a client - singleton
  !client && (client = new speech.SpeechClient({
    projectId: cfg.gAsrProject,
    keyFilename: path.resolve(__dirname+'/keyFile.json')
  }))

  // Reads a local audio file and converts it to base64
  const file = fs.readFileSync(fileName)
  const audioBytes = file.toString('base64')

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: audioBytes,
  }
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
  }
  const request = {
    audio: audio,
    config: config,
  }

  // Detects speech in the audio file
  client
    .recognize(request)
    .then(data => {
      const response = data[0]
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n')
      console.log(`Transcription: ${transcription}`, data, request)
    })
    .catch(err => {
      console.error('ERROR:', err)
    })
}