# &lt;d2l-siren-parser&gt;

Web component wrapper for [node-siren-parser](https://github.com/Brightspace/node-siren-parser). Used to parse a Siren object or string into an Entity.

## Usage

Create a new dom element of type `d2l-siren-parser`, then call `parse`, passing in a [siren](https://github.com/kevinswiber/siren) object or string.

```html
<link rel="import" href="../d2l-siren-parser/d2l-siren-parser.html">

...

<script>
	function parseSiren (sirenObj) {
		var parser = document.createElement('d2l-siren-parser');
		var entity = parser.parse(sirenObj);
	}
</script>
```

## Building

Install dependencies

```shell
npm install
```

If updating node-siren-parser, also build. The built output should be committed.

```shell
npm run build
```

## Testing

```
npm test
```

Manual testing can be done with the demo page, accessible via polyserve.

```shell
npm run serve
```

Then access: http://localhost:8081/components/d2l-siren-parser/demo/index.html

# Publishing & Releasing

To publish a numbered "release" version, follow steps below.

### Bump version ###

```BASH
$ # npm help 1 version
$ # npm help 7 semver
$ npm version [major|minor|patch|premajor|preminor|prepatch|prerelease] -m "chore(version) bump %s"
$ git push upstream master
$ git push upstream master --tags
```

## Contributing
Contributions are welcome, please submit a pull request!

> Note: To contribute, please create a branch in this repo instead of a fork. We are using [Sauce Labs](https://saucelabs.com/) in our CI builds which don't work in PRs from forks. Thanks!

### Code Style

This repository is configured with [EditorConfig](http://editorconfig.org) rules and
contributions should make use of them.
