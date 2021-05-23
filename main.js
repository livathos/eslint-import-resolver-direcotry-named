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
		return findModulePath(resolvePath, extensions);
	}

	// Replace modulePath with defined alias
	
	aliasesArray.forEach(([alias, value]) => {
		if (modulePath.startsWith(`${alias}/`)) {
			resolvePath = resolvePath.replace(alias, value)
		} else if (modulePath === alias) {
			resolvePath = value
		}
	})

	if (resolvePath[0] === '.') {
		resolvePath = path.resolve(process.cwd(), resolvePath);
		return findModulePath(resolvePath, extensions);
	}

	return {
		found: false,
		path: null
	}
};


function findModulePath(resolvePath, extArray) {
	const basename = path.basename(resolvePath)
	const lookInPaths = Object.entries({
		default: resolvePath,
		directedName: `${resolvePath}/${basename}`,
		index: `${resolvePath}/index`
	})
	const result = lookInPaths.reduce((targetPath, [pathType, value]) => {
		const missingExtension = findMissingExtension(value, extArray)
		const resultPath = value + missingExtension
		const resultPathExist = fs.existsSync(resultPath)
		const resultPathIsNotDirecotry = resultPathExist && !fs.lstatSync(resultPath).isDirectory()

		if (resultPathExist && resultPathIsNotDirecotry) return resultPath
		return targetPath
	}, false)
	
	return {
		found: result === false ? false : true,
		path: result === false ? null : result
	};
}

function findMissingExtension (resolvePath, extArray) {
	return extArray.find(ext => {
		return fs.existsSync(resolvePath + ext)
	}) || ''
}
