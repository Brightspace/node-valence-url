# node-valence-url

[![Build Status](https://travis-ci.org/Brightspace/node-valence-url.svg?branch=master)](https://travis-ci.org/Brightspace/node-valence-url) [![Coverage Status](https://coveralls.io/repos/github/Brightspace/node-valence-url/badge.svg?branch=master&t=uOWBgp)](https://coveralls.io/github/Brightspace/node-valence-url?branch=master)

Module for dealing with Valence API versions and calculating routes in a semver-esque fashion.

## Usage

`node-valence-url` makes route calculation with Valence APIs easier. Define a `ValenceRoute`, then use the `ValenceUrlResolver` to resolve matching versions with your LMS. `ValenceUrlResolver.resolve()` returns promise-y things.

```js
var valenceUrl = require('node-valence-url');
var ValenceRoute = valenceUrl.ValenceRoute;

var resolver = new ValenceUrlResolver('http://example.com', 'an auth token');

var route = new ValenceRoute.Simple('foo');
yield resolver.resolve(route); // http://example.com/foo

route = new ValenceRoute.Versioned('lp', 'foo', 'bar', '^1.5');
yield resolver.resolve(route); // http://example.com/foo/1.6/bar

route = new ValenceRoute.Versioned('lp', 'foo', 'bar', '^1.9');
yield resolver.resolve(route); // throws if LP does not support versions 1.9 and up on LMS
```

## ValenceUrlResolver API

The `ValenceUrlResolver` class does route calculation based off of knowledge about what an LMS supports and information about the desired route (`ValenceRoute`).

### `ValenceUrlResolver(Object options)`

Constructor. `options` must contain a string `tenantUrl`, which is the base URL of the LMS that this resolver is running against, and either a string `authToken`, or an Array `versions`. If `versions` is present, this will be used to resolve versions (prevents doing call to _/d2l/api/versions/_). If not present, then the `authToken` string is used along with the `tenantUrl` to kick off a request to fetch the LMS' versions information.

Currently, only the `LatestVersion` of each product is used, but we may update in the future to allow for use of `SupportedVersions`, which would grant greater control over versions, and better backward compatibility.

### `ValenceUrlResolver.resolve(ValenceRoute route)`

Resolves a `ValenceRoute` object into a string route that has the highest matching version for the correct product filled in. Returns a `Promise` that resolves to the resolved route.

## ValenceRoute API

`ValenceRoute` is a set of classes that represent a Valence URL route - including the product, prefix, suffix, and optionally a preferred SemVer range.

### `ValenceRoute()`

Base class for other routes.

### `ValenceRoute.Simple(String path)`

Constructor. Simple Valence route (without version), e.g. `/d2l/api/versions/`. Only has the `path` property, which just returns the string given to the constructor.

### `ValenceRoute.Versioned(String product, String prefix, String suffix[, String desiredSemVer])`

Constructor. Versioned Valence route, e.g. `/d2l/api/lp/1.5/enrollments/myenrollments/`. Has the following properties:

* `product` - should match a `ProductCode` that appears in a `/d2l/api/versions/` call - _e.g. "lp"_
* `prefix` - part before the version in the route - _e.g. "/d2l/api/lp/"_
* `suffix` - part after the version in the route - _e.g. "/enrollments/myenrollments/"_
* `desiredSemVer` - optional; when resolving a route, use this SemVer range to specify which version(s) we want to allow the route to be resolve with - _e.g. "^1.4"_

### `ValenceRoute.LP(String suffix[, String desiredSemVer])`

Convenience constructor. Similar to `Versioned`, but sets `product` to `lp` and `prefix` to `/d2l/api/lp/`.

### `ValenceRoute.LE(String suffix[, String desiredSemVer])`

Convenience constructor. Similar to `Versioned`, but sets `product` to `le` and `prefix` to `/d2l/api/le/`.

## `unstable` Routes

`node-valence-url` supports using _unstable_ API routes on `ValenceRoute.Versioned`, `ValenceRoute.LP`, and `ValenceRoute.LE`. Simply pass `'unstable'` as your `desiredSemVer` when instantiating a route, and calling `ValenceUrlResolver.resolve()` on that Route will return the unstable route.

## Contributing

1. **Fork** the repository. Committing directly against this repository is highly discouraged.

2. Make your modifications in a branch, updating and writing new tests as necessary in the `test` directory.

3. Ensure that all tests pass with `npm test`

4. `rebase` your changes against master. *Do not merge*.

5. Submit a pull request to this repository. Wait for tests to run and someone to chime in.

## Code Style

This repository is configured with [EditorConfig][EditorConfig] and [ESLint][ESLint].

[EditorConfig]: http://editorconfig.org/
[ESLint]: http://eslint.org/
