import { version } from '../../package.json';
import { Router } from 'express';
import path from 'path'
import asr from '../lib/asr'
import menu from '../lib/menu'
import xml from 'xml'

const data = path.resolve(__dirname+'/../data')
export default () => {
	let api = Router();
	// perhaps expose some API metadata at the root
	api.use('/asr', (req, res) => {
		asr(path.resolve(data +'/recording2018_02_21_13_30_52.wav')).then(({err, text, data}) => {
			err && res.status(500)
			res.json({err, text, data})
		});
	});
	api.use('/menu', (req, res) => {
		menu(req).then(({ text }) => {
			res.set('Content-Type', 'text/xml');
			res.send(xml(text));
		});
	});

	return api;
}
