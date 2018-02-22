import { Router } from 'express';
import menu from '../lib/menu'
import xml from 'xml'

export default () => {
	let api = Router();
	// perhaps expose some API metadata at the root
	api.use('/menu', (req, res) => {
		menu(req.query).then(({ text }) => {
			res.set('Content-Type', 'text/xml');
			res.send(xml(text));
		});
	});

	return api;
}
