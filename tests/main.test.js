const path = require('path')
const resolver = require('../main')

const pathToExampleButton = path.resolve('./tests/example/button/button.js')
const pathToExampleInput = path.resolve('./tests/example/Input/Input.vue')
const exampleConfig = {
	aliases: {
		'@alias': './tests/example'
	}
}
const vueConfig = {
	extensions: ['.js', '.vue'],
	aliases: {
		'@alias': './random',
		'@': './tests/example'
	}
}
const tests = [
	{
		description: 'resolves relative directory',
		path: './example/button/button.js'
	},
	{
		description: 'resolves relative directory without extension',
		path: './example/button/button'
	},
	{
		description: 'resolves alias directory',
		path: '@alias/button/button.js',
		config: exampleConfig
	},
	{
		description: 'resolves alias directory without extension',
		path: '@alias/button/button'
	},
	{
		description: 'resolves alias named directory',
		path: '@alias/button',
		config: exampleConfig
	},
	{
		description: 'resolves alias named directory with / on end',
		path: '@alias/button/',
		config: exampleConfig
	},
	{
		description: 'resolves alias named directory with uppercase syntax and .vue extension',
		path: '@/Input',
		config: vueConfig,
		target: pathToExampleInput
	},
]

describe('resolver', function() {
	tests.forEach(test => {
		it(test.description, () => {
			expect(resolver.resolve(test.path, module.filename, test.config)).toEqual({
				found: true,
				path: test.target || pathToExampleButton
			})
		})
	})

	it('resolves directory which not exist', function() {
		expect(resolver.resolve('./example/button/notfound', module.filename)).toEqual({
			found: false,
			path: null
		})

		expect(resolver.resolve('', module.filename)).toEqual({
			found: false,
			path: null
		})

		expect(resolver.resolve('random/string', module.filename)).toEqual({
			found: false,
			path: null
		})
	})

})
