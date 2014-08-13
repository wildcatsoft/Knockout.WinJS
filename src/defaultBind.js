﻿var WinJS;
(function (WinJS) {
    (function (KO) {
        var _koBindings = {
            "visible": visibleBind,
            "text": textBind,
            "html": htmlBind,
            "if": ifBind,
            "ifnot": ifNotBind,
            "click": clickBind,
            "submit": submitBind,
            "enable": enableBind,
            "disable": disableBind,
            "hasFocus": hasFocusBind,
            "value": valueBind,
            "checked": checkedBind
        };

        KO.defaultBind = WinJS.Binding.initializer(function (source, sourceProps, dest, destProps) {
            var isHandled = false;
            if (destProps || destProps.length == 1) {
                var destProp = destProps[0];

                if (_koBindings[destProp]) {
                    _koBindings[destProp](source, sourceProps, dest);
                    isHandled = true;
                }
            }

            if (!isHandled) {
                WinJS.Binding.defaultBind(source, sourceProps, dest, destProps);
            }
        });

        function visibleBind(source, sourceProps, dest) {
            var converter = WinJS.Binding.converter(function (visible) {
                return visible ? "" : "none";
            });

            converter(source, sourceProps, dest, ["style", "display"]);
        }

        function textBind(source, sourceProps, dest) {
            WinJS.Binding.defaultBind(source, sourceProps, dest, ["textContent"]);
        }

        function htmlBind(source, sourceProps, dest) {
            WinJS.Binding.defaultBind(source, sourceProps, dest, ["innerHtml"]);
        }

        function _ifBindConverter(dest, value) {
            var destElement = dest;
            var children = [];

            if (value && children.length > 0) {
                for (var child in children) {
                    dest.appendChild(child);
                }
                children = [];
            } else if (!value && destElement.hasChildNodes()) {
                for (var child in destElement.children) {
                    children.push(child);
                }
                while (destElement.hasChildNodes()) {
                    destElement.removeChild(destElement.lastChild);
                }
            }
            return value;
        }
        ;

        function ifBind(source, sourceProps, dest) {
            var converter = WinJS.Binding.converter(function (value) {
                return _ifBindConverter(dest, value);
            });

            converter(source, sourceProps, dest, ["_winjs_ko_if"]);
        }

        function ifNotBind(source, sourceProps, dest) {
            var converter = WinJS.Binding.converter(function (value) {
                return _ifBindConverter(dest, !value);
            });

            converter(source, sourceProps, dest, ["_winjs_ko_ifnot"]);
        }

        function clickBind(source, sourceProps, dest) {
            WinJS.Binding.defaultBind(source, sourceProps, dest, ["onclick"]);
        }

        function eventBind(source, sourceProps, dest) {
            function _foreachEvent(events, func) {
                events = events || {};
                for (var key in events) {
                    var event = events[key];
                    if (typeof event == "function") {
                        func(key, event);
                    }
                }
            }

            var converter = WinJS.Binding.converter(function (events) {
                _foreachEvent(dest["_winjs_ko_eventBind"], function (key, event) {
                    dest.removeEventListener(key, event);
                });

                _foreachEvent(events, function (key, event) {
                    dest.addEventListener(key, event);
                });
            });

            converter(source, sourceProps, dest, ["_winjs_ko_eventBind"]);
        }

        function submitBind(source, sourceProps, dest) {
            var submitEvent;

            dest.addEventListener("submit", function (ev) {
                if (submitEvent && !submitEvent(ev)) {
                    ev.preventDefault();
                }
            });

            var converter = WinJS.Binding.converter(function (event) {
                submitEvent = (typeof (event) == "function") ? event : null;
                return submitEvent;
            });

            converter(source, sourceProps, dest, ["_winjs_ko_submitBind"]);
        }

        function _enableOrDisableBind(source, sourceProps, dest, isDisabled) {
            var converter = WinJS.Binding.converter(function (value) {
                var disabled = isDisabled ? value : !value;
                return disabled ? "true" : null;
            });

            converter(source, sourceProps, dest, ["disabled"]);
        }

        function enableBind(source, sourceProps, dest) {
            _enableOrDisableBind(source, sourceProps, dest, false);
        }

        function disableBind(source, sourceProps, dest) {
            _enableOrDisableBind(source, sourceProps, dest, true);
        }

        function valueBind(source, sourceProps, dest) {
            WinJS.Binding.defaultBind(source, sourceProps, dest, ["value"]);

            if (_isObservable(source)) {
                dest.onchange = function () {
                    _nestedSet(source, sourceProps, dest.value);
                };
            }
        }

        function hasFocusBind(source, sourceProps, dest) {
            function elementHasFocus(element) {
                return element.ownerDocument.activeElement == element;
            }

            var converter = WinJS.Binding.converter(function (hasFocus) {
                var destHasFocus = elementHasFocus(dest);

                if (hasFocus != destHasFocus) {
                    hasFocus ? dest.focus() : dest.blur();
                }

                if (_isObservable(source)) {
                    dest.onfocus = dest.onblur = function () {
                        _nestedSet(source, sourceProps, elementHasFocus(dest));
                    };
                }

                return hasFocus;
            });

            converter(source, sourceProps, dest, ["_winjs_ko_hasFocus"]);
        }

        function checkedBind(source, sourceProps, dest) {
            WinJS.Binding.defaultBind(source, sourceProps, dest, ["checked"]);

            if (_isObservable(source)) {
                dest.onchange = function () {
                    _nestedSet(source, sourceProps, dest.checked);
                };
            }
        }

        function _isObservable(data) {
            return WinJS.Binding.unwrap(data) !== data;
        }

        function _nestedSet(dest, destProperties, v) {
            for (var i = 0, len = (destProperties.length - 1); i < len; i++) {
                dest = dest[destProperties[i]];
                if (!dest) {
                    return;
                }
            }
            var prop = destProperties[destProperties.length - 1];
            dest[prop] = v;
        }

        (function cctor() {
            WinJS.Utilities.markSupportedForProcessing(KO.defaultBind);
        })();
    })(WinJS.KO || (WinJS.KO = {}));
    var KO = WinJS.KO;
})(WinJS || (WinJS = {}));
//# sourceMappingURL=defaultBind.js.map
