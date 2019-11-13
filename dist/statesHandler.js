"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _state_class = _interopRequireDefault(require("./state_class"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var StateHandler = function () {
  function StateHandler(xgraph, ctrl) {
    _classCallCheck(this, StateHandler);

    GF_PLUGIN.log(1, 'StateHandler.constructor()');
    this.states = new Map();
    this.ctrl = ctrl;
    this.templateSrv = this.ctrl.templateSrv;
    this.xgraph = xgraph;
    this.initStates(this.xgraph, ctrl.rulesHandler.getRules());
  }

  _createClass(StateHandler, [{
    key: "initStates",
    value: function initStates(xgraph, rules) {
      var _this = this;

      GF_PLUGIN.log(1, 'StateHandler.initStates()');
      this.xgraph = xgraph;
      this.states.clear();
      var mxcells = xgraph.getMxCells();

      _.each(mxcells, function (mxcell) {
        _this.addState(mxcell);
      });
    }
  }, {
    key: "getStatesForRule",
    value: function getStatesForRule(rule) {
      GF_PLUGIN.log(1, 'StateHandler.getStatesForRule()');
      var result = new Map();
      var name = null;
      var xgraph = this.xgraph;
      this.states.forEach(function (state) {
        var mxcell = state.mxcell;
        var id = mxcell.id;
        var found = false;
        name = xgraph.getValuePropOfMxCell(rule.data.shapeProp, mxcell);

        if (rule.matchShape(name)) {
          result.set(id, state);
          found = true;
        }

        if (!found) {
          name = xgraph.getValuePropOfMxCell(rule.data.textProp, mxcell);

          if (rule.matchText(name)) {
            result.set(id, state);
            found = true;
          }
        }

        if (!found) {
          name = xgraph.getValuePropOfMxCell(rule.data.linkProp, mxcell);

          if (rule.matchLink(name)) {
            result.set(id, state);
            found = true;
          }
        }
      });
      return result;
    }
  }, {
    key: "updateStates",
    value: function updateStates(rules) {
      var _this2 = this;

      GF_PLUGIN.log(1, 'StateHandler.updateStates()');
      rules.forEach(function (rule) {
        rule.states = _this2.getStatesForRule(rule);
      });
    }
  }, {
    key: "getStates",
    value: function getStates() {
      return this.states;
    }
  }, {
    key: "getState",
    value: function getState(cellId) {
      return this.states.get(cellId);
    }
  }, {
    key: "addState",
    value: function addState(mxcell) {
      var state = new _state_class["default"](mxcell, this.xgraph, this.ctrl);
      this.states.set(mxcell.id, state);
      return state;
    }
  }, {
    key: "countStates",
    value: function countStates() {
      return this.states.size;
    }
  }, {
    key: "prepare",
    value: function prepare() {
      this.states.forEach(function (state) {
        state.prepare();
      });
    }
  }, {
    key: "setStates",
    value: function setStates(rules, series) {
      var _this3 = this;

      GF_PLUGIN.log(1, 'StateHandler.setStates()');
      this.prepare();
      rules.forEach(function (rule) {
        if (rule.states === undefined || rule.states.length === 0) rule.states = _this3.getStatesForRule(rule);
        rule.states.forEach(function (state) {
          series.forEach(function (serie) {
            state.setState(rule, serie);
          });
        });
      });
    }
  }, {
    key: "applyStates",
    value: function applyStates() {
      GF_PLUGIN.log(1, 'StateHandler.applyStates()');
      this.states.forEach(function (state) {
        state.async_applyState();
      });
    }
  }, {
    key: "async_applyStates",
    value: function () {
      var _async_applyStates = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                GF_PLUGIN.startPerf("async_applyStates");
                this.applyStates();
                GF_PLUGIN.stopPerf("async_applyStates");

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function async_applyStates() {
        return _async_applyStates.apply(this, arguments);
      }

      return async_applyStates;
    }()
  }]);

  return StateHandler;
}();

exports["default"] = StateHandler;
