'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = configureStore;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _redux = require('redux');

function configureStore() {
  var middlewares = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

  return function mockStore(_getState, expectedActions, done) {
    if (!expectedActions) {
      throw new Error('expectedActions should be an expected action or an array of actions.');
    } else if (!Array.isArray(expectedActions)) {
      expectedActions = [expectedActions];
    }

    if (typeof done !== 'undefined' && typeof done !== 'function') {
      throw new Error('done should either be undefined or function.');
    }

    function mockStoreWithoutMiddleware() {
      var self = {
        getState: function getState() {
          return typeof _getState === 'function' ? _getState() : _getState;
        },

        dispatch: function dispatch(action) {
          if (action instanceof Function) {
            return action(self);
          }

          var expectedAction = expectedActions.shift();

          try {
            (0, _expect2['default'])(action).toEqual(expectedAction);
            if (done && !expectedActions.length) {
              done();
            }
            return action;
          } catch (e) {
            throw e;
          }
        }
      };

      return self;
    }

    var mockStoreWithMiddleware = _redux.applyMiddleware.apply(undefined, _toConsumableArray(middlewares))(mockStoreWithoutMiddleware);

    return mockStoreWithMiddleware();
  };
}

module.exports = exports['default'];