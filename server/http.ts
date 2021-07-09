import Fastify from 'fastify';
import qs from 'qs';
import path from 'path';
import Fstatic from 'fastify-static';

const fastify = Fastify({
	querystringParser: qs.parse,
	caseSensitive: false,
	ignoreTrailingSlash: true,
	maxParamLength: 64,
	bodyLimit: 1048576,
	connectionTimeout: 48 * 1000,
	keepAliveTimeout: 8 * 1000,
	pluginTimeout: 8 * 1000,
	onProtoPoisoning: 'remove',
	onConstructorPoisoning: 'remove',
});

fastify.register(Fstatic, {
	root: path.join(__dirname, ''),
	prefix: '/',
});

export default fastify;
