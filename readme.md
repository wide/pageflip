# Pageflip

Handle page transition when navigating, based on `pjax`.


## Install

```
npm install @wide/pageflip --save
```


## Usage

```js
import pageflip from '@wide/pageflip'

pageflip({
  container: 'main',
  transition: 'fadeUp',
  transitions: {
    fadeUp: {
      from: el => fadeUpOut(el),
      to:   el => fadeUpIn(el)
    }
  }
})
```

- `container`: selector of the element to update when the next page is loaded, default `main`
- `transition`: default transition to apply, default `noop`
- `transitions`: collection of available transitions
  - `enter`: called when the next page is loading, must return a `Promise`
  - `leave`: called when `enter` is resolved **and** the next page is loaded, ready to swap

### Default transitions

Pageflip comme with 2 defaults transitions:
- `noop` do absolutely nothing, swap directly the next page
- `fade` a simple fade in/out of the page

### Lifecycle and hooks

Pageflip apply the following process:
```
 click   ->   onLoad()   ->   transition.enter()   ->   page is  ->   onSwap()   ->   transition.leave()
on link                                                 loaded
```

You can interact around `onLoad()` and `onSwap()` with these hooks :
```js
pageflip({
  beforeLoad(),
  afterLoad(),
  beforeSwap(),
  afterSwap()
})
```


## Libraries

This package uses :
- [`pjax`](https://github.com/MoOx/pjax)


## Authors

- **Aymeric Assier** - [github.com/myeti](https://github.com/myeti)
- **Julien Martins Da Costa** - [github.com/jdacosta](https://github.com/jdacosta)


## License

This project is licensed under the MIT License - see the [licence](licence) file for details