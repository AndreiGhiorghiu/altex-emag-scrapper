import reactRefresh from '@vitejs/plugin-react-refresh';
import { ConfigEnv, UserConfig } from 'vite';

const cwd = process.cwd();

export default ({ mode }: ConfigEnv): UserConfig => ({
	root: `${cwd}/client`,
	publicDir: `${cwd}/client/static`,
	resolve: {
		alias: {
			$utils: `${cwd}/utils`,
			$schemas: `${cwd}/schemas`,
			$server: `${cwd}/server`,

			$client: `${cwd}/client`,
			$static: `${cwd}/client/static`,

			$application: `${cwd}/client/application`,
			$material: `${cwd}/client/application/material`,
			$hooks: `${cwd}/client/hooks`,
			$controllers: `${cwd}/client/controllers`,
			$components: `${cwd}/client/components`,
			$views: `${cwd}/client/views`,
		},
	},
	define: {
		'process.env.NODE_ENV': JSON.stringify(mode),
		'process.browser': 'true',
	},
	build: {
		outDir: '../.local',
		emptyOutDir: true,
	},
	plugins: [reactRefresh()],
});
