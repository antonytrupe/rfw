"use strict";

var _path = _interopRequireDefault(require("path"));
var _express = _interopRequireDefault(require("express"));
var _socket = _interopRequireDefault(require("socket.io"));
var _lanceGg = require("lance-gg");
var _Game = _interopRequireDefault(require("./common/Game"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var PORT = process.env.PORT || 3000;
var INDEX = _path["default"].join(__dirname, '../dist/index.html');

// define routes and socket
var server = (0, _express["default"])();
server.get('/', function (req, res) {
  res.sendFile(INDEX);
});
server.use('/', _express["default"]["static"](_path["default"].join(__dirname, '../dist/')));
var requestHandler = server.listen(PORT, function () {
  return console.log("Listening on ".concat(PORT));
});
var io = (0, _socket["default"])(requestHandler);

// Game Instances
var gameEngine = new _Game["default"]({
  traceLevel: _lanceGg.Lib.Trace.TRACE_ALL
});
var serverEngine = new _lanceGg.ServerEngine(io, gameEngine, {
  debug: {},
  updateRate: 3
});

// start the game
serverEngine.start();
console.log('main game started');
//# sourceMappingURL=main.js.map