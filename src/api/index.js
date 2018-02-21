import { version } from '../../package.json';
import { Router } from 'express';
import menu from '../lib/menu'
import xml from 'xml'

import Calls from '../lib/calls'
export default () => {
	let api = Router();
	// perhaps expose some API metadata at the root
	api.use('/asr', (req, res) => {
    Calls.addAction('123', '987654356', 'New Call').addAction('123', '987654356', 'Disconnected').addRecording('123', '987654356', 'http://localhost:8080/download/test.wav')
    res.sendStatus(200).end()
	});
	api.use('/menu', (req, res) => {
		menu(req).then(({ text }) => {
			res.set('Content-Type', 'text/xml');
			res.send(xml(text));
		});
	});

	return api;
}
