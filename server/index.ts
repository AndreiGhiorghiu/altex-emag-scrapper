import http from './http';

import './api';

http.listen(3000, function (err, address) {
	if (err) {
		http.log.error(err);
		process.exit(1);
	}
	http.log.info(`server listening on ${address}`);
});
