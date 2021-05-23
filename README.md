# eslint-import-resolver-directory-named

[`eslint-plugin-import`](https://www.npmjs.com/package/eslint-plugin-import) eslint-plugin-import resolution plugin for files named as their containers.

This package you can find there [`eslint-import-resolver-directory-named`](https://www.npmjs.com/package/eslint-import-resolver-directory-named)

This package resolve import like this:
```
	import Button from "@/components/Button"
	import Button from "@/components/Button/Button"
	import Button from "@/components/Button/Button.vue"
	import Button from "./src/components/Button"

	// Where Button component is under path: "./src/components/Button/Button.vue
```

To install this package type: 

```
	npm i eslint-import-resolver-directory-named
```

Config for this package include:
```js
{
	aliases: Object,
	extensions: Array
}
```

Example config for file .eslintrc.js

```js
"settings": {
	"import/resolver": {
		"directory-named": {
			// Default empty object
			aliases: {
				"@atoms": "./src/components/atoms",
				"@molecules": "./src/components/molecules",
				"@organisms": "./src/components/organisms",
				"@": "./src"
			},
			// Default [".js"]
			extensions: [".vue", ".js", ".yaml", ".json"]
		},
	},
}
```
