# amplio-suite

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your unit tests
```
yarn test:unit
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Tailwind convention

We will use tailwind css for styling and the classes will be applied in the following order:

- spacing will be only top and left
- classes will be listed in the order: layout/flex/position, spacing, text style, colors, decorations/borders/shadows/etc and lastly the pseudo state modifiers (ej. :hover, :focus)
