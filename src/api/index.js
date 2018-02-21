import { version } from '../../package.json';
import { Router } from 'express';
import path from 'path'
import asr from '../lib/asr'
const data = path.resolve(__dirname+'/../data')
export default () => {
	let api = Router();
	// perhaps expose some API metadata at the root
	api.use('/asr', (req, res) => {
		asr(path.resolve(data+'/test.mp3'));
		res.json({ version });
	});

	return api;
}
