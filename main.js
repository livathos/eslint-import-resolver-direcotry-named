'use strict';
const path = require('path');
const fs = require('fs');

exports.interfaceVersion = 2;

const defaultConfig = {
	extensions: ['.js'],
	aliases: {}
}

exports.resolve = (modulePath, sourceFile, config = {}) => {
	const { aliases, extensions } = Object.assign(defaultConfig, config);
	const aliasesArray = Object.entries(aliases)
	const sourceDir = path.dirname(sourceFile);
	let resolvePath = modulePath;

	if (modulePath[0] === '.') {
		resolvePath = path.resolve(sourceDir, modulePath);
		return findModulePath(resolvePath, null, extensions);
	}

	// Replace modulePath with defined alias
	
	aliasesArray.forEach(([alias, value]) => {
		if (modulePath.startsWith(alias)) {
			resolvePath = resolvePath.replace(alias, value)
		}
	})

	if (resolvePath[0] === '.') {
		resolvePath = path.resolve(process.cwd(), resolvePath);
		return findModulePath(resolvePath, null, extensions);
	}

	// TODO: resolve node_modules lookup paths

	return {
		found: false,
		path: null
	}
};


function findModulePath(resolvePath, paths, extArray) {
	const basename = path.basename(resolvePath)
	let missingExtension = findMissingExtension(resolvePath, extArray)
	let resultPath = resolvePath + missingExtension
	let resultPathExist = fs.existsSync(resultPath)
	let resultPathIsNotDirecotry = resultPathExist && !fs.lstatSync(resultPath).isDirectory()

	if (resultPathExist && resultPathIsNotDirecotry) {
		return {
			found: true,
			path: resultPath
		};
	}

	// Look for a path where the file name is exactly the same as the basename

	resultPath = `${resolvePath}/${basename}`
	missingExtension = findMissingExtension(resultPath, extArray)
	resultPath += missingExtension
	resultPathExist = fs.existsSync(resultPath)

	return {
		found: resultPathExist,
		path: resultPathExist ? resultPath : null
	};
}

function findMissingExtension (resolvePath, extArray) {
	return extArray.find(ext => {
		return fs.existsSync(resolvePath + ext)
	}) || ''
}
