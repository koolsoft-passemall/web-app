"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@testing-library/react");

var _App = _interopRequireDefault(require("./App"));

test('renders learn react link', () => {
  var {
    getByText
  } = (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_App.default, null));
  var linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});