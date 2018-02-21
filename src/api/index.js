import { version } from '../../package.json';
import { Router } from 'express';

export default ({ config }) => {
	let api = Router();
	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {

		// Imports the Google Cloud client library
		const speech = require('@google-cloud/speech');
		const fs = require('fs');

		// Your Google Cloud Platform project ID
		const projectId = 'AIzaSyCboWV3jNZYj1kmlXutotkce0fI4BqsJLc';

		// Creates a client
		const client = new speech.SpeechClient({
			projectId: "vision-project-intern",
		});

		// The name of the audio file to transcribe
		const fileName = './5a8d143f5620a1.39956121.mp3';

		// Reads a local audio file and converts it to base64
		const file = fs.readFileSync(fileName);
		const audioBytes = file.toString('base64');

		// The audio file's encoding, sample rate in hertz, and BCP-47 language code
		const audio = {
			content: audioBytes,
		};
		const config = {
			encoding: 'LINEAR16',
			sampleRateHertz: 16000,
			languageCode: 'en-US',
		};
		const request = {
			audio: audio,
			config: config,
		};

		// Detects speech in the audio file
		client
			.recognize(request)
			.then(data => {
					const response = data[0];
					const transcription = response.results
							.map(result => result.alternatives[0].transcript)
							.join('\n');
					console.log(`Transcription: ${transcription}`);
			})
			.catch(err => {
					console.error('ERROR:', err);
			});
			
		res.json({ version });
	});

	return api;
}
