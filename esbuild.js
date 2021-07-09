#!/usr/bin/env node

const { TsconfigPathsPlugin } = require('@esbuild-plugins/tsconfig-paths');
const { spawn } = require('child_process');
const { join } = require('path');
const esbuild = require('esbuild');

const cwd = process.cwd();
const tsConfigFile = `${cwd}/tsconfig.json`;
const packageJSONFile = `${cwd}/package.json`;

const pkg = require(packageJSONFile);
const tsconfig = require(tsConfigFile);

const inputFile = join(cwd, process.argv[2]);
const outputFile = join(cwd, '.local/server.cjs');

const options = {
	platform: 'node',
	target: `node${process.version.slice(1)}`,
	format: 'cjs',
	bundle: true,
	outfile: outputFile,
	entryPoints: [inputFile],
	sourcemap: 'inline',
	tsconfig: tsConfigFile,
	external: Object.keys(pkg.dependencies).concat(Object.keys(pkg.devDependencies)),
	plugins: [TsconfigPathsPlugin({ tsconfig })],
};

esbuild.build(options).then((bundle) => {
	// ignore production builds
	if (process.argv.includes('--build')) return;

	const args = ['-r', 'source-map-support/register', outputFile];
	const child = spawn(process.argv[0], args, { cwd, stdio: 'pipe' });

	child.stdout.on('data', (data) => process.stdout.write(`${data}`));
	child.stderr.on('data', (data) => process.stderr.write(`${data}`));

	child.on('close', (code) =>
		console.info(`ESBUILD: process exited with code "${code}"`)
	);
});
