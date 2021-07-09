import http from './http';
import getEmagProducts from './services/emag';
import getAltexProducts from './services/altex';
import path from 'path';

http.route<{ Querystring: { search: string } }>({
	method: 'GET',
	url: '/api/get-products',
	schema: {
		querystring: {
			type: 'object',
			properties: {
				search: { type: 'string' },
			},
			required: ['search'],
		},
	},
	async handler({ query }, res) {
		const { search } = query;

		const data = await Promise.all([getEmagProducts(search), getAltexProducts(search)]);

		res.send({ ...data[0], ...data[1] });
	},
});

http.get('/', (req, reply) => {
	return reply.sendFile('index.html', path.join(__dirname, ''));
});
