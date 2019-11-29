# Changelog

## [master]

### Features

- Improved output for logging middleware
- Rewrite higher-order component Connect
- Add hooks: useDispatch, useSelector and useStore [[#3](https://github.com/kettil/react-fluxrx/issues/3)]
- AJAX middleware: Add an error handler callback
- AJAX middleware: Ignore the global URL [[#8](https://github.com/kettil/react-fluxrx/issues/8)]

### Fixes

### Chore & Maintenance

- Remove the bindActions function
- Remove the HOC connect function
- Conversion to functional components and hooks in the example [TodoMVC with AJAX](./example/todomvc-ajax)
- Conversion to functional components and hooks in the example [TodoMVC](./example/todomvc)
- [Documentation](./documents) added [[#6](https://github.com/kettil/react-fluxrx/issues/6)]

### Performance

## [0.1.1] - 2019-11-12

### Features

- Add a new function bindActions()
- Moving the AJAX parameters from the type action to an object
- Adjustment of the typing for the connect component

### Chore & Maintenance

- Updating the examples
- Updating the README.md

## <= 0.1.0

- See commit history for changes in previous versions of react-fluxRx
