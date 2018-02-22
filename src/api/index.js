import { Router } from 'express';
import menu from '../lib/menu'
import xml from 'xml'

export default () => {
	let api = Router();
	// perhaps expose some API metadata at the root
	api.use('/menu', (req, res) => {
		menu(req.query).then(({ text }) => {
			if (!text) {
				throw new Error("Some error")
			}
			console.log(text, "**")
			// res.set('Content-Type', 'text/xml');
			// res.send(xml(text));

			res.send(text);
		}).catch(err => {console.error(err);
			res.send(`<?xml version="1.0" encoding="UTF-8"?>
		<response sid="12345">
		<playtext>We appreciate your patience. Some error occured, please try again</playtext>
		</response>`)
	});
	});

	return api;
}
