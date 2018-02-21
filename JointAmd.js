/* jshint unused: false */
/* globals dojo: false */
define([], function () {

if (dojo.isIE && (dojo.isIE < 9)) {
	return;
}
var Raphael;
(function(global) {
	'use strict';
	global.Math = window.Math;
})(this);
/*
    http://www.JSON.org/json2.js
    2010-03-20

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

/*!
 * Raphael 1.4.3 - JavaScript Vector Library
 *
 * Copyright (c) 2010 Dmitry Baranovskiy (http://raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
 
Raphael = (function () {
    function R() {
        if (R.is(arguments[0], array)) {
            var a = arguments[0],
                cnv = create[apply](R, a.splice(0, 3 + R.is(a[0], nu))),
                res = cnv.set();
            for (var i = 0, ii = a[length]; i < ii; i++) {
                var j = a[i] || {};
                elements.test(j.type) && res[push](cnv[j.type]().attr(j));
            }
            return res;
        }
        return create[apply](R, arguments);
    }
    R.version = "1.4.3";
    var separator = /[, ]+/,
        elements = /^(circle|rect|path|ellipse|text|image)$/,
        proto = "prototype",
        has = "hasOwnProperty",
        doc = document,
        win = window,
        oldRaphael = {
            was: Object[proto][has].call(win, "Raphael"),
            is: win.Raphael
        },
        Paper = function () {},
        appendChild = "appendChild",
        apply = "apply",
        concat = "concat",
        supportsTouch = "createTouch" in doc,
        E = "",
        S = " ",
        split = "split",
        events = "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend orientationchange touchcancel gesturestart gesturechange gestureend"[split](S),
        touchMap = {
            mousedown: "touchstart",
            mousemove: "touchmove",
            mouseup: "touchend"
        },
        join = "join",
        length = "length",
        lowerCase = String[proto].toLowerCase,
        math = Math,
        mmax = math.max,
        mmin = math.min,
        nu = "number",
        string = "string",
        array = "array",
        toString = "toString",
        fillString = "fill",
        objectToString = Object[proto][toString],
        paper = {},
        pow = math.pow,
        push = "push",
        rg = /^(?=[\da-f]$)/,
        ISURL = /^url\(['"]?([^\)]+?)['"]?\)$/i,
        colourRegExp = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+\s*,\s*[\d\.]+\s*,\s*[\d\.]+(?:\s*,\s*[\d\.]+)?)\s*\)|rgba?\(\s*([\d\.]+%\s*,\s*[\d\.]+%\s*,\s*[\d\.]+%(?:\s*,\s*[\d\.]+%))\s*\)|hs[bl]\(\s*([\d\.]+\s*,\s*[\d\.]+\s*,\s*[\d\.]+)\s*\)|hs[bl]\(\s*([\d\.]+%\s*,\s*[\d\.]+%\s*,\s*[\d\.]+%)\s*\))\s*$/i,
        round = math.round,
        setAttribute = "setAttribute",
        toFloat = parseFloat,
        toInt = parseInt,
        ms = " progid:DXImageTransform.Microsoft",
        upperCase = String[proto].toUpperCase,
        availableAttrs = {blur: 0, "clip-rect": "0 0 1e9 1e9", cursor: "default", cx: 0, cy: 0, fill: "#fff", "fill-opacity": 1, font: '10px "Arial"', "font-family": '"Arial"', "font-size": "10", "font-style": "normal", "font-weight": 400, gradient: 0, height: 0, href: "http://raphaeljs.com/", opacity: 1, path: "M0,0", r: 0, rotation: 0, rx: 0, ry: 0, scale: "1 1", src: "", stroke: "#000", "stroke-dasharray": "", "stroke-linecap": "butt", "stroke-linejoin": "butt", "stroke-miterlimit": 0, "stroke-opacity": 1, "stroke-width": 1, target: "_blank", "text-anchor": "middle", title: "Raphael", translation: "0 0", width: 0, x: 0, y: 0},
        availableAnimAttrs = {along: "along", blur: nu, "clip-rect": "csv", cx: nu, cy: nu, fill: "colour", "fill-opacity": nu, "font-size": nu, height: nu, opacity: nu, path: "path", r: nu, rotation: "csv", rx: nu, ry: nu, scale: "csv", stroke: "colour", "stroke-opacity": nu, "stroke-width": nu, translation: "csv", width: nu, x: nu, y: nu},
        rp = "replace";
    R.type = (win.SVGAngle || doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML");
    if (R.type == "VML") {
        var d = doc.createElement("div");
        d.innerHTML = '<!--[if vml]><br><br><![endif]-->';
        if (d.childNodes[length] != 2) {
            return R.type = null;
        }
        d = null;
    }
    R.svg = !(R.vml = R.type == "VML");
    Paper[proto] = R[proto];
    R._id = 0;
    R._oid = 0;
    R.fn = {};
    R.is = function (o, type) {
        type = lowerCase.call(type);
        return  (type == "object" && o === Object(o)) ||
                (type == "undefined" && typeof o == type) ||
                (type == "null" && o == null) ||
                lowerCase.call(objectToString.call(o).slice(8, -1)) == type;
    };

    R.setWindow = function (newwin) {
        win = newwin;
        doc = win.document;
    };
    // colour utilities
    var toHex = function (color) {
        if (R.vml) {
            // http://dean.edwards.name/weblog/2009/10/convert-any-colour-value-to-hex-in-msie/
            var trim = /^\s+|\s+$/g;
            toHex = cacher(function (color) {
                var bod;
                color = (color + E)[rp](trim, E);
                try {
                    var docum = new win.ActiveXObject("htmlfile");
                    docum.write("<body>");
                    docum.close();
                    bod = docum.body;
                } catch(e) {
                    bod = win.createPopup().document.body;
                }
                var range = bod.createTextRange();
                try {
                    bod.style.color = color;
                    var value = range.queryCommandValue("ForeColor");
                    value = ((value & 255) << 16) | (value & 65280) | ((value & 16711680) >>> 16);
                    return "#" + ("000000" + value[toString](16)).slice(-6);
                } catch(e) {
                    return "none";
                }
            });
        } else {
            var i = doc.createElement("i");
            i.title = "Rapha\xebl Colour Picker";
            i.style.display = "none";
            doc.body[appendChild](i);
            toHex = cacher(function (color) {
                i.style.color = color;
                return doc.defaultView.getComputedStyle(i, E).getPropertyValue("color");
            });
        }
        return toHex(color);
    };
    var hsbtoString = function () {
        return "hsb(" + [this.h, this.s, this.b] + ")";
    },
    rgbtoString = function () {
        return this.hex;
    };
    R.hsb2rgb = cacher(function (hue, saturation, brightness) {
        if (R.is(hue, "object") && "h" in hue && "s" in hue && "b" in hue) {
            brightness = hue.b;
            saturation = hue.s;
            hue = hue.h;
        }
        var red,
            green,
            blue;
        if (brightness == 0) {
            return {r: 0, g: 0, b: 0, hex: "#000"};
        }
        if (hue > 1 || saturation > 1 || brightness > 1) {
            hue /= 255;
            saturation /= 255;
            brightness /= 255;
        }
        var i = ~~(hue * 6),
            f = (hue * 6) - i,
            p = brightness * (1 - saturation),
            q = brightness * (1 - (saturation * f)),
            t = brightness * (1 - (saturation * (1 - f)));
        red = [brightness, q, p, p, t, brightness, brightness][i];
        green = [t, brightness, brightness, q, p, p, t][i];
        blue = [p, p, t, brightness, brightness, q, p][i];
        red *= 255;
        green *= 255;
        blue *= 255;
        var rgb = {r: red, g: green, b: blue, toString: rgbtoString},
            r = (~~red)[toString](16),
            g = (~~green)[toString](16),
            b = (~~blue)[toString](16);
        r = r[rp](rg, "0");
        g = g[rp](rg, "0");
        b = b[rp](rg, "0");
        rgb.hex = "#" + r + g + b;
        return rgb;
    }, R);
    R.rgb2hsb = cacher(function (red, green, blue) {
        if (R.is(red, "object") && "r" in red && "g" in red && "b" in red) {
            blue = red.b;
            green = red.g;
            red = red.r;
        }
        if (R.is(red, string)) {
            var clr = R.getRGB(red);
            red = clr.r;
            green = clr.g;
            blue = clr.b;
        }
        if (red > 1 || green > 1 || blue > 1) {
            red /= 255;
            green /= 255;
            blue /= 255;
        }
        var max = mmax(red, green, blue),
            min = mmin(red, green, blue),
            hue,
            saturation,
            brightness = max;
        if (min == max) {
            return {h: 0, s: 0, b: max};
        } else {
            var delta = (max - min);
            saturation = delta / max;
            if (red == max) {
                hue = (green - blue) / delta;
            } else if (green == max) {
                hue = 2 + ((blue - red) / delta);
            } else {
                hue = 4 + ((red - green) / delta);
            }
            hue /= 6;
            hue < 0 && hue++;
            hue > 1 && hue--;
        }
        return {h: hue, s: saturation, b: brightness, toString: hsbtoString};
    }, R);
    var p2s = /,?([achlmqrstvxz]),?/gi,
        commaSpaces = /\s*,\s*/,
        hsrg = {hs: 1, rg: 1};
    R._path2string = function () {
        return this.join(",")[rp](p2s, "$1");
    };
    function cacher(f, scope, postprocessor) {
        function newf() {
            var arg = Array[proto].slice.call(arguments, 0),
                args = arg[join]("\u25ba"),
                cache = newf.cache = newf.cache || {},
                count = newf.count = newf.count || [];
            if (cache[has](args)) {
                return postprocessor ? postprocessor(cache[args]) : cache[args];
            }
            count[length] >= 1e3 && delete cache[count.shift()];
            count[push](args);
            cache[args] = f[apply](scope, arg);
            return postprocessor ? postprocessor(cache[args]) : cache[args];
        }
        return newf;
    }
 
    R.getRGB = cacher(function (colour) {
        if (!colour || !!((colour = colour + E).indexOf("-") + 1)) {
            return {r: -1, g: -1, b: -1, hex: "none", error: 1};
        }
        if (colour == "none") {
            return {r: -1, g: -1, b: -1, hex: "none"};
        }
        !(hsrg[has](colour.substring(0, 2)) || colour.charAt() == "#") && (colour = toHex(colour));
        var res,
            red,
            green,
            blue,
            opacity,
            t,
            rgb = colour.match(colourRegExp);
        if (rgb) {
            if (rgb[2]) {
                blue = toInt(rgb[2].substring(5), 16);
                green = toInt(rgb[2].substring(3, 5), 16);
                red = toInt(rgb[2].substring(1, 3), 16);
            }
            if (rgb[3]) {
                blue = toInt((t = rgb[3].charAt(3)) + t, 16);
                green = toInt((t = rgb[3].charAt(2)) + t, 16);
                red = toInt((t = rgb[3].charAt(1)) + t, 16);
            }
            if (rgb[4]) {
                rgb = rgb[4][split](commaSpaces);
                red = toFloat(rgb[0]);
                green = toFloat(rgb[1]);
                blue = toFloat(rgb[2]);
                opacity = toFloat(rgb[3]);
            }
            if (rgb[5]) {
                rgb = rgb[5][split](commaSpaces);
                red = toFloat(rgb[0]) * 2.55;
                green = toFloat(rgb[1]) * 2.55;
                blue = toFloat(rgb[2]) * 2.55;
                opacity = toFloat(rgb[3]);
            }
            if (rgb[6]) {
                rgb = rgb[6][split](commaSpaces);
                red = toFloat(rgb[0]);
                green = toFloat(rgb[1]);
                blue = toFloat(rgb[2]);
                return R.hsb2rgb(red, green, blue);
            }
            if (rgb[7]) {
                rgb = rgb[7][split](commaSpaces);
                red = toFloat(rgb[0]) * 2.55;
                green = toFloat(rgb[1]) * 2.55;
                blue = toFloat(rgb[2]) * 2.55;
                return R.hsb2rgb(red, green, blue);
            }
            rgb = {r: red, g: green, b: blue};
            var r = (~~red)[toString](16),
                g = (~~green)[toString](16),
                b = (~~blue)[toString](16);
            r = r[rp](rg, "0");
            g = g[rp](rg, "0");
            b = b[rp](rg, "0");
            rgb.hex = "#" + r + g + b;
            isFinite(toFloat(opacity)) && (rgb.o = opacity);
            return rgb;
        }
        return {r: -1, g: -1, b: -1, hex: "none", error: 1};
    }, R);
    R.getColor = function (value) {
        var start = this.getColor.start = this.getColor.start || {h: 0, s: 1, b: value || .75},
            rgb = this.hsb2rgb(start.h, start.s, start.b);
        start.h += .075;
        if (start.h > 1) {
            start.h = 0;
            start.s -= .2;
            start.s <= 0 && (this.getColor.start = {h: 0, s: 1, b: start.b});
        }
        return rgb.hex;
    };
    R.getColor.reset = function () {
        delete this.start;
    };
    // path utilities
    var pathCommand = /([achlmqstvz])[\s,]*((-?\d*\.?\d*(?:e[-+]?\d+)?\s*,?\s*)+)/ig,
        pathValues = /(-?\d*\.?\d*(?:e[-+]?\d+)?)\s*,?\s*/ig;
    R.parsePathString = cacher(function (pathString) {
        if (!pathString) {
            return null;
        }
        var paramCounts = {a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0},
            data = [];
        if (R.is(pathString, array) && R.is(pathString[0], array)) { // rough assumption
            data = pathClone(pathString);
        }
        if (!data[length]) {
            (pathString + E)[rp](pathCommand, function (a, b, c) {
                var params = [],
                    name = lowerCase.call(b);
                c[rp](pathValues, function (a, b) {
                    b && params[push](+b);
                });
                if (name == "m" && params[length] > 2) {
                    data[push]([b][concat](params.splice(0, 2)));
                    name = "l";
                    b = b == "m" ? "l" : "L";
                }
                while (params[length] >= paramCounts[name]) {
                    data[push]([b][concat](params.splice(0, paramCounts[name])));
                    if (!paramCounts[name]) {
                        break;
                    }
                }
            });
        }
        data[toString] = R._path2string;
        return data;
    });
    R.findDotsAtSegment = function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
        var t1 = 1 - t,
            x = pow(t1, 3) * p1x + pow(t1, 2) * 3 * t * c1x + t1 * 3 * t * t * c2x + pow(t, 3) * p2x,
            y = pow(t1, 3) * p1y + pow(t1, 2) * 3 * t * c1y + t1 * 3 * t * t * c2y + pow(t, 3) * p2y,
            mx = p1x + 2 * t * (c1x - p1x) + t * t * (c2x - 2 * c1x + p1x),
            my = p1y + 2 * t * (c1y - p1y) + t * t * (c2y - 2 * c1y + p1y),
            nx = c1x + 2 * t * (c2x - c1x) + t * t * (p2x - 2 * c2x + c1x),
            ny = c1y + 2 * t * (c2y - c1y) + t * t * (p2y - 2 * c2y + c1y),
            ax = (1 - t) * p1x + t * c1x,
            ay = (1 - t) * p1y + t * c1y,
            cx = (1 - t) * c2x + t * p2x,
            cy = (1 - t) * c2y + t * p2y,
            alpha = (90 - math.atan((mx - nx) / (my - ny)) * 180 / math.PI);
        (mx > nx || my < ny) && (alpha += 180);
        return {x: x, y: y, m: {x: mx, y: my}, n: {x: nx, y: ny}, start: {x: ax, y: ay}, end: {x: cx, y: cy}, alpha: alpha};
    };
    var pathDimensions = cacher(function (path) {
        if (!path) {
            return {x: 0, y: 0, width: 0, height: 0};
        }
        path = path2curve(path);
        var x = 0, 
            y = 0,
            X = [],
            Y = [],
            p;
        for (var i = 0, ii = path[length]; i < ii; i++) {
            p = path[i];
            if (p[0] == "M") {
                x = p[1];
                y = p[2];
                X[push](x);
                Y[push](y);
            } else {
                var dim = curveDim(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                X = X[concat](dim.min.x, dim.max.x);
                Y = Y[concat](dim.min.y, dim.max.y);
                x = p[5];
                y = p[6];
            }
        }
        var xmin = mmin[apply](0, X),
            ymin = mmin[apply](0, Y);
        return {
            x: xmin,
            y: ymin,
            width: mmax[apply](0, X) - xmin,
            height: mmax[apply](0, Y) - ymin
        };
    }),
        pathClone = function (pathArray) {
            var res = [];
            if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) { // rough assumption
                pathArray = R.parsePathString(pathArray);
            }
            for (var i = 0, ii = pathArray[length]; i < ii; i++) {
                res[i] = [];
                for (var j = 0, jj = pathArray[i][length]; j < jj; j++) {
                    res[i][j] = pathArray[i][j];
                }
            }
            res[toString] = R._path2string;
            return res;
        },
        pathToRelative = cacher(function (pathArray) {
            if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) { // rough assumption
                pathArray = R.parsePathString(pathArray);
            }
            var res = [],
                x = 0,
                y = 0,
                mx = 0,
                my = 0,
                start = 0;
            if (pathArray[0][0] == "M") {
                x = pathArray[0][1];
                y = pathArray[0][2];
                mx = x;
                my = y;
                start++;
                res[push](["M", x, y]);
            }
            for (var i = start, ii = pathArray[length]; i < ii; i++) {
                var r = res[i] = [],
                    pa = pathArray[i];
                if (pa[0] != lowerCase.call(pa[0])) {
                    r[0] = lowerCase.call(pa[0]);
                    switch (r[0]) {
                        case "a":
                            r[1] = pa[1];
                            r[2] = pa[2];
                            r[3] = pa[3];
                            r[4] = pa[4];
                            r[5] = pa[5];
                            r[6] = +(pa[6] - x).toFixed(3);
                            r[7] = +(pa[7] - y).toFixed(3);
                            break;
                        case "v":
                            r[1] = +(pa[1] - y).toFixed(3);
                            break;
                        case "m":
                            mx = pa[1];
                            my = pa[2];
                        default:
                            for (var j = 1, jj = pa[length]; j < jj; j++) {
                                r[j] = +(pa[j] - ((j % 2) ? x : y)).toFixed(3);
                            }
                    }
                } else {
                    r = res[i] = [];
                    if (pa[0] == "m") {
                        mx = pa[1] + x;
                        my = pa[2] + y;
                    }
                    for (var k = 0, kk = pa[length]; k < kk; k++) {
                        res[i][k] = pa[k];
                    }
                }
                var len = res[i][length];
                switch (res[i][0]) {
                    case "z":
                        x = mx;
                        y = my;
                        break;
                    case "h":
                        x += +res[i][len - 1];
                        break;
                    case "v":
                        y += +res[i][len - 1];
                        break;
                    default:
                        x += +res[i][len - 2];
                        y += +res[i][len - 1];
                }
            }
            res[toString] = R._path2string;
            return res;
        }, 0, pathClone),
        pathToAbsolute = cacher(function (pathArray) {
            if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) { // rough assumption
                pathArray = R.parsePathString(pathArray);
            }
            var res = [],
                x = 0,
                y = 0,
                mx = 0,
                my = 0,
                start = 0;
            if (pathArray[0][0] == "M") {
                x = +pathArray[0][1];
                y = +pathArray[0][2];
                mx = x;
                my = y;
                start++;
                res[0] = ["M", x, y];
            }
            for (var i = start, ii = pathArray[length]; i < ii; i++) {
                var r = res[i] = [],
                    pa = pathArray[i];
                if (pa[0] != upperCase.call(pa[0])) {
                    r[0] = upperCase.call(pa[0]);
                    switch (r[0]) {
                        case "A":
                            r[1] = pa[1];
                            r[2] = pa[2];
                            r[3] = pa[3];
                            r[4] = pa[4];
                            r[5] = pa[5];
                            r[6] = +(pa[6] + x);
                            r[7] = +(pa[7] + y);
                            break;
                        case "V":
                            r[1] = +pa[1] + y;
                            break;
                        case "H":
                            r[1] = +pa[1] + x;
                            break;
                        case "M":
                            mx = +pa[1] + x;
                            my = +pa[2] + y;
                        default:
                            for (var j = 1, jj = pa[length]; j < jj; j++) {
                                r[j] = +pa[j] + ((j % 2) ? x : y);
                            }
                    }
                } else {
                    for (var k = 0, kk = pa[length]; k < kk; k++) {
                        res[i][k] = pa[k];
                    }
                }
                switch (r[0]) {
                    case "Z":
                        x = mx;
                        y = my;
                        break;
                    case "H":
                        x = r[1];
                        break;
                    case "V":
                        y = r[1];
                        break;
                    default:
                        x = res[i][res[i][length] - 2];
                        y = res[i][res[i][length] - 1];
                }
            }
            res[toString] = R._path2string;
            return res;
        }, null, pathClone),
        l2c = function (x1, y1, x2, y2) {
            return [x1, y1, x2, y2, x2, y2];
        },
        q2c = function (x1, y1, ax, ay, x2, y2) {
            var _13 = 1 / 3,
                _23 = 2 / 3;
            return [
                    _13 * x1 + _23 * ax,
                    _13 * y1 + _23 * ay,
                    _13 * x2 + _23 * ax,
                    _13 * y2 + _23 * ay,
                    x2,
                    y2
                ];
        },
        a2c = function (x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
            // for more information of where this math came from visit:
            // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
            var PI = math.PI,
                _120 = PI * 120 / 180,
                rad = PI / 180 * (+angle || 0),
                res = [],
                xy,
                rotate = cacher(function (x, y, rad) {
                    var X = x * math.cos(rad) - y * math.sin(rad),
                        Y = x * math.sin(rad) + y * math.cos(rad);
                    return {x: X, y: Y};
                });
            if (!recursive) {
                xy = rotate(x1, y1, -rad);
                x1 = xy.x;
                y1 = xy.y;
                xy = rotate(x2, y2, -rad);
                x2 = xy.x;
                y2 = xy.y;
                var cos = math.cos(PI / 180 * angle),
                    sin = math.sin(PI / 180 * angle),
                    x = (x1 - x2) / 2,
                    y = (y1 - y2) / 2;
                var h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
                if (h > 1) {
                    h = math.sqrt(h);
                    rx = h * rx;
                    ry = h * ry;
                }
                var rx2 = rx * rx,
                    ry2 = ry * ry,
                    k = (large_arc_flag == sweep_flag ? -1 : 1) *
                        math.sqrt(math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
                    cx = k * rx * y / ry + (x1 + x2) / 2,
                    cy = k * -ry * x / rx + (y1 + y2) / 2,
                    f1 = math.asin(((y1 - cy) / ry).toFixed(7)),
                    f2 = math.asin(((y2 - cy) / ry).toFixed(7));

                f1 = x1 < cx ? PI - f1 : f1;
                f2 = x2 < cx ? PI - f2 : f2;
                f1 < 0 && (f1 = PI * 2 + f1);
                f2 < 0 && (f2 = PI * 2 + f2);
                if (sweep_flag && f1 > f2) {
                    f1 = f1 - PI * 2;
                }
                if (!sweep_flag && f2 > f1) {
                    f2 = f2 - PI * 2;
                }
            } else {
                f1 = recursive[0];
                f2 = recursive[1];
                cx = recursive[2];
                cy = recursive[3];
            }
            var df = f2 - f1;
            if (math.abs(df) > _120) {
                var f2old = f2,
                    x2old = x2,
                    y2old = y2;
                f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
                x2 = cx + rx * math.cos(f2);
                y2 = cy + ry * math.sin(f2);
                res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
            }
            df = f2 - f1;
            var c1 = math.cos(f1),
                s1 = math.sin(f1),
                c2 = math.cos(f2),
                s2 = math.sin(f2),
                t = math.tan(df / 4),
                hx = 4 / 3 * rx * t,
                hy = 4 / 3 * ry * t,
                m1 = [x1, y1],
                m2 = [x1 + hx * s1, y1 - hy * c1],
                m3 = [x2 + hx * s2, y2 - hy * c2],
                m4 = [x2, y2];
            m2[0] = 2 * m1[0] - m2[0];
            m2[1] = 2 * m1[1] - m2[1];
            if (recursive) {
                return [m2, m3, m4][concat](res);
            } else {
                res = [m2, m3, m4][concat](res)[join]()[split](",");
                var newres = [];
                for (var i = 0, ii = res[length]; i < ii; i++) {
                    newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
                }
                return newres;
            }
        },
        findDotAtSegment = function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
            var t1 = 1 - t;
            return {
                x: pow(t1, 3) * p1x + pow(t1, 2) * 3 * t * c1x + t1 * 3 * t * t * c2x + pow(t, 3) * p2x,
                y: pow(t1, 3) * p1y + pow(t1, 2) * 3 * t * c1y + t1 * 3 * t * t * c2y + pow(t, 3) * p2y
            };
        },
        curveDim = cacher(function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
            var a = (c2x - 2 * c1x + p1x) - (p2x - 2 * c2x + c1x),
                b = 2 * (c1x - p1x) - 2 * (c2x - c1x),
                c = p1x - c1x,
                t1 = (-b + math.sqrt(b * b - 4 * a * c)) / 2 / a,
                t2 = (-b - math.sqrt(b * b - 4 * a * c)) / 2 / a,
                y = [p1y, p2y],
                x = [p1x, p2x],
                dot;
            math.abs(t1) > 1e12 && (t1 = .5);
            math.abs(t2) > 1e12 && (t2 = .5);
            if (t1 > 0 && t1 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
                x[push](dot.x);
                y[push](dot.y);
            }
            if (t2 > 0 && t2 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
                x[push](dot.x);
                y[push](dot.y);
            }
            a = (c2y - 2 * c1y + p1y) - (p2y - 2 * c2y + c1y);
            b = 2 * (c1y - p1y) - 2 * (c2y - c1y);
            c = p1y - c1y;
            t1 = (-b + math.sqrt(b * b - 4 * a * c)) / 2 / a;
            t2 = (-b - math.sqrt(b * b - 4 * a * c)) / 2 / a;
            math.abs(t1) > 1e12 && (t1 = .5);
            math.abs(t2) > 1e12 && (t2 = .5);
            if (t1 > 0 && t1 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
                x[push](dot.x);
                y[push](dot.y);
            }
            if (t2 > 0 && t2 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
                x[push](dot.x);
                y[push](dot.y);
            }
            return {
                min: {x: mmin[apply](0, x), y: mmin[apply](0, y)},
                max: {x: mmax[apply](0, x), y: mmax[apply](0, y)}
            };
        }),
        path2curve = cacher(function (path, path2) {
            var p = pathToAbsolute(path),
                p2 = path2 && pathToAbsolute(path2),
                attrs = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
                attrs2 = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
                processPath = function (path, d) {
                    var nx, ny;
                    if (!path) {
                        return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
                    }
                    !(path[0] in {T:1, Q:1}) && (d.qx = d.qy = null);
                    switch (path[0]) {
                        case "M":
                            d.X = path[1];
                            d.Y = path[2];
                            break;
                        case "A":
                            path = ["C"][concat](a2c[apply](0, [d.x, d.y][concat](path.slice(1))));
                            break;
                        case "S":
                            nx = d.x + (d.x - (d.bx || d.x));
                            ny = d.y + (d.y - (d.by || d.y));
                            path = ["C", nx, ny][concat](path.slice(1));
                            break;
                        case "T":
                            d.qx = d.x + (d.x - (d.qx || d.x));
                            d.qy = d.y + (d.y - (d.qy || d.y));
                            path = ["C"][concat](q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
                            break;
                        case "Q":
                            d.qx = path[1];
                            d.qy = path[2];
                            path = ["C"][concat](q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
                            break;
                        case "L":
                            path = ["C"][concat](l2c(d.x, d.y, path[1], path[2]));
                            break;
                        case "H":
                            path = ["C"][concat](l2c(d.x, d.y, path[1], d.y));
                            break;
                        case "V":
                            path = ["C"][concat](l2c(d.x, d.y, d.x, path[1]));
                            break;
                        case "Z":
                            path = ["C"][concat](l2c(d.x, d.y, d.X, d.Y));
                            break;
                    }
                    return path;
                },
                fixArc = function (pp, i) {
                    if (pp[i][length] > 7) {
                        pp[i].shift();
                        var pi = pp[i];
                        while (pi[length]) {
                            pp.splice(i++, 0, ["C"][concat](pi.splice(0, 6)));
                        }
                        pp.splice(i, 1);
                        ii = mmax(p[length], p2 && p2[length] || 0);
                    }
                },
                fixM = function (path1, path2, a1, a2, i) {
                    if (path1 && path2 && path1[i][0] == "M" && path2[i][0] != "M") {
                        path2.splice(i, 0, ["M", a2.x, a2.y]);
                        a1.bx = 0;
                        a1.by = 0;
                        a1.x = path1[i][1];
                        a1.y = path1[i][2];
                        ii = mmax(p[length], p2 && p2[length] || 0);
                    }
                };
            for (var i = 0, ii = mmax(p[length], p2 && p2[length] || 0); i < ii; i++) {
                p[i] = processPath(p[i], attrs);
                fixArc(p, i);
                p2 && (p2[i] = processPath(p2[i], attrs2));
                p2 && fixArc(p2, i);
                fixM(p, p2, attrs, attrs2, i);
                fixM(p2, p, attrs2, attrs, i);
                var seg = p[i],
                    seg2 = p2 && p2[i],
                    seglen = seg[length],
                    seg2len = p2 && seg2[length];
                attrs.x = seg[seglen - 2];
                attrs.y = seg[seglen - 1];
                attrs.bx = toFloat(seg[seglen - 4]) || attrs.x;
                attrs.by = toFloat(seg[seglen - 3]) || attrs.y;
                attrs2.bx = p2 && (toFloat(seg2[seg2len - 4]) || attrs2.x);
                attrs2.by = p2 && (toFloat(seg2[seg2len - 3]) || attrs2.y);
                attrs2.x = p2 && seg2[seg2len - 2];
                attrs2.y = p2 && seg2[seg2len - 1];
            }
            return p2 ? [p, p2] : p;
        }, null, pathClone),
        parseDots = cacher(function (gradient) {
            var dots = [];
            for (var i = 0, ii = gradient[length]; i < ii; i++) {
                var dot = {},
                    par = gradient[i].match(/^([^:]*):?([\d\.]*)/);
                dot.color = R.getRGB(par[1]);
                if (dot.color.error) {
                    return null;
                }
                dot.color = dot.color.hex;
                par[2] && (dot.offset = par[2] + "%");
                dots[push](dot);
            }
            for (i = 1, ii = dots[length] - 1; i < ii; i++) {
                if (!dots[i].offset) {
                    var start = toFloat(dots[i - 1].offset || 0),
                        end = 0;
                    for (var j = i + 1; j < ii; j++) {
                        if (dots[j].offset) {
                            end = dots[j].offset;
                            break;
                        }
                    }
                    if (!end) {
                        end = 100;
                        j = ii;
                    }
                    end = toFloat(end);
                    var d = (end - start) / (j - i + 1);
                    for (; i < j; i++) {
                        start += d;
                        dots[i].offset = start + "%";
                    }
                }
            }
            return dots;
        }),
        getContainer = function (x, y, w, h) {
            var container;
            if (R.is(x, string) || R.is(x, "object")) {
                container = R.is(x, string) ? doc.getElementById(x) : x;
                if (container.tagName) {
                    if (y == null) {
                        return {
                            container: container,
                            width: container.style.pixelWidth || container.offsetWidth,
                            height: container.style.pixelHeight || container.offsetHeight
                        };
                    } else {
                        return {container: container, width: y, height: w};
                    }
                }
            } else {
                return {container: 1, x: x, y: y, width: w, height: h};
            }
        },
        plugins = function (con, add) {
            var that = this;
            for (var prop in add) {
                if (add[has](prop) && !(prop in con)) {
                    switch (typeof add[prop]) {
                        case "function":
                            (function (f) {
                                con[prop] = con === that ? f : function () { return f[apply](that, arguments); };
                            })(add[prop]);
                        break;
                        case "object":
                            con[prop] = con[prop] || {};
                            plugins.call(this, con[prop], add[prop]);
                        break;
                        default:
                            con[prop] = add[prop];
                        break;
                    }
                }
            }
        },
        tear = function (el, paper) {
            el == paper.top && (paper.top = el.prev);
            el == paper.bottom && (paper.bottom = el.next);
            el.next && (el.next.prev = el.prev);
            el.prev && (el.prev.next = el.next);
        },
        tofront = function (el, paper) {
            if (paper.top === el) {
                return;
            }
            tear(el, paper);
            el.next = null;
            el.prev = paper.top;
            paper.top.next = el;
            paper.top = el;
        },
        toback = function (el, paper) {
            if (paper.bottom === el) {
                return;
            }
            tear(el, paper);
            el.next = paper.bottom;
            el.prev = null;
            paper.bottom.prev = el;
            paper.bottom = el;
        },
        insertafter = function (el, el2, paper) {
            tear(el, paper);
            el2 == paper.top && (paper.top = el);
            el2.next && (el2.next.prev = el);
            el.next = el2.next;
            el.prev = el2;
            el2.next = el;
        },
        insertbefore = function (el, el2, paper) {
            tear(el, paper);
            el2 == paper.bottom && (paper.bottom = el);
            el2.prev && (el2.prev.next = el);
            el.prev = el2.prev;
            el2.prev = el;
            el.next = el2;
        },
        removed = function (methodname) {
            return function () {
                throw new Error("Rapha\xebl: you are calling to method \u201c" + methodname + "\u201d of removed object");
            };
        },
        radial_gradient = /^r(?:\(([^,]+?)\s*,\s*([^\)]+?)\))?/;
 
    // SVG
    if (R.svg) {
        Paper[proto].svgns = "http://www.w3.org/2000/svg";
        Paper[proto].xlink = "http://www.w3.org/1999/xlink";
        round = function (num) {
            return +num + (~~num === num) * .5;
        };
        var $ = function (el, attr) {
            if (attr) {
                for (var key in attr) {
                    if (attr[has](key)) {
                        el[setAttribute](key, attr[key] + E);
                    }
                }
            } else {
                el = doc.createElementNS(Paper[proto].svgns, el);
                el.style.webkitTapHighlightColor = "rgba(0,0,0,0)";
                return el;
            }
        };
        R[toString] = function () {
            return  "Your browser supports SVG.\nYou are running Rapha\xebl " + this.version;
        };
        var thePath = function (pathString, SVG) {
            var el = $("path");
            SVG.canvas && SVG.canvas[appendChild](el);
            var p = new Element(el, SVG);
            p.type = "path";
            setFillAndStroke(p, {fill: "none", stroke: "#000", path: pathString});
            return p;
        };
        var addGradientFill = function (o, gradient, SVG) {
            var type = "linear",
                fx = .5, fy = .5,
                s = o.style;
            gradient = (gradient + E)[rp](radial_gradient, function (all, _fx, _fy) {
                type = "radial";
                if (_fx && _fy) {
                    fx = toFloat(_fx);
                    fy = toFloat(_fy);
                    var dir = ((fy > .5) * 2 - 1);
                    pow(fx - .5, 2) + pow(fy - .5, 2) > .25 &&
                        (fy = math.sqrt(.25 - pow(fx - .5, 2)) * dir + .5) &&
                        fy != .5 &&
                        (fy = fy.toFixed(5) - 1e-5 * dir);
                }
                return E;
            });
            gradient = gradient[split](/\s*\-\s*/);
            if (type == "linear") {
                var angle = gradient.shift();
                angle = -toFloat(angle);
                if (isNaN(angle)) {
                    return null;
                }
                var vector = [0, 0, math.cos(angle * math.PI / 180), math.sin(angle * math.PI / 180)],
                    max = 1 / (mmax(math.abs(vector[2]), math.abs(vector[3])) || 1);
                vector[2] *= max;
                vector[3] *= max;
                if (vector[2] < 0) {
                    vector[0] = -vector[2];
                    vector[2] = 0;
                }
                if (vector[3] < 0) {
                    vector[1] = -vector[3];
                    vector[3] = 0;
                }
            }
            var dots = parseDots(gradient);
            if (!dots) {
                return null;
            }
            var id = o.getAttribute(fillString);
            id = id.match(/^url\(#(.*)\)$/);
            id && SVG.defs.removeChild(doc.getElementById(id[1]));
            
            var el = $(type + "Gradient");
            el.id = "r" + (R._id++)[toString](36);
            $(el, type == "radial" ? {fx: fx, fy: fy} : {x1: vector[0], y1: vector[1], x2: vector[2], y2: vector[3]});
            SVG.defs[appendChild](el);
            for (var i = 0, ii = dots[length]; i < ii; i++) {
                var stop = $("stop");
                $(stop, {
                    offset: dots[i].offset ? dots[i].offset : !i ? "0%" : "100%",
                    "stop-color": dots[i].color || "#fff"
                });
                el[appendChild](stop);
            }
            $(o, {
                fill: "url(#" + el.id + ")",
                opacity: 1,
                "fill-opacity": 1
            });
            s.fill = E;
            s.opacity = 1;
            s.fillOpacity = 1;
            return 1;
        };
        var updatePosition = function (o) {
            var bbox = o.getBBox();
            $(o.pattern, {patternTransform: R.format("translate({0},{1})", bbox.x, bbox.y)});
        };
        var setFillAndStroke = function (o, params) {
            var dasharray = {
                    "": [0],
                    "none": [0],
                    "-": [3, 1],
                    ".": [1, 1],
                    "-.": [3, 1, 1, 1],
                    "-..": [3, 1, 1, 1, 1, 1],
                    ". ": [1, 3],
                    "- ": [4, 3],
                    "--": [8, 3],
                    "- .": [4, 3, 1, 3],
                    "--.": [8, 3, 1, 3],
                    "--..": [8, 3, 1, 3, 1, 3]
                },
                node = o.node,
                attrs = o.attrs,
                rot = o.rotate(),
                addDashes = function (o, value) {
                    value = dasharray[lowerCase.call(value)];
                    if (value) {
                        var width = o.attrs["stroke-width"] || "1",
                            butt = {round: width, square: width, butt: 0}[o.attrs["stroke-linecap"] || params["stroke-linecap"]] || 0,
                            dashes = [];
                        var i = value[length];
                        while (i--) {
                            dashes[i] = value[i] * width + ((i % 2) ? 1 : -1) * butt;
                        }
                        $(node, {"stroke-dasharray": dashes[join](",")});
                    }
                };
            params[has]("rotation") && (rot = params.rotation);
            var rotxy = (rot + E)[split](separator);
            if (!(rotxy.length - 1)) {
                rotxy = null;
            } else {
                rotxy[1] = +rotxy[1];
                rotxy[2] = +rotxy[2];
            }
            toFloat(rot) && o.rotate(0, true);
            for (var att in params) {
                if (params[has](att)) {
                    if (!availableAttrs[has](att)) {
                        continue;
                    }
                    var value = params[att];
                    attrs[att] = value;
                    switch (att) {
                        case "blur":
                            o.blur(value);
                            break;
                        case "rotation":
                            o.rotate(value, true);
                            break;
                        case "href":
                        case "title":
                        case "target":
                            var pn = node.parentNode;
                            if (lowerCase.call(pn.tagName) != "a") {
                                var hl = $("a");
                                pn.insertBefore(hl, node);
                                hl[appendChild](node);
                                pn = hl;
                            }
                            pn.setAttributeNS(o.paper.xlink, att, value);
                            break;
                        case "cursor":
                            node.style.cursor = value;
                            break;
                        case "clip-rect":
                            var rect = (value + E)[split](separator);
                            if (rect[length] == 4) {
                                o.clip && o.clip.parentNode.parentNode.removeChild(o.clip.parentNode);
                                var el = $("clipPath"),
                                    rc = $("rect");
                                el.id = "r" + (R._id++)[toString](36);
                                $(rc, {
                                    x: rect[0],
                                    y: rect[1],
                                    width: rect[2],
                                    height: rect[3]
                                });
                                el[appendChild](rc);
                                o.paper.defs[appendChild](el);
                                $(node, {"clip-path": "url(#" + el.id + ")"});
                                o.clip = rc;
                            }
                            if (!value) {
                                var clip = doc.getElementById(node.getAttribute("clip-path")[rp](/(^url\(#|\)$)/g, E));
                                clip && clip.parentNode.removeChild(clip);
                                $(node, {"clip-path": E});
                                delete o.clip;
                            }
                        break;
                        case "path":
                            if (o.type == "path") {
                                $(node, {d: value ? attrs.path = pathToAbsolute(value) : "M0,0"});
                            }
                            break;
                        case "width":
                            node[setAttribute](att, value);
                            if (attrs.fx) {
                                att = "x";
                                value = attrs.x;
                            } else {
                                break;
                            }
                        case "x":
                            if (attrs.fx) {
                                value = -attrs.x - (attrs.width || 0);
                            }
                        case "rx":
                            if (att == "rx" && o.type == "rect") {
                                break;
                            }
                        case "cx":
                            rotxy && (att == "x" || att == "cx") && (rotxy[1] += value - attrs[att]);
                            node[setAttribute](att, round(value));
                            o.pattern && updatePosition(o);
                            break;
                        case "height":
                            node[setAttribute](att, value);
                            if (attrs.fy) {
                                att = "y";
                                value = attrs.y;
                            } else {
                                break;
                            }
                        case "y":
                            if (attrs.fy) {
                                value = -attrs.y - (attrs.height || 0);
                            }
                        case "ry":
                            if (att == "ry" && o.type == "rect") {
                                break;
                            }
                        case "cy":
                            rotxy && (att == "y" || att == "cy") && (rotxy[2] += value - attrs[att]);
                            node[setAttribute](att, round(value));
                            o.pattern && updatePosition(o);
                            break;
                        case "r":
                            if (o.type == "rect") {
                                $(node, {rx: value, ry: value});
                            } else {
                                node[setAttribute](att, value);
                            }
                            break;
                        case "src":
                            if (o.type == "image") {
                                node.setAttributeNS(o.paper.xlink, "href", value);
                            }
                            break;
                        case "stroke-width":
                            node.style.strokeWidth = value;
                            // Need following line for Firefox
                            node[setAttribute](att, value);
                            if (attrs["stroke-dasharray"]) {
                                addDashes(o, attrs["stroke-dasharray"]);
                            }
                            break;
                        case "stroke-dasharray":
                            addDashes(o, value);
                            break;
                        case "translation":
                            var xy = (value + E)[split](separator);
                            xy[0] = +xy[0] || 0;
                            xy[1] = +xy[1] || 0;
                            if (rotxy) {
                                rotxy[1] += xy[0];
                                rotxy[2] += xy[1];
                            }
                            translate.call(o, xy[0], xy[1]);
                            break;
                        case "scale":
                            xy = (value + E)[split](separator);
                            o.scale(+xy[0] || 1, +xy[1] || +xy[0] || 1, isNaN(toFloat(xy[2])) ? null : +xy[2], isNaN(toFloat(xy[3])) ? null : +xy[3]);
                            break;
                        case fillString:
                            var isURL = (value + E).match(ISURL);
                            if (isURL) {
                                el = $("pattern");
                                var ig = $("image");
                                el.id = "r" + (R._id++)[toString](36);
                                $(el, {x: 0, y: 0, patternUnits: "userSpaceOnUse", height: 1, width: 1});
                                $(ig, {x: 0, y: 0});
                                ig.setAttributeNS(o.paper.xlink, "href", isURL[1]);
                                el[appendChild](ig);
 
                                var img = doc.createElement("img");
                                img.style.cssText = "position:absolute;left:-9999em;top-9999em";
                                img.onload = function () {
                                    $(el, {width: this.offsetWidth, height: this.offsetHeight});
                                    $(ig, {width: this.offsetWidth, height: this.offsetHeight});
                                    doc.body.removeChild(this);
                                    o.paper.safari();
                                };
                                doc.body[appendChild](img);
                                img.src = isURL[1];
                                o.paper.defs[appendChild](el);
                                node.style.fill = "url(#" + el.id + ")";
                                $(node, {fill: "url(#" + el.id + ")"});
                                o.pattern = el;
                                o.pattern && updatePosition(o);
                                break;
                            }
                            var clr = R.getRGB(value);
                            if (!clr.error) {
                                delete params.gradient;
                                delete attrs.gradient;
                                !R.is(attrs.opacity, "undefined") &&
                                    R.is(params.opacity, "undefined") &&
                                    $(node, {opacity: attrs.opacity});
                                !R.is(attrs["fill-opacity"], "undefined") &&
                                    R.is(params["fill-opacity"], "undefined") &&
                                    $(node, {"fill-opacity": attrs["fill-opacity"]});
                            } else if ((({circle: 1, ellipse: 1})[has](o.type) || (value + E).charAt() != "r") && addGradientFill(node, value, o.paper)) {
                                attrs.gradient = value;
                                attrs.fill = "none";
                                break;
                            }
                            clr[has]("o") && $(node, {"fill-opacity": clr.o / 100});
                        case "stroke":
                            clr = R.getRGB(value);
                            node[setAttribute](att, clr.hex);
                            att == "stroke" && clr[has]("o") && $(node, {"stroke-opacity": clr.o / 100});
                            break;
                        case "gradient":
                            (({circle: 1, ellipse: 1})[has](o.type) || (value + E).charAt() != "r") && addGradientFill(node, value, o.paper);
                            break;
                        case "opacity":
                        case "fill-opacity":
                            if (attrs.gradient) {
                                var gradient = doc.getElementById(node.getAttribute(fillString)[rp](/^url\(#|\)$/g, E));
                                if (gradient) {
                                    var stops = gradient.getElementsByTagName("stop");
                                    stops[stops[length] - 1][setAttribute]("stop-opacity", value);
                                }
                                break;
                            }
                        default:
                            att == "font-size" && (value = toInt(value, 10) + "px");
                            var cssrule = att[rp](/(\-.)/g, function (w) {
                                return upperCase.call(w.substring(1));
                            });
                            node.style[cssrule] = value;
                            // Need following line for Firefox
                            node[setAttribute](att, value);
                            break;
                    }
                }
            }
            
            tuneText(o, params);
            if (rotxy) {
                o.rotate(rotxy.join(S));
            } else {
                toFloat(rot) && o.rotate(rot, true);
            }
        };
        var leading = 1.2,
        tuneText = function (el, params) {
            if (el.type != "text" || !(params[has]("text") || params[has]("font") || params[has]("font-size") || params[has]("x") || params[has]("y"))) {
                return;
            }
            var a = el.attrs,
                node = el.node,
                fontSize = node.firstChild ? toInt(doc.defaultView.getComputedStyle(node.firstChild, E).getPropertyValue("font-size"), 10) : 10;
 
            if (params[has]("text")) {
                a.text = params.text;
                while (node.firstChild) {
                    node.removeChild(node.firstChild);
                }
                var texts = (params.text + E)[split]("\n");
                for (var i = 0, ii = texts[length]; i < ii; i++) if (texts[i]) {
                    var tspan = $("tspan");
                    i && $(tspan, {dy: fontSize * leading, x: a.x});
                    tspan[appendChild](doc.createTextNode(texts[i]));
                    node[appendChild](tspan);
                }
            } else {
                texts = node.getElementsByTagName("tspan");
                for (i = 0, ii = texts[length]; i < ii; i++) {
                    i && $(texts[i], {dy: fontSize * leading, x: a.x});
                }
            }
            $(node, {y: a.y});
            var bb = el.getBBox(),
                dif = a.y - (bb.y + bb.height / 2);
            dif && isFinite(dif) && $(node, {y: a.y + dif});
        },
        Element = function (node, svg) {
            var X = 0,
                Y = 0;
            this[0] = node;
            this.id = R._oid++;
            this.node = node;
            node.raphael = this;
            this.paper = svg;
            this.attrs = this.attrs || {};
            this.transformations = []; // rotate, translate, scale
            this._ = {
                tx: 0,
                ty: 0,
                rt: {deg: 0, cx: 0, cy: 0},
                sx: 1,
                sy: 1
            };
            !svg.bottom && (svg.bottom = this);
            this.prev = svg.top;
            svg.top && (svg.top.next = this);
            svg.top = this;
            this.next = null;
        };
        Element[proto].rotate = function (deg, cx, cy) {
            if (this.removed) {
                return this;
            }
            if (deg == null) {
                if (this._.rt.cx) {
                    return [this._.rt.deg, this._.rt.cx, this._.rt.cy][join](S);
                }
                return this._.rt.deg;
            }
            var bbox = this.getBBox();
            deg = (deg + E)[split](separator);
            if (deg[length] - 1) {
                cx = toFloat(deg[1]);
                cy = toFloat(deg[2]);
            }
            deg = toFloat(deg[0]);
            if (cx != null) {
                this._.rt.deg = deg;
            } else {
                this._.rt.deg += deg;
            }
            (cy == null) && (cx = null);
            this._.rt.cx = cx;
            this._.rt.cy = cy;
            cx = cx == null ? bbox.x + bbox.width / 2 : cx;
            cy = cy == null ? bbox.y + bbox.height / 2 : cy;
            if (this._.rt.deg) {
                this.transformations[0] = R.format("rotate({0} {1} {2})", this._.rt.deg, cx, cy);
                this.clip && $(this.clip, {transform: R.format("rotate({0} {1} {2})", -this._.rt.deg, cx, cy)});
            } else {
                this.transformations[0] = E;
                this.clip && $(this.clip, {transform: E});
            }
            $(this.node, {transform: this.transformations[join](S)});
            return this;
        };
        Element[proto].hide = function () {
            !this.removed && (this.node.style.display = "none");
            return this;
        };
        Element[proto].show = function () {
            !this.removed && (this.node.style.display = "");
            return this;
        };
        Element[proto].remove = function () {
            if (this.removed) {
                return;
            }
            tear(this, this.paper);
            this.node.parentNode.removeChild(this.node);
            for (var i in this) {
                delete this[i];
            }
            this.removed = true;
        };
        Element[proto].getBBox = function () {
            if (this.removed) {
                return this;
            }
            if (this.type == "path") {
                return pathDimensions(this.attrs.path);
            }
            if (this.node.style.display == "none") {
                this.show();
                var hide = true;
            }
            var bbox = {};
            try {
                bbox = this.node.getBBox();
            } catch(e) {
                // Firefox 3.0.x plays badly here
            } finally {
                bbox = bbox || {};
            }
            if (this.type == "text") {
                bbox = {x: bbox.x, y: Infinity, width: 0, height: 0};
                for (var i = 0, ii = this.node.getNumberOfChars(); i < ii; i++) {
                    var bb = this.node.getExtentOfChar(i);
                    (bb.y < bbox.y) && (bbox.y = bb.y);
                    (bb.y + bb.height - bbox.y > bbox.height) && (bbox.height = bb.y + bb.height - bbox.y);
                    (bb.x + bb.width - bbox.x > bbox.width) && (bbox.width = bb.x + bb.width - bbox.x);
                }
            }
            hide && this.hide();
            return bbox;
        };
        Element[proto].attr = function (name, value) {
            if (this.removed) {
                return this;
            }
            if (name == null) {
                var res = {};
                for (var i in this.attrs) if (this.attrs[has](i)) {
                    res[i] = this.attrs[i];
                }
                this._.rt.deg && (res.rotation = this.rotate());
                (this._.sx != 1 || this._.sy != 1) && (res.scale = this.scale());
                res.gradient && res.fill == "none" && (res.fill = res.gradient) && delete res.gradient;
                return res;
            }
            if (value == null && R.is(name, string)) {
                if (name == "translation") {
                    return translate.call(this);
                }
                if (name == "rotation") {
                    return this.rotate();
                }
                if (name == "scale") {
                    return this.scale();
                }
                if (name == fillString && this.attrs.fill == "none" && this.attrs.gradient) {
                    return this.attrs.gradient;
                }
                return this.attrs[name];
            }
            if (value == null && R.is(name, array)) {
                var values = {};
                for (var j = 0, jj = name.length; j < jj; j++) {
                    values[name[j]] = this.attr(name[j]);
                }
                return values;
            }
            if (value != null) {
                var params = {};
                params[name] = value;
                setFillAndStroke(this, params);
            } else if (name != null && R.is(name, "object")) {
                setFillAndStroke(this, name);
            }
            return this;
        };
        Element[proto].toFront = function () {
            if (this.removed) {
                return this;
            }
            this.node.parentNode[appendChild](this.node);
            var svg = this.paper;
            svg.top != this && tofront(this, svg);
            return this;
        };
        Element[proto].toBack = function () {
            if (this.removed) {
                return this;
            }
            if (this.node.parentNode.firstChild != this.node) {
                this.node.parentNode.insertBefore(this.node, this.node.parentNode.firstChild);
                toback(this, this.paper);
                var svg = this.paper;
            }
            return this;
        };
        Element[proto].insertAfter = function (element) {
            if (this.removed) {
                return this;
            }
            var node = element.node;
            if (node.nextSibling) {
                node.parentNode.insertBefore(this.node, node.nextSibling);
            } else {
                node.parentNode[appendChild](this.node);
            }
            insertafter(this, element, this.paper);
            return this;
        };
        Element[proto].insertBefore = function (element) {
            if (this.removed) {
                return this;
            }
            var node = element.node;
            node.parentNode.insertBefore(this.node, node);
            insertbefore(this, element, this.paper);
            return this;
        };
        Element[proto].blur = function (size) {
            // Experimental. No Safari support. Use it on your own risk.
            var t = this;
            if (+size !== 0) {
                var fltr = $("filter"),
                    blur = $("feGaussianBlur");
                t.attrs.blur = size;
                fltr.id = "r" + (R._id++)[toString](36);
                $(blur, {stdDeviation: +size || 1.5});
                fltr.appendChild(blur);
                t.paper.defs.appendChild(fltr);
                t._blur = fltr;
                $(t.node, {filter: "url(#" + fltr.id + ")"});
            } else {
                if (t._blur) {
                    t._blur.parentNode.removeChild(t._blur);
                    delete t._blur;
                    delete t.attrs.blur;
                }
                t.node.removeAttribute("filter");
            }
        };
        var theCircle = function (svg, x, y, r) {
            x = round(x);
            y = round(y);
            var el = $("circle");
            svg.canvas && svg.canvas[appendChild](el);
            var res = new Element(el, svg);
            res.attrs = {cx: x, cy: y, r: r, fill: "none", stroke: "#000"};
            res.type = "circle";
            $(el, res.attrs);
            return res;
        };
        var theRect = function (svg, x, y, w, h, r) {
            x = round(x);
            y = round(y);
            var el = $("rect");
            svg.canvas && svg.canvas[appendChild](el);
            var res = new Element(el, svg);
            res.attrs = {x: x, y: y, width: w, height: h, r: r || 0, rx: r || 0, ry: r || 0, fill: "none", stroke: "#000"};
            res.type = "rect";
            $(el, res.attrs);
            return res;
        };
        var theEllipse = function (svg, x, y, rx, ry) {
            x = round(x);
            y = round(y);
            var el = $("ellipse");
            svg.canvas && svg.canvas[appendChild](el);
            var res = new Element(el, svg);
            res.attrs = {cx: x, cy: y, rx: rx, ry: ry, fill: "none", stroke: "#000"};
            res.type = "ellipse";
            $(el, res.attrs);
            return res;
        };
        var theImage = function (svg, src, x, y, w, h) {
            var el = $("image");
            $(el, {x: x, y: y, width: w, height: h, preserveAspectRatio: "none"});
            el.setAttributeNS(svg.xlink, "href", src);
            svg.canvas && svg.canvas[appendChild](el);
            var res = new Element(el, svg);
            res.attrs = {x: x, y: y, width: w, height: h, src: src};
            res.type = "image";
            return res;
        };
        var theText = function (svg, x, y, text) {
            var el = $("text");
            $(el, {x: x, y: y, "text-anchor": "middle"});
            svg.canvas && svg.canvas[appendChild](el);
            var res = new Element(el, svg);
            res.attrs = {x: x, y: y, "text-anchor": "middle", text: text, font: availableAttrs.font, stroke: "none", fill: "#000"};
            res.type = "text";
            setFillAndStroke(res, res.attrs);
            return res;
        };
        var setSize = function (width, height) {
            this.width = width || this.width;
            this.height = height || this.height;
            this.canvas[setAttribute]("width", this.width);
            this.canvas[setAttribute]("height", this.height);
            return this;
        };
        var create = function () {
            var con = getContainer[apply](0, arguments),
                container = con && con.container,
                x = con.x,
                y = con.y,
                width = con.width,
                height = con.height;
            if (!container) {
                throw new Error("SVG container not found.");
            }
            var cnvs = $("svg");
            x = x || 0;
            y = y || 0;
            width = width || 512;
            height = height || 342;
            $(cnvs, {
                xmlns: "http://www.w3.org/2000/svg",
                version: 1.1,
                width: width,
                height: height
            });
            if (container == 1) {
                cnvs.style.cssText = "position:absolute;left:" + x + "px;top:" + y + "px";
                doc.body[appendChild](cnvs);
            } else {
                if (container.firstChild) {
                    container.insertBefore(cnvs, container.firstChild);
                } else {
                    container[appendChild](cnvs);
                }
            }
            container = new Paper;
            container.width = width;
            container.height = height;
            container.canvas = cnvs;
            plugins.call(container, container, R.fn);
            container.clear();
            return container;
        };
        Paper[proto].clear = function () {
            var c = this.canvas;
            while (c.firstChild) {
                c.removeChild(c.firstChild);
            }
            this.bottom = this.top = null;
            (this.desc = $("desc"))[appendChild](doc.createTextNode("Created with Rapha\xebl"));
            c[appendChild](this.desc);
            c[appendChild](this.defs = $("defs"));
        };
        Paper[proto].remove = function () {
            this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
            for (var i in this) {
                this[i] = removed(i);
            }
        };
    }

    // VML
    if (R.vml) {
        var map = {M: "m", L: "l", C: "c", Z: "x", m: "t", l: "r", c: "v", z: "x"},
            bites = /([clmz]),?([^clmz]*)/gi,
            val = /-?[^,\s-]+/g,
            coordsize = 1e3 + S + 1e3,
            zoom = 10,
            pathlike = {path: 1, rect: 1},
            path2vml = function (path) {
                var total =  /[ahqstv]/ig,
                    command = pathToAbsolute;
                (path + E).match(total) && (command = path2curve);
                total = /[clmz]/g;
                if (command == pathToAbsolute && !(path + E).match(total)) {
                    var res = (path + E)[rp](bites, function (all, command, args) {
                        var vals = [],
                            isMove = lowerCase.call(command) == "m",
                            res = map[command];
                        args[rp](val, function (value) {
                            if (isMove && vals[length] == 2) {
                                res += vals + map[command == "m" ? "l" : "L"];
                                vals = [];
                            }
                            vals[push](round(value * zoom));
                        });
                        return res + vals;
                    });
                    return res;
                }
                var pa = command(path), p, r;
                res = [];
                for (var i = 0, ii = pa[length]; i < ii; i++) {
                    p = pa[i];
                    r = lowerCase.call(pa[i][0]);
                    r == "z" && (r = "x");
                    for (var j = 1, jj = p[length]; j < jj; j++) {
                        r += round(p[j] * zoom) + (j != jj - 1 ? "," : E);
                    }
                    res[push](r);
                }
                return res[join](S);
            };
        
        R[toString] = function () {
            return  "Your browser doesn\u2019t support SVG. Falling down to VML.\nYou are running Rapha\xebl " + this.version;
        };
        thePath = function (pathString, vml) {
            var g = createNode("group");
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = vml.coordsize;
            g.coordorigin = vml.coordorigin;
            var el = createNode("shape"), ol = el.style;
            ol.width = vml.width + "px";
            ol.height = vml.height + "px";
            el.coordsize = coordsize;
            el.coordorigin = vml.coordorigin;
            g[appendChild](el);
            var p = new Element(el, g, vml),
                attr = {fill: "none", stroke: "#000"};
            pathString && (attr.path = pathString);
            p.isAbsolute = true;
            p.type = "path";
            p.path = [];
            p.Path = E;
            setFillAndStroke(p, attr);
            vml.canvas[appendChild](g);
            return p;
        };
        setFillAndStroke = function (o, params) {
            o.attrs = o.attrs || {};
            var node = o.node,
                a = o.attrs,
                s = node.style,
                xy,
                newpath = (params.x != a.x || params.y != a.y || params.width != a.width || params.height != a.height || params.r != a.r) && o.type == "rect",
                res = o;
            
            for (var par in params) if (params[has](par)) {
                a[par] = params[par];
            }
            if (newpath) {
                a.path = rectPath(a.x, a.y, a.width, a.height, a.r);
                o.X = a.x;
                o.Y = a.y;
                o.W = a.width;
                o.H = a.height;
            }
            params.href && (node.href = params.href);
            params.title && (node.title = params.title);
            params.target && (node.target = params.target);
            params.cursor && (s.cursor = params.cursor);
            "blur" in params && o.blur(params.blur);
            if (params.path && o.type == "path" || newpath) {
                    node.path = path2vml(a.path);
            }
            if (params.rotation != null) {
                o.rotate(params.rotation, true);
            }
            if (params.translation) {
                xy = (params.translation + E)[split](separator);
                translate.call(o, xy[0], xy[1]);
                if (o._.rt.cx != null) {
                    o._.rt.cx +=+ xy[0];
                    o._.rt.cy +=+ xy[1];
                    o.setBox(o.attrs, xy[0], xy[1]);
                }
            }
            if (params.scale) {
                xy = (params.scale + E)[split](separator);
                o.scale(+xy[0] || 1, +xy[1] || +xy[0] || 1, +xy[2] || null, +xy[3] || null);
            }
            if ("clip-rect" in params) {
                var rect = (params["clip-rect"] + E)[split](separator);
                if (rect[length] == 4) {
                    rect[2] = +rect[2] + (+rect[0]);
                    rect[3] = +rect[3] + (+rect[1]);
                    var div = node.clipRect || doc.createElement("div"),
                        dstyle = div.style,
                        group = node.parentNode;
                    dstyle.clip = R.format("rect({1}px {2}px {3}px {0}px)", rect);
                    if (!node.clipRect) {
                        dstyle.position = "absolute";
                        dstyle.top = 0;
                        dstyle.left = 0;
                        dstyle.width = o.paper.width + "px";
                        dstyle.height = o.paper.height + "px";
                        group.parentNode.insertBefore(div, group);
                        div[appendChild](group);
                        node.clipRect = div;
                    }
                }
                if (!params["clip-rect"]) {
                    node.clipRect && (node.clipRect.style.clip = E);
                }
            }
            if (o.type == "image" && params.src) {
                node.src = params.src;
            }
            if (o.type == "image" && params.opacity) {
                node.filterOpacity = ms + ".Alpha(opacity=" + (params.opacity * 100) + ")";
                s.filter = (node.filterMatrix || E) + (node.filterOpacity || E);
            }
            params.font && (s.font = params.font);
            params["font-family"] && (s.fontFamily = '"' + params["font-family"][split](",")[0][rp](/^['"]+|['"]+$/g, E) + '"');
            params["font-size"] && (s.fontSize = params["font-size"]);
            params["font-weight"] && (s.fontWeight = params["font-weight"]);
            params["font-style"] && (s.fontStyle = params["font-style"]);
            if (params.opacity != null || 
                params["stroke-width"] != null ||
                params.fill != null ||
                params.stroke != null ||
                params["stroke-width"] != null ||
                params["stroke-opacity"] != null ||
                params["fill-opacity"] != null ||
                params["stroke-dasharray"] != null ||
                params["stroke-miterlimit"] != null ||
                params["stroke-linejoin"] != null ||
                params["stroke-linecap"] != null) {
                node = o.shape || node;
                var fill = (node.getElementsByTagName(fillString) && node.getElementsByTagName(fillString)[0]),
                    newfill = false;
                !fill && (newfill = fill = createNode(fillString));
                if ("fill-opacity" in params || "opacity" in params) {
                    var opacity = ((+a["fill-opacity"] + 1 || 2) - 1) * ((+a.opacity + 1 || 2) - 1) * ((+R.getRGB(params.fill).o + 1 || 2) - 1);
                    opacity < 0 && (opacity = 0);
                    opacity > 1 && (opacity = 1);
                    fill.opacity = opacity;
                }
                params.fill && (fill.on = true);
                if (fill.on == null || params.fill == "none") {
                    fill.on = false;
                }
                if (fill.on && params.fill) {
                    var isURL = params.fill.match(ISURL);
                    if (isURL) {
                        fill.src = isURL[1];
                        fill.type = "tile";
                    } else {
                        fill.color = R.getRGB(params.fill).hex;
                        fill.src = E;
                        fill.type = "solid";
                        if (R.getRGB(params.fill).error && (res.type in {circle: 1, ellipse: 1} || (params.fill + E).charAt() != "r") && addGradientFill(res, params.fill)) {
                            a.fill = "none";
                            a.gradient = params.fill;
                        }
                    }
                }
                newfill && node[appendChild](fill);
                var stroke = (node.getElementsByTagName("stroke") && node.getElementsByTagName("stroke")[0]),
                newstroke = false;
                !stroke && (newstroke = stroke = createNode("stroke"));
                if ((params.stroke && params.stroke != "none") ||
                    params["stroke-width"] ||
                    params["stroke-opacity"] != null ||
                    params["stroke-dasharray"] ||
                    params["stroke-miterlimit"] ||
                    params["stroke-linejoin"] ||
                    params["stroke-linecap"]) {
                    stroke.on = true;
                }
                (params.stroke == "none" || stroke.on == null || params.stroke == 0 || params["stroke-width"] == 0) && (stroke.on = false);
                var strokeColor = R.getRGB(params.stroke);
                stroke.on && params.stroke && (stroke.color = strokeColor.hex);
                opacity = ((+a["stroke-opacity"] + 1 || 2) - 1) * ((+a.opacity + 1 || 2) - 1) * ((+strokeColor.o + 1 || 2) - 1);
                var width = (toFloat(params["stroke-width"]) || 1) * .75;
                opacity < 0 && (opacity = 0);
                opacity > 1 && (opacity = 1);
                params["stroke-width"] == null && (width = a["stroke-width"]);
                params["stroke-width"] && (stroke.weight = width);
                width && width < 1 && (opacity *= width) && (stroke.weight = 1);
                stroke.opacity = opacity;
                
                params["stroke-linejoin"] && (stroke.joinstyle = params["stroke-linejoin"] || "miter");
                stroke.miterlimit = params["stroke-miterlimit"] || 8;
                params["stroke-linecap"] && (stroke.endcap = params["stroke-linecap"] == "butt" ? "flat" : params["stroke-linecap"] == "square" ? "square" : "round");
                if (params["stroke-dasharray"]) {
                    var dasharray = {
                        "-": "shortdash",
                        ".": "shortdot",
                        "-.": "shortdashdot",
                        "-..": "shortdashdotdot",
                        ". ": "dot",
                        "- ": "dash",
                        "--": "longdash",
                        "- .": "dashdot",
                        "--.": "longdashdot",
                        "--..": "longdashdotdot"
                    };
                    stroke.dashstyle = dasharray[has](params["stroke-dasharray"]) ? dasharray[params["stroke-dasharray"]] : E;
                }
                newstroke && node[appendChild](stroke);
            }
            if (res.type == "text") {
                s = res.paper.span.style;
                a.font && (s.font = a.font);
                a["font-family"] && (s.fontFamily = a["font-family"]);
                a["font-size"] && (s.fontSize = a["font-size"]);
                a["font-weight"] && (s.fontWeight = a["font-weight"]);
                a["font-style"] && (s.fontStyle = a["font-style"]);
                res.node.string && (res.paper.span.innerHTML = (res.node.string + E)[rp](/</g, "&#60;")[rp](/&/g, "&#38;")[rp](/\n/g, "<br>"));
                res.W = a.w = res.paper.span.offsetWidth;
                res.H = a.h = res.paper.span.offsetHeight;
                res.X = a.x;
                res.Y = a.y + round(res.H / 2);
 
                // text-anchor emulationm
                switch (a["text-anchor"]) {
                    case "start":
                        res.node.style["v-text-align"] = "left";
                        res.bbx = round(res.W / 2);
                    break;
                    case "end":
                        res.node.style["v-text-align"] = "right";
                        res.bbx = -round(res.W / 2);
                    break;
                    default:
                        res.node.style["v-text-align"] = "center";
                    break;
                }
            }
        };
        addGradientFill = function (o, gradient) {
            o.attrs = o.attrs || {};
            var attrs = o.attrs,
                fill,
                type = "linear",
                fxfy = ".5 .5";
            o.attrs.gradient = gradient;
            gradient = (gradient + E)[rp](radial_gradient, function (all, fx, fy) {
                type = "radial";
                if (fx && fy) {
                    fx = toFloat(fx);
                    fy = toFloat(fy);
                    pow(fx - .5, 2) + pow(fy - .5, 2) > .25 && (fy = math.sqrt(.25 - pow(fx - .5, 2)) * ((fy > .5) * 2 - 1) + .5);
                    fxfy = fx + S + fy;
                }
                return E;
            });
            gradient = gradient[split](/\s*\-\s*/);
            if (type == "linear") {
                var angle = gradient.shift();
                angle = -toFloat(angle);
                if (isNaN(angle)) {
                    return null;
                }
            }
            var dots = parseDots(gradient);
            if (!dots) {
                return null;
            }
            o = o.shape || o.node;
            fill = o.getElementsByTagName(fillString)[0] || createNode(fillString);
            !fill.parentNode && o.appendChild(fill);
            if (dots[length]) {
                fill.on = true;
                fill.method = "none";
                fill.color = dots[0].color;
                fill.color2 = dots[dots[length] - 1].color;
                var clrs = [];
                for (var i = 0, ii = dots[length]; i < ii; i++) {
                    dots[i].offset && clrs[push](dots[i].offset + S + dots[i].color);
                }
                fill.colors && (fill.colors.value = clrs[length] ? clrs[join]() : "0% " + fill.color);
                if (type == "radial") {
                    fill.type = "gradientradial";
                    fill.focus = "100%";
                    fill.focussize = fxfy;
                    fill.focusposition = fxfy;
                } else {
                    fill.type = "gradient";
                    fill.angle = (270 - angle) % 360;
                }
            }
            return 1;
        };
        Element = function (node, group, vml) {
            var Rotation = 0,
                RotX = 0,
                RotY = 0,
                Scale = 1;
            this[0] = node;
            this.id = R._oid++;
            this.node = node;
            node.raphael = this;
            this.X = 0;
            this.Y = 0;
            this.attrs = {};
            this.Group = group;
            this.paper = vml;
            this._ = {
                tx: 0,
                ty: 0,
                rt: {deg:0},
                sx: 1,
                sy: 1
            };
            !vml.bottom && (vml.bottom = this);
            this.prev = vml.top;
            vml.top && (vml.top.next = this);
            vml.top = this;
            this.next = null;
        };
        Element[proto].rotate = function (deg, cx, cy) {
            if (this.removed) {
                return this;
            }
            if (deg == null) {
                if (this._.rt.cx) {
                    return [this._.rt.deg, this._.rt.cx, this._.rt.cy][join](S);
                }
                return this._.rt.deg;
            }
            deg = (deg + E)[split](separator);
            if (deg[length] - 1) {
                cx = toFloat(deg[1]);
                cy = toFloat(deg[2]);
            }
            deg = toFloat(deg[0]);
            if (cx != null) {
                this._.rt.deg = deg;
            } else {
                this._.rt.deg += deg;
            }
            cy == null && (cx = null);
            this._.rt.cx = cx;
            this._.rt.cy = cy;
            this.setBox(this.attrs, cx, cy);
            this.Group.style.rotation = this._.rt.deg;
            // gradient fix for rotation. TODO
            // var fill = (this.shape || this.node).getElementsByTagName(fillString);
            // fill = fill[0] || {};
            // var b = ((360 - this._.rt.deg) - 270) % 360;
            // !R.is(fill.angle, "undefined") && (fill.angle = b);
            return this;
        };
        Element[proto].setBox = function (params, cx, cy) {
            if (this.removed) {
                return this;
            }
            var gs = this.Group.style,
                os = (this.shape && this.shape.style) || this.node.style;
            params = params || {};
            for (var i in params) if (params[has](i)) {
                this.attrs[i] = params[i];
            }
            cx = cx || this._.rt.cx;
            cy = cy || this._.rt.cy;
            var attr = this.attrs,
                x,
                y,
                w,
                h;
            switch (this.type) {
                case "circle":
                    x = attr.cx - attr.r;
                    y = attr.cy - attr.r;
                    w = h = attr.r * 2;
                    break;
                case "ellipse":
                    x = attr.cx - attr.rx;
                    y = attr.cy - attr.ry;
                    w = attr.rx * 2;
                    h = attr.ry * 2;
                    break;
                case "image":
                    x = +attr.x;
                    y = +attr.y;
                    w = attr.width || 0;
                    h = attr.height || 0;
                    break;
                case "text":
                    this.textpath.v = ["m", round(attr.x), ", ", round(attr.y - 2), "l", round(attr.x) + 1, ", ", round(attr.y - 2)][join](E);
                    x = attr.x - round(this.W / 2);
                    y = attr.y - this.H / 2;
                    w = this.W;
                    h = this.H;
                    break;
                case "rect":
                case "path":
                    if (!this.attrs.path) {
                        x = 0;
                        y = 0;
                        w = this.paper.width;
                        h = this.paper.height;
                    } else {
                        var dim = pathDimensions(this.attrs.path);
                        x = dim.x;
                        y = dim.y;
                        w = dim.width;
                        h = dim.height;
                    }
                    break;
                default:
                    x = 0;
                    y = 0;
                    w = this.paper.width;
                    h = this.paper.height;
                    break;
            }
            cx = (cx == null) ? x + w / 2 : cx;
            cy = (cy == null) ? y + h / 2 : cy;
            var left = cx - this.paper.width / 2,
                top = cy - this.paper.height / 2, t;
            gs.left != (t = left + "px") && (gs.left = t);
            gs.top != (t = top + "px") && (gs.top = t);
            this.X = pathlike[has](this.type) ? -left : x;
            this.Y = pathlike[has](this.type) ? -top : y;
            this.W = w;
            this.H = h;
            if (pathlike[has](this.type)) {
                os.left != (t = -left * zoom + "px") && (os.left = t);
                os.top != (t = -top * zoom + "px") && (os.top = t);
            } else if (this.type == "text") {
                os.left != (t = -left + "px") && (os.left = t);
                os.top != (t = -top + "px") && (os.top = t);
            } else {
                gs.width != (t = this.paper.width + "px") && (gs.width = t);
                gs.height != (t = this.paper.height + "px") && (gs.height = t);
                os.left != (t = x - left + "px") && (os.left = t);
                os.top != (t = y - top + "px") && (os.top = t);
                os.width != (t = w + "px") && (os.width = t);
                os.height != (t = h + "px") && (os.height = t);
            }
        };
        Element[proto].hide = function () {
            !this.removed && (this.Group.style.display = "none");
            return this;
        };
        Element[proto].show = function () {
            !this.removed && (this.Group.style.display = "block");
            return this;
        };
        Element[proto].getBBox = function () {
            if (this.removed) {
                return this;
            }
            if (pathlike[has](this.type)) {
                return pathDimensions(this.attrs.path);
            }
            return {
                x: this.X + (this.bbx || 0),
                y: this.Y,
                width: this.W,
                height: this.H
            };
        };
        Element[proto].remove = function () {
            if (this.removed) {
                return;
            }
            tear(this, this.paper);
            this.node.parentNode.removeChild(this.node);
            this.Group.parentNode.removeChild(this.Group);
            this.shape && this.shape.parentNode.removeChild(this.shape);
            for (var i in this) {
                delete this[i];
            }
            this.removed = true;
        };
        Element[proto].attr = function (name, value) {
            if (this.removed) {
                return this;
            }
            if (name == null) {
                var res = {};
                for (var i in this.attrs) if (this.attrs[has](i)) {
                    res[i] = this.attrs[i];
                }
                this._.rt.deg && (res.rotation = this.rotate());
                (this._.sx != 1 || this._.sy != 1) && (res.scale = this.scale());
                res.gradient && res.fill == "none" && (res.fill = res.gradient) && delete res.gradient;
                return res;
            }
            if (value == null && R.is(name, string)) {
                if (name == "translation") {
                    return translate.call(this);
                }
                if (name == "rotation") {
                    return this.rotate();
                }
                if (name == "scale") {
                    return this.scale();
                }
                if (name == fillString && this.attrs.fill == "none" && this.attrs.gradient) {
                    return this.attrs.gradient;
                }
                return this.attrs[name];
            }
            if (this.attrs && value == null && R.is(name, array)) {
                var ii, values = {};
                for (i = 0, ii = name[length]; i < ii; i++) {
                    values[name[i]] = this.attr(name[i]);
                }
                return values;
            }
            var params;
            if (value != null) {
                params = {};
                params[name] = value;
            }
            value == null && R.is(name, "object") && (params = name);
            if (params) {
                if (params.text && this.type == "text") {
                    this.node.string = params.text;
                }
                setFillAndStroke(this, params);
                if (params.gradient && (({circle: 1, ellipse: 1})[has](this.type) || (params.gradient + E).charAt() != "r")) {
                    addGradientFill(this, params.gradient);
                }
                (!pathlike[has](this.type) || this._.rt.deg) && this.setBox(this.attrs);
            }
            return this;
        };
        Element[proto].toFront = function () {
            !this.removed && this.Group.parentNode[appendChild](this.Group);
            this.paper.top != this && tofront(this, this.paper);
            return this;
        };
        Element[proto].toBack = function () {
            if (this.removed) {
                return this;
            }
            if (this.Group.parentNode.firstChild != this.Group) {
                this.Group.parentNode.insertBefore(this.Group, this.Group.parentNode.firstChild);
                toback(this, this.paper);
            }
            return this;
        };
        Element[proto].insertAfter = function (element) {
            if (this.removed) {
                return this;
            }
            if (element.Group.nextSibling) {
                element.Group.parentNode.insertBefore(this.Group, element.Group.nextSibling);
            } else {
                element.Group.parentNode[appendChild](this.Group);
            }
            insertafter(this, element, this.paper);
            return this;
        };
        Element[proto].insertBefore = function (element) {
            if (this.removed) {
                return this;
            }
            element.Group.parentNode.insertBefore(this.Group, element.Group);
            insertbefore(this, element, this.paper);
            return this;
        };
        var blurregexp = / progid:\S+Blur\([^\)]+\)/g;
        Element[proto].blur = function (size) {
            var s = this.node.style,
                f = s.filter;
            f = f.replace(blurregexp, "");
            if (+size !== 0) {
                this.attrs.blur = size;
                s.filter = f + ms + ".Blur(pixelradius=" + (+size || 1.5) + ")";
                s.margin = Raphael.format("-{0}px 0 0 -{0}px", Math.round(+size || 1.5));
            } else {
                s.filter = f;
                s.margin = 0;
                delete this.attrs.blur;
            }
        };
 
        theCircle = function (vml, x, y, r) {
            var g = createNode("group"),
                o = createNode("oval"),
                ol = o.style;
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = coordsize;
            g.coordorigin = vml.coordorigin;
            g[appendChild](o);
            var res = new Element(o, g, vml);
            res.type = "circle";
            setFillAndStroke(res, {stroke: "#000", fill: "none"});
            res.attrs.cx = x;
            res.attrs.cy = y;
            res.attrs.r = r;
            res.setBox({x: x - r, y: y - r, width: r * 2, height: r * 2});
            vml.canvas[appendChild](g);
            return res;
        };
        function rectPath(x, y, w, h, r) {
            if (r) {
                return R.format("M{0},{1}l{2},0a{3},{3},0,0,1,{3},{3}l0,{5}a{3},{3},0,0,1,{4},{3}l{6},0a{3},{3},0,0,1,{4},{4}l0,{7}a{3},{3},0,0,1,{3},{4}z", x + r, y, w - r * 2, r, -r, h - r * 2, r * 2 - w, r * 2 - h);
            } else {
                return R.format("M{0},{1}l{2},0,0,{3},{4},0z", x, y, w, h, -w);
            }
        }
        theRect = function (vml, x, y, w, h, r) {
            var path = rectPath(x, y, w, h, r),
                res = vml.path(path),
                a = res.attrs;
            res.X = a.x = x;
            res.Y = a.y = y;
            res.W = a.width = w;
            res.H = a.height = h;
            a.r = r;
            a.path = path;
            res.type = "rect";
            return res;
        };
        theEllipse = function (vml, x, y, rx, ry) {
            var g = createNode("group"),
                o = createNode("oval"),
                ol = o.style;
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = coordsize;
            g.coordorigin = vml.coordorigin;
            g[appendChild](o);
            var res = new Element(o, g, vml);
            res.type = "ellipse";
            setFillAndStroke(res, {stroke: "#000"});
            res.attrs.cx = x;
            res.attrs.cy = y;
            res.attrs.rx = rx;
            res.attrs.ry = ry;
            res.setBox({x: x - rx, y: y - ry, width: rx * 2, height: ry * 2});
            vml.canvas[appendChild](g);
            return res;
        };
        theImage = function (vml, src, x, y, w, h) {
            var g = createNode("group"),
                o = createNode("image"),
                ol = o.style;
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = coordsize;
            g.coordorigin = vml.coordorigin;
            o.src = src;
            g[appendChild](o);
            var res = new Element(o, g, vml);
            res.type = "image";
            res.attrs.src = src;
            res.attrs.x = x;
            res.attrs.y = y;
            res.attrs.w = w;
            res.attrs.h = h;
            res.setBox({x: x, y: y, width: w, height: h});
            vml.canvas[appendChild](g);
            return res;
        };
        theText = function (vml, x, y, text) {
            var g = createNode("group"),
                el = createNode("shape"),
                ol = el.style,
                path = createNode("path"),
                ps = path.style,
                o = createNode("textpath");
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = coordsize;
            g.coordorigin = vml.coordorigin;
            path.v = R.format("m{0},{1}l{2},{1}", round(x * 10), round(y * 10), round(x * 10) + 1);
            path.textpathok = true;
            ol.width = vml.width;
            ol.height = vml.height;
            o.string = text + E;
            o.on = true;
            el[appendChild](o);
            el[appendChild](path);
            g[appendChild](el);
            var res = new Element(o, g, vml);
            res.shape = el;
            res.textpath = path;
            res.type = "text";
            res.attrs.text = text;
            res.attrs.x = x;
            res.attrs.y = y;
            res.attrs.w = 1;
            res.attrs.h = 1;
            setFillAndStroke(res, {font: availableAttrs.font, stroke: "none", fill: "#000"});
            res.setBox();
            vml.canvas[appendChild](g);
            return res;
        };
        setSize = function (width, height) {
            var cs = this.canvas.style;
            width == +width && (width += "px");
            height == +height && (height += "px");
            cs.width = width;
            cs.height = height;
            cs.clip = "rect(0 " + width + " " + height + " 0)";
            return this;
        };
        var createNode;
        doc.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
        try {
            !doc.namespaces.rvml && doc.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
            createNode = function (tagName) {
                return doc.createElement('<rvml:' + tagName + ' class="rvml">');
            };
        } catch (e) {
            createNode = function (tagName) {
                return doc.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
            };
        }
        create = function () {
            var con = getContainer[apply](0, arguments),
                container = con.container,
                height = con.height,
                s,
                width = con.width,
                x = con.x,
                y = con.y;
            if (!container) {
                throw new Error("VML container not found.");
            }
            var res = new Paper,
                c = res.canvas = doc.createElement("div"),
                cs = c.style;
            x = x || 0;
            y = y || 0;
            width = width || 512;
            height = height || 342;
            width == +width && (width += "px");
            height == +height && (height += "px");
            res.width = 1e3;
            res.height = 1e3;
            res.coordsize = zoom * 1e3 + S + zoom * 1e3;
            res.coordorigin = "0 0";
            res.span = doc.createElement("span");
            res.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";
            c[appendChild](res.span);
            cs.cssText = R.format("width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden", width, height);
            if (container == 1) {
                doc.body[appendChild](c);
                cs.left = x + "px";
                cs.top = y + "px";
                cs.position = "absolute";
            } else {
                if (container.firstChild) {
                    container.insertBefore(c, container.firstChild);
                } else {
                    container[appendChild](c);
                }
            }
            plugins.call(res, res, R.fn);
            return res;
        };
        Paper[proto].clear = function () {
            this.canvas.innerHTML = E;
            this.span = doc.createElement("span");
            this.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";
            this.canvas[appendChild](this.span);
            this.bottom = this.top = null;
        };
        Paper[proto].remove = function () {
            this.canvas.parentNode.removeChild(this.canvas);
            for (var i in this) {
                this[i] = removed(i);
            }
            return true;
        };
    }
 
    // rest
    // Safari or Chrome (WebKit) rendering bug workaround method
    if ((/^Apple|^Google/).test(win.navigator.vendor) && (!(win.navigator.userAgent.indexOf("Version/4.0") + 1) || win.navigator.platform.slice(0, 2) == "iP")) {
        Paper[proto].safari = function () {
            var rect = this.rect(-99, -99, this.width + 99, this.height + 99);
            win.setTimeout(function () {rect.remove();});
        };
    } else {
        Paper[proto].safari = function () {};
    }
 
    // Events
    var preventDefault = function () {
        this.returnValue = false;
    },
    preventTouch = function () {
        return this.originalEvent.preventDefault();
    },
    stopPropagation = function () {
        this.cancelBubble = true;
    },
    stopTouch = function () {
        return this.originalEvent.stopPropagation();
    },
    addEvent = (function () {
        if (doc.addEventListener) {
            return function (obj, type, fn, element) {
                var realName = supportsTouch && touchMap[type] ? touchMap[type] : type;
                var f = function (e) {
                    if (supportsTouch && touchMap[has](type)) {
                        for (var i = 0, ii = e.targetTouches && e.targetTouches.length; i < ii; i++) {
                            if (e.targetTouches[i].target == obj) {
                                var olde = e;
                                e = e.targetTouches[i];
                                e.originalEvent = olde;
                                e.preventDefault = preventTouch;
                                e.stopPropagation = stopTouch;
                                break;
                            }
                        }
                    }
                    return fn.call(element, e);
                };
                obj.addEventListener(realName, f, false);
                return function () {
                    obj.removeEventListener(realName, f, false);
                    return true;
                };
            };
        } else if (doc.attachEvent) {
            return function (obj, type, fn, element) {
                var f = function (e) {
                    e = e || win.event;
                    e.preventDefault = e.preventDefault || preventDefault;
                    e.stopPropagation = e.stopPropagation || stopPropagation;
                    return fn.call(element, e);
                };
                obj.attachEvent("on" + type, f);
                var detacher = function () {
                    obj.detachEvent("on" + type, f);
                    return true;
                };
                return detacher;
            };
        }
    })();
    for (var i = events[length]; i--;) {
        (function (eventName) {
            R[eventName] = Element[proto][eventName] = function (fn) {
                if (R.is(fn, "function")) {
                    this.events = this.events || [];
                    this.events.push({name: eventName, f: fn, unbind: addEvent(this.shape || this.node || doc, eventName, fn, this)});
                }
                return this;
            };
            R["un" + eventName] = Element[proto]["un" + eventName] = function (fn) {
                var events = this.events,
                    l = events[length];
                while (l--) if (events[l].name == eventName && events[l].f == fn) {
                    events[l].unbind();
                    events.splice(l, 1);
                    !events.length && delete this.events;
                    return this;
                }
                return this;
            };
        })(events[i]);
    }
    Element[proto].hover = function (f_in, f_out) {
        return this.mouseover(f_in).mouseout(f_out);
    };
    Element[proto].unhover = function (f_in, f_out) {
        return this.unmouseover(f_in).unmouseout(f_out);
    };
    Element[proto].drag = function (onmove, onstart, onend) {
        this._drag = {};
        var el = this.mousedown(function (e) {
            (e.originalEvent ? e.originalEvent : e).preventDefault();
            this._drag.x = e.clientX;
            this._drag.y = e.clientY;
            this._drag.id = e.identifier;
            onstart && onstart.call(this, e.clientX, e.clientY);
            Raphael.mousemove(move).mouseup(up);
        }),
            move = function (e) {
                var x = e.clientX,
                    y = e.clientY;
                if (supportsTouch) {
                    var i = e.touches.length,
                        touch;
                    while (i--) {
                        touch = e.touches[i];
                        if (touch.identifier == el._drag.id) {
                            x = touch.clientX;
                            y = touch.clientY;
                            (e.originalEvent ? e.originalEvent : e).preventDefault();
                            break;
                        }
                    }
                } else {
                    e.preventDefault();
                }
                onmove && onmove.call(el, x - el._drag.x, y - el._drag.y, x, y);
            },
            up = function () {
                el._drag = {};
                Raphael.unmousemove(move).unmouseup(up);
                onend && onend.call(el);
            };
        return this;
    };
    Paper[proto].circle = function (x, y, r) {
        return theCircle(this, x || 0, y || 0, r || 0);
    };
    Paper[proto].rect = function (x, y, w, h, r) {
        return theRect(this, x || 0, y || 0, w || 0, h || 0, r || 0);
    };
    Paper[proto].ellipse = function (x, y, rx, ry) {
        return theEllipse(this, x || 0, y || 0, rx || 0, ry || 0);
    };
    Paper[proto].path = function (pathString) {
        pathString && !R.is(pathString, string) && !R.is(pathString[0], array) && (pathString += E);
        return thePath(R.format[apply](R, arguments), this);
    };
    Paper[proto].image = function (src, x, y, w, h) {
        return theImage(this, src || "about:blank", x || 0, y || 0, w || 0, h || 0);
    };
    Paper[proto].text = function (x, y, text) {
        return theText(this, x || 0, y || 0, text || E);
    };
    Paper[proto].set = function (itemsArray) {
        arguments[length] > 1 && (itemsArray = Array[proto].splice.call(arguments, 0, arguments[length]));
        return new Set(itemsArray);
    };
    Paper[proto].setSize = setSize;
    Paper[proto].top = Paper[proto].bottom = null;
    Paper[proto].raphael = R;
    function x_y() {
        return this.x + S + this.y;
    }
    Element[proto].resetScale = function () {
        if (this.removed) {
            return this;
        }
        this._.sx = 1;
        this._.sy = 1;
        this.attrs.scale = "1 1";
    };
    Element[proto].scale = function (x, y, cx, cy) {
        if (this.removed) {
            return this;
        }
        if (x == null && y == null) {
            return {
                x: this._.sx,
                y: this._.sy,
                toString: x_y
            };
        }
        y = y || x;
        !+y && (y = x);
        var dx,
            dy,
            dcx,
            dcy,
            a = this.attrs;
        if (x != 0) {
            var bb = this.getBBox(),
                rcx = bb.x + bb.width / 2,
                rcy = bb.y + bb.height / 2,
                kx = x / this._.sx,
                ky = y / this._.sy;
            cx = (+cx || cx == 0) ? cx : rcx;
            cy = (+cy || cy == 0) ? cy : rcy;
            var dirx = ~~(x / math.abs(x)),
                diry = ~~(y / math.abs(y)),
                s = this.node.style,
                ncx = cx + (rcx - cx) * kx,
                ncy = cy + (rcy - cy) * ky;
            switch (this.type) {
                case "rect":
                case "image":
                    var neww = a.width * dirx * kx,
                        newh = a.height * diry * ky;
                    this.attr({
                        height: newh,
                        r: a.r * mmin(dirx * kx, diry * ky),
                        width: neww,
                        x: ncx - neww / 2,
                        y: ncy - newh / 2
                    });
                    break;
                case "circle":
                case "ellipse":
                    this.attr({
                        rx: a.rx * dirx * kx,
                        ry: a.ry * diry * ky,
                        r: a.r * mmin(dirx * kx, diry * ky),
                        cx: ncx,
                        cy: ncy
                    });
                    break;
                case "text":
                    this.attr({
                        x: ncx,
                        y: ncy
                    });
                    break;
                case "path":
                    var path = pathToRelative(a.path),
                        skip = true;
                    for (var i = 0, ii = path[length]; i < ii; i++) {
                        var p = path[i],
                            P0 = upperCase.call(p[0]);
                        if (P0 == "M" && skip) {
                            continue;
                        } else {
                            skip = false;
                        }
                        if (P0 == "A") {
                            p[path[i][length] - 2] *= kx;
                            p[path[i][length] - 1] *= ky;
                            p[1] *= dirx * kx;
                            p[2] *= diry * ky;
                            p[5] = +!(dirx + diry ? !+p[5] : +p[5]);
                        } else if (P0 == "H") {
                            for (var j = 1, jj = p[length]; j < jj; j++) {
                                p[j] *= kx;
                            }
                        } else if (P0 == "V") {
                            for (j = 1, jj = p[length]; j < jj; j++) {
                                p[j] *= ky;
                            }
                         } else {
                            for (j = 1, jj = p[length]; j < jj; j++) {
                                p[j] *= (j % 2) ? kx : ky;
                            }
                        }
                    }
                    var dim2 = pathDimensions(path);
                    dx = ncx - dim2.x - dim2.width / 2;
                    dy = ncy - dim2.y - dim2.height / 2;
                    path[0][1] += dx;
                    path[0][2] += dy;
                    this.attr({path: path});
                break;
            }
            if (this.type in {text: 1, image:1} && (dirx != 1 || diry != 1)) {
                if (this.transformations) {
                    this.transformations[2] = "scale("[concat](dirx, ",", diry, ")");
                    this.node[setAttribute]("transform", this.transformations[join](S));
                    dx = (dirx == -1) ? -a.x - (neww || 0) : a.x;
                    dy = (diry == -1) ? -a.y - (newh || 0) : a.y;
                    this.attr({x: dx, y: dy});
                    a.fx = dirx - 1;
                    a.fy = diry - 1;
                } else {
                    this.node.filterMatrix = ms + ".Matrix(M11="[concat](dirx,
                        ", M12=0, M21=0, M22=", diry,
                        ", Dx=0, Dy=0, sizingmethod='auto expand', filtertype='bilinear')");
                    s.filter = (this.node.filterMatrix || E) + (this.node.filterOpacity || E);
                }
            } else {
                if (this.transformations) {
                    this.transformations[2] = E;
                    this.node[setAttribute]("transform", this.transformations[join](S));
                    a.fx = 0;
                    a.fy = 0;
                } else {
                    this.node.filterMatrix = E;
                    s.filter = (this.node.filterMatrix || E) + (this.node.filterOpacity || E);
                }
            }
            a.scale = [x, y, cx, cy][join](S);
            this._.sx = x;
            this._.sy = y;
        }
        return this;
    };
    Element[proto].clone = function () {
        if (this.removed) {
            return null;
        }
        var attr = this.attr();
        delete attr.scale;
        delete attr.translation;
        return this.paper[this.type]().attr(attr);
    };
    var getPointAtSegmentLength = cacher(function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length) {
        var len = 0,
            old;
        for (var i = 0; i < 1.001; i+=.001) {
            var dot = R.findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, i);
            i && (len += pow(pow(old.x - dot.x, 2) + pow(old.y - dot.y, 2), .5));
            if (len >= length) {
                return dot;
            }
            old = dot;
        }
    }),
    getLengthFactory = function (istotal, subpath) {
        return function (path, length, onlystart) {
            path = path2curve(path);
            var x, y, p, l, sp = "", subpaths = {}, point,
                len = 0;
            for (var i = 0, ii = path.length; i < ii; i++) {
                p = path[i];
                if (p[0] == "M") {
                    x = +p[1];
                    y = +p[2];
                } else {
                    l = segmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                    if (len + l > length) {
                        if (subpath && !subpaths.start) {
                            point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                            sp += ["C", point.start.x, point.start.y, point.m.x, point.m.y, point.x, point.y];
                            if (onlystart) {return sp;}
                            subpaths.start = sp;
                            sp = ["M", point.x, point.y + "C", point.n.x, point.n.y, point.end.x, point.end.y, p[5], p[6]][join]();
                            len += l;
                            x = +p[5];
                            y = +p[6];
                            continue;
                        }
                        if (!istotal && !subpath) {
                            point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                            return {x: point.x, y: point.y, alpha: point.alpha};
                        }
                    }
                    len += l;
                    x = +p[5];
                    y = +p[6];
                }
                sp += p;
            }
            subpaths.end = sp;
            point = istotal ? len : subpath ? subpaths : R.findDotsAtSegment(x, y, p[1], p[2], p[3], p[4], p[5], p[6], 1);
            point.alpha && (point = {x: point.x, y: point.y, alpha: point.alpha});
            return point;
        };
    },
    segmentLength = cacher(function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
        var old = {x: 0, y: 0},
            len = 0;
        for (var i = 0; i < 1.01; i+=.01) {
            var dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, i);
            i && (len += pow(pow(old.x - dot.x, 2) + pow(old.y - dot.y, 2), .5));
            old = dot;
        }
        return len;
    });
    var getTotalLength = getLengthFactory(1),
        getPointAtLength = getLengthFactory(),
        getSubpathsAtLength = getLengthFactory(0, 1);
    Element[proto].getTotalLength = function () {
        if (this.type != "path") {return;}
        if (this.node.getTotalLength) {
            return this.node.getTotalLength();
        }
        return getTotalLength(this.attrs.path);
    };
    Element[proto].getPointAtLength = function (length) {
        if (this.type != "path") {return;}
        return getPointAtLength(this.attrs.path, length);
    };
    Element[proto].getSubpath = function (from, to) {
        if (this.type != "path") {return;}
        if (math.abs(this.getTotalLength() - to) < 1e-6) {
            return getSubpathsAtLength(this.attrs.path, from).end;
        }
        var a = getSubpathsAtLength(this.attrs.path, to, 1);
        return from ? getSubpathsAtLength(a, from).end : a;
    };

    // animation easing formulas
    R.easing_formulas = {
        linear: function (n) {
            return n;
        },
        "<": function (n) {
            return pow(n, 3);
        },
        ">": function (n) {
            return pow(n - 1, 3) + 1;
        },
        "<>": function (n) {
            n = n * 2;
            if (n < 1) {
                return pow(n, 3) / 2;
            }
            n -= 2;
            return (pow(n, 3) + 2) / 2;
        },
        backIn: function (n) {
            var s = 1.70158;
            return n * n * ((s + 1) * n - s);
        },
        backOut: function (n) {
            n = n - 1;
            var s = 1.70158;
            return n * n * ((s + 1) * n + s) + 1;
        },
        elastic: function (n) {
            if (n == 0 || n == 1) {
                return n;
            }
            var p = .3,
                s = p / 4;
            return pow(2, -10 * n) * math.sin((n - s) * (2 * math.PI) / p) + 1;
        },
        bounce: function (n) {
            var s = 7.5625,
                p = 2.75,
                l;
            if (n < (1 / p)) {
                l = s * n * n;
            } else {
                if (n < (2 / p)) {
                    n -= (1.5 / p);
                    l = s * n * n + .75;
                } else {
                    if (n < (2.5 / p)) {
                        n -= (2.25 / p);
                        l = s * n * n + .9375;
                    } else {
                        n -= (2.625 / p);
                        l = s * n * n + .984375;
                    }
                }
            }
            return l;
        }
    };

    var animationElements = {length : 0},
        animation = function () {
            var Now = +new Date;
            for (var l in animationElements) if (l != "length" && animationElements[has](l)) {
                var e = animationElements[l];
                if (e.stop || e.el.removed) {
                    delete animationElements[l];
                    animationElements[length]--;
                    continue;
                }
                var time = Now - e.start,
                    ms = e.ms,
                    easing = e.easing,
                    from = e.from,
                    diff = e.diff,
                    to = e.to,
                    t = e.t,
                    prev = e.prev || 0,
                    that = e.el,
                    callback = e.callback,
                    set = {},
                    now;
                if (time < ms) {
                    var pos = R.easing_formulas[easing] ? R.easing_formulas[easing](time / ms) : time / ms;
                    for (var attr in from) if (from[has](attr)) {
                        switch (availableAnimAttrs[attr]) {
                            case "along":
                                now = pos * ms * diff[attr];
                                to.back && (now = to.len - now);
                                var point = getPointAtLength(to[attr], now);
                                that.translate(diff.sx - diff.x || 0, diff.sy - diff.y || 0);
                                diff.x = point.x;
                                diff.y = point.y;
                                that.translate(point.x - diff.sx, point.y - diff.sy);
                                to.rot && that.rotate(diff.r + point.alpha, point.x, point.y);
                                break;
                            case nu:
                                now = +from[attr] + pos * ms * diff[attr];
                                break;
                            case "colour":
                                now = "rgb(" + [
                                    upto255(round(from[attr].r + pos * ms * diff[attr].r)),
                                    upto255(round(from[attr].g + pos * ms * diff[attr].g)),
                                    upto255(round(from[attr].b + pos * ms * diff[attr].b))
                                ][join](",") + ")";
                                break;
                            case "path":
                                now = [];
                                for (var i = 0, ii = from[attr][length]; i < ii; i++) {
                                    now[i] = [from[attr][i][0]];
                                    for (var j = 1, jj = from[attr][i][length]; j < jj; j++) {
                                        now[i][j] = +from[attr][i][j] + pos * ms * diff[attr][i][j];
                                    }
                                    now[i] = now[i][join](S);
                                }
                                now = now[join](S);
                                break;
                            case "csv":
                                switch (attr) {
                                    case "translation":
                                        var x = diff[attr][0] * (time - prev),
                                            y = diff[attr][1] * (time - prev);
                                        t.x += x;
                                        t.y += y;
                                        now = x + S + y;
                                    break;
                                    case "rotation":
                                        now = +from[attr][0] + pos * ms * diff[attr][0];
                                        from[attr][1] && (now += "," + from[attr][1] + "," + from[attr][2]);
                                    break;
                                    case "scale":
                                        now = [+from[attr][0] + pos * ms * diff[attr][0], +from[attr][1] + pos * ms * diff[attr][1], (2 in to[attr] ? to[attr][2] : E), (3 in to[attr] ? to[attr][3] : E)][join](S);
                                    break;
                                    case "clip-rect":
                                        now = [];
                                        i = 4;
                                        while (i--) {
                                            now[i] = +from[attr][i] + pos * ms * diff[attr][i];
                                        }
                                    break;
                                }
                                break;
                        }
                        set[attr] = now;
                    }
                    that.attr(set);
                    that._run && that._run.call(that);
                } else {
                    if (to.along) {
                        point = getPointAtLength(to.along, to.len * !to.back);
                        that.translate(diff.sx - (diff.x || 0) + point.x - diff.sx, diff.sy - (diff.y || 0) + point.y - diff.sy);
                        to.rot && that.rotate(diff.r + point.alpha, point.x, point.y);
                    }
                    (t.x || t.y) && that.translate(-t.x, -t.y);
                    to.scale && (to.scale += E);
                    that.attr(to);
                    delete animationElements[l];
                    animationElements[length]--;
                    that.in_animation = null;
                    R.is(callback, "function") && callback.call(that);
                }
                e.prev = time;
            }
            R.svg && that && that.paper && that.paper.safari();
            animationElements[length] && win.setTimeout(animation);
        },
        upto255 = function (color) {
            return mmax(mmin(color, 255), 0);
        },
        translate = function (x, y) {
            if (x == null) {
                return {x: this._.tx, y: this._.ty, toString: x_y};
            }
            this._.tx += +x;
            this._.ty += +y;
            switch (this.type) {
                case "circle":
                case "ellipse":
                    this.attr({cx: +x + this.attrs.cx, cy: +y + this.attrs.cy});
                    break;
                case "rect":
                case "image":
                case "text":
                    this.attr({x: +x + this.attrs.x, y: +y + this.attrs.y});
                    break;
                case "path":
                    var path = pathToRelative(this.attrs.path);
                    path[0][1] += +x;
                    path[0][2] += +y;
                    this.attr({path: path});
                break;
            }
            return this;
        };
    Element[proto].animateWith = function (element, params, ms, easing, callback) {
        animationElements[element.id] && (params.start = animationElements[element.id].start);
        return this.animate(params, ms, easing, callback);
    };
    Element[proto].animateAlong = along();
    Element[proto].animateAlongBack = along(1);
    function along(isBack) {
        return function (path, ms, rotate, callback) {
            var params = {back: isBack};
            R.is(rotate, "function") ? (callback = rotate) : (params.rot = rotate);
            path && path.constructor == Element && (path = path.attrs.path);
            path && (params.along = path);
            return this.animate(params, ms, callback);
        };
    }
    Element[proto].onAnimation = function (f) {
        this._run = f || 0;
        return this;
    };
    Element[proto].animate = function (params, ms, easing, callback) {
        if (R.is(easing, "function") || !easing) {
            callback = easing || null;
        }
        var from = {},
            to = {},
            diff = {};
        for (var attr in params) if (params[has](attr)) {
            if (availableAnimAttrs[has](attr)) {
                from[attr] = this.attr(attr);
                (from[attr] == null) && (from[attr] = availableAttrs[attr]);
                to[attr] = params[attr];
                switch (availableAnimAttrs[attr]) {
                    case "along":
                        var len = getTotalLength(params[attr]),
                            point = getPointAtLength(params[attr], len * !!params.back),
                            bb = this.getBBox();
                        diff[attr] = len / ms;
                        diff.tx = bb.x;
                        diff.ty = bb.y;
                        diff.sx = point.x;
                        diff.sy = point.y;
                        to.rot = params.rot;
                        to.back = params.back;
                        to.len = len;
                        params.rot && (diff.r = toFloat(this.rotate()) || 0);
                        break;
                    case nu:
                        diff[attr] = (to[attr] - from[attr]) / ms;
                        break;
                    case "colour":
                        from[attr] = R.getRGB(from[attr]);
                        var toColour = R.getRGB(to[attr]);
                        diff[attr] = {
                            r: (toColour.r - from[attr].r) / ms,
                            g: (toColour.g - from[attr].g) / ms,
                            b: (toColour.b - from[attr].b) / ms
                        };
                        break;
                    case "path":
                        var pathes = path2curve(from[attr], to[attr]);
                        from[attr] = pathes[0];
                        var toPath = pathes[1];
                        diff[attr] = [];
                        for (var i = 0, ii = from[attr][length]; i < ii; i++) {
                            diff[attr][i] = [0];
                            for (var j = 1, jj = from[attr][i][length]; j < jj; j++) {
                                diff[attr][i][j] = (toPath[i][j] - from[attr][i][j]) / ms;
                            }
                        }
                        break;
                    case "csv":
                        var values = (params[attr] + E)[split](separator),
                            from2 = (from[attr] + E)[split](separator);
                        switch (attr) {
                            case "translation":
                                from[attr] = [0, 0];
                                diff[attr] = [values[0] / ms, values[1] / ms];
                            break;
                            case "rotation":
                                from[attr] = (from2[1] == values[1] && from2[2] == values[2]) ? from2 : [0, values[1], values[2]];
                                diff[attr] = [(values[0] - from[attr][0]) / ms, 0, 0];
                            break;
                            case "scale":
                                params[attr] = values;
                                from[attr] = (from[attr] + E)[split](separator);
                                diff[attr] = [(values[0] - from[attr][0]) / ms, (values[1] - from[attr][1]) / ms, 0, 0];
                            break;
                            case "clip-rect":
                                from[attr] = (from[attr] + E)[split](separator);
                                diff[attr] = [];
                                i = 4;
                                while (i--) {
                                    diff[attr][i] = (values[i] - from[attr][i]) / ms;
                                }
                            break;
                        }
                        to[attr] = values;
                }
            }
        }
        this.stop();
        this.in_animation = 1;
        animationElements[this.id] = {
            start: params.start || +new Date,
            ms: ms,
            easing: easing,
            from: from,
            diff: diff,
            to: to,
            el: this,
            callback: callback,
            t: {x: 0, y: 0}
        };
        ++animationElements[length] == 1 && animation();
        return this;
    };
    Element[proto].stop = function () {
        animationElements[this.id] && animationElements[length]--;
        delete animationElements[this.id];
        return this;
    };
    Element[proto].translate = function (x, y) {
        return this.attr({translation: x + " " + y});
    };
    Element[proto][toString] = function () {
        return "Rapha\xebl\u2019s object";
    };
    R.ae = animationElements;
 
    // Set
    var Set = function (items) {
        this.items = [];
        this[length] = 0;
        this.type = "set";
        if (items) {
            for (var i = 0, ii = items[length]; i < ii; i++) {
                if (items[i] && (items[i].constructor == Element || items[i].constructor == Set)) {
                    this[this.items[length]] = this.items[this.items[length]] = items[i];
                    this[length]++;
                }
            }
        }
    };
    Set[proto][push] = function () {
        var item,
            len;
        for (var i = 0, ii = arguments[length]; i < ii; i++) {
            item = arguments[i];
            if (item && (item.constructor == Element || item.constructor == Set)) {
                len = this.items[length];
                this[len] = this.items[len] = item;
                this[length]++;
            }
        }
        return this;
    };
    Set[proto].pop = function () {
        delete this[this[length]--];
        return this.items.pop();
    };
    for (var method in Element[proto]) if (Element[proto][has](method)) {
        Set[proto][method] = (function (methodname) {
            return function () {
                for (var i = 0, ii = this.items[length]; i < ii; i++) {
                    this.items[i][methodname][apply](this.items[i], arguments);
                }
                return this;
            };
        })(method);
    }
    Set[proto].attr = function (name, value) {
        if (name && R.is(name, array) && R.is(name[0], "object")) {
            for (var j = 0, jj = name[length]; j < jj; j++) {
                this.items[j].attr(name[j]);
            }
        } else {
            for (var i = 0, ii = this.items[length]; i < ii; i++) {
                this.items[i].attr(name, value);
            }
        }
        return this;
    };
    Set[proto].animate = function (params, ms, easing, callback) {
        (R.is(easing, "function") || !easing) && (callback = easing || null);
        var len = this.items[length],
            i = len,
            item,
            set = this,
            collector;
        callback && (collector = function () {
            !--len && callback.call(set);
        });
        easing = R.is(easing, string) ? easing : collector;
        item = this.items[--i].animate(params, ms, easing, collector);
        while (i--) {
            this.items[i].animateWith(item, params, ms, easing, collector);
        }
        return this;
    };
    Set[proto].insertAfter = function (el) {
        var i = this.items[length];
        while (i--) {
            this.items[i].insertAfter(el);
        }
        return this;
    };
    Set[proto].getBBox = function () {
        var x = [],
            y = [],
            w = [],
            h = [];
        for (var i = this.items[length]; i--;) {
            var box = this.items[i].getBBox();
            x[push](box.x);
            y[push](box.y);
            w[push](box.x + box.width);
            h[push](box.y + box.height);
        }
        x = mmin[apply](0, x);
        y = mmin[apply](0, y);
        return {
            x: x,
            y: y,
            width: mmax[apply](0, w) - x,
            height: mmax[apply](0, h) - y
        };
    };
    Set[proto].clone = function (s) {
        s = new Set;
        for (var i = 0, ii = this.items[length]; i < ii; i++) {
            s[push](this.items[i].clone());
        }
        return s;
    };

    R.registerFont = function (font) {
        if (!font.face) {
            return font;
        }
        this.fonts = this.fonts || {};
        var fontcopy = {
                w: font.w,
                face: {},
                glyphs: {}
            },
            family = font.face["font-family"];
        for (var prop in font.face) if (font.face[has](prop)) {
            fontcopy.face[prop] = font.face[prop];
        }
        if (this.fonts[family]) {
            this.fonts[family][push](fontcopy);
        } else {
            this.fonts[family] = [fontcopy];
        }
        if (!font.svg) {
            fontcopy.face["units-per-em"] = toInt(font.face["units-per-em"], 10);
            for (var glyph in font.glyphs) if (font.glyphs[has](glyph)) {
                var path = font.glyphs[glyph];
                fontcopy.glyphs[glyph] = {
                    w: path.w,
                    k: {},
                    d: path.d && "M" + path.d[rp](/[mlcxtrv]/g, function (command) {
                            return {l: "L", c: "C", x: "z", t: "m", r: "l", v: "c"}[command] || "M";
                        }) + "z"
                };
                if (path.k) {
                    for (var k in path.k) if (path[has](k)) {
                        fontcopy.glyphs[glyph].k[k] = path.k[k];
                    }
                }
            }
        }
        return font;
    };
    Paper[proto].getFont = function (family, weight, style, stretch) {
        stretch = stretch || "normal";
        style = style || "normal";
        weight = +weight || {normal: 400, bold: 700, lighter: 300, bolder: 800}[weight] || 400;
        if (!R.fonts) {
            return;
        }
        var font = R.fonts[family];
        if (!font) {
            var name = new RegExp("(^|\\s)" + family[rp](/[^\w\d\s+!~.:_-]/g, E) + "(\\s|$)", "i");
            for (var fontName in R.fonts) if (R.fonts[has](fontName)) {
                if (name.test(fontName)) {
                    font = R.fonts[fontName];
                    break;
                }
            }
        }
        var thefont;
        if (font) {
            for (var i = 0, ii = font[length]; i < ii; i++) {
                thefont = font[i];
                if (thefont.face["font-weight"] == weight && (thefont.face["font-style"] == style || !thefont.face["font-style"]) && thefont.face["font-stretch"] == stretch) {
                    break;
                }
            }
        }
        return thefont;
    };
    Paper[proto].print = function (x, y, string, font, size, origin) {
        origin = origin || "middle"; // baseline|middle
        var out = this.set(),
            letters = (string + E)[split](E),
            shift = 0,
            path = E,
            scale;
        R.is(font, string) && (font = this.getFont(font));
        if (font) {
            scale = (size || 16) / font.face["units-per-em"];
            var bb = font.face.bbox.split(separator),
                top = +bb[0],
                height = +bb[1] + (origin == "baseline" ? bb[3] - bb[1] + (+font.face.descent) : (bb[3] - bb[1]) / 2);
            for (var i = 0, ii = letters[length]; i < ii; i++) {
                var prev = i && font.glyphs[letters[i - 1]] || {},
                    curr = font.glyphs[letters[i]];
                shift += i ? (prev.w || font.w) + (prev.k && prev.k[letters[i]] || 0) : 0;
                curr && curr.d && out[push](this.path(curr.d).attr({fill: "#000", stroke: "none", translation: [shift, 0]}));
            }
            out.scale(scale, scale, top, height).translate(x - top, y - height);
        }
        return out;
    };

    var formatrg = /\{(\d+)\}/g;
    R.format = function (token, params) {
        var args = R.is(params, array) ? [0][concat](params) : arguments;
        token && R.is(token, string) && args[length] - 1 && (token = token[rp](formatrg, function (str, i) {
            return args[++i] == null ? E : args[i];
        }));
        return token || E;
    };
    R.ninja = function () {
        oldRaphael.was ? (Raphael = oldRaphael.is) : delete Raphael;
        return R;
    };
    R.el = Element[proto];
    return R;
})();
(function(global) {
	'use strict';
	/* globals Raphael: true */
	global.Raphael = Raphael;
})(this);
(function(global){	// BEGIN CLOSURE

var
math = global.Math,
cos = math.cos,
sin = math.sin,
sqrt = math.sqrt,
mmin = math.min,
mmax = math.max,
atan2 = math.atan2,
acos = math.acos,
PI = math.PI;

var enqueue = function(fnc){
    setTimeout(fnc, 0);
};

var isArray = Array.isArray || function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

var isObject = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
};

if (!global.console){
    global.console = {
	log: function(){},
	warn: function(){},
	error: function(){},
	debug: function(){}
    };
}

if (!Array.indexOf){
    /**
     * Array.indexOf is missing in IE 8.
     * @private
     */
    Array.prototype.indexOf = function (obj, start){
	for (var i = (start || 0), len = this.length; i < len; i++){
	    if (this[i] == obj){
		return i;
	    }
	}
	return -1;
    };
}

/**
 * Copies all the properties to the first argument from the following arguments.
 * All the properties will be overwritten by the properties from the following
 * arguments. Inherited properties are ignored.
 * @private
 */
var Mixin = function() {
    var target = arguments[0];
    for (var i = 1, l = arguments.length; i < l; i++){
        var extension = arguments[i];
        for (var key in extension){
            if (!extension.hasOwnProperty(key)){
		continue;
	    }
            var copy = extension[key];
            if (copy === target[key]){
		continue;
	    }
            // copying super with the name base if it does'nt has one already
            if (typeof copy == "function" && typeof target[key] == "function" && !copy.base){
		copy.base = target[key];
	    }
            target[key] = copy;
        }
    }
    return target;
};

/**
 * Copies all properties to the first argument from the following
 * arguments only in case if they don't exists in the first argument.
 * All the function propererties in the first argument will get
 * additional property base pointing to the extenders same named
 * property function's call method.
 * @example
 * // usage of base
 * Bar.extend({
 * // function should have name
 * foo: function foo(digit) {
 * return foo.base(this, parseInt(digit))
 * }
 * });
 * @private
 */
var Supplement = function() {
    var target = arguments[0];
    for (var i = 1, l = arguments.length; i < l; i++){
        var extension = arguments[i];
        for (var key in extension) {
            var copy = extension[key];
            if (copy === target[key]){
		continue;
	    }
            // copying super with the name base if it does'nt has one already
            if (typeof copy == "function" && typeof target[key] == "function" && !target[key].base){
		target[key].base = copy;
	    }
            // target doesn't has propery that is owned by extension copying it
            if (!target.hasOwnProperty(key) && extension.hasOwnProperty(key)){
		target[key] = copy;
	    }
        }
    }
    return target;
};

/**
 * Copies all the properties to the first argument from the following arguments.
 * All the properties will be overwritten by the properties from the following
 * arguments. Inherited properties are ignored.
 * Deep version.
 * @private
 */
var DeepMixin = function() {
    var target = arguments[0];
    for (var i = 1, l = arguments.length; i < l; i++) {
        var extension = arguments[i];
        for (var key in extension) {
            var copy = extension[key];
            if (copy === target[key]) continue;
            if (isObject(copy)) DeepMixin((target[key] || (target[key] = {})), copy);
            // copying super with the name base if it does'nt has one already
            if (typeof copy == 'function' && typeof target[key] == 'function' && !target[key].base) {
                target[key].base = copy;
            }
	    target[key] = copy;
        }
    }
    return target;
};

/**
 * Copies all properties to the first argument from the following
 * arguments only in case if they don't exists in the first argument.
 * All the function propererties in the first argument will get
 * additional property base pointing to the extenders same named
 * property function's call method.
 * @example
 * // usage of base
 * Bar.extend({
 * // function should have name
 * foo: function foo(digit) {
 * return foo.base(this, parseInt(digit))
 * }
 * });
 * Deep version.
 * @private
 */
var DeepSupplement = function() {
    var target = arguments[0];
    for (var i = 1, l = arguments.length; i < l; i++) {
        var extension = arguments[i];
        for (var key in extension) {
            var copy = extension[key];
            if (copy === target[key]) continue;
            if (isObject(copy)) DeepSupplement((target[key] || (target[key] = {})), copy);
            // copying super with the name base if it does'nt has one already
            if (typeof copy == 'function' && typeof target[key] == 'function' && !target[key].base) {
                target[key].base = copy;
            }
            // target doesn't has propery that is owned by extension copying it
            if (!target.hasOwnProperty(key) && extension.hasOwnProperty(key)){
		target[key] = copy;
	    }
        }
    }
    return target;
};


/**
 * @name Joint
 * @constructor
 * @param {RaphaelObject|Shape|object} from Object/position where the connection starts.
 * @param {RaphaelObject|Shape|object} to Object/position where the connection ends.
 * @param {object} [opts] opt Options
 * @param {object} [opts.interactive] Is the joint interactive? [default = true]
 * @param {object} [opts.attrs] Connection options (see  Raphael possible parameters)
 * @param {string} [opts.cursor] Connection CSS cursor property
 * @param {boolean} [opts.beSmooth] Connection enable/disable smoothing
 * @param {string|array} [opts.label] Connection label(s)
 * @param {object|array} [opts.labelAttrs] Label(s) options (see  Raphael possible parameters)  + position attribute (<0, [0, 1], >1)
 * @param {object|array} [opts.labelBoxAttrs] SVG Attributes of the label(s) bounding rectangle + padding attribute
 * @param {object} [opts.startArrow] Start arrow options
 * @param {string} [opts.startArrow.type] "none"|"basic"
 * @param {number} [opts.startArrow.size] Start arrow size
 * @param {object} [opts.startArrow.attrs] Start Arrow options (see  Raphael possible parameters)
 * @param {object} [opts.endArrow] End arrow options
 * @param {string} [opts.endArrow.type] "none"|"basic"
 * @param {number} [opts.endArrow.size] End arrow size
 * @param {object} [opts.endArrow.attrs] End Arrow options (see  Raphael possible parameters)
 * @param {object} [opts.dummy] Dummy node options (shows when dragging arrows)
 * @param {object} [opts.dummy.start] Start dummy node options
 * @param {number} [opts.dummy.start.radius] Start dummy radius
 * @param {object} [opts.dummy.start.attrs] Start dummy options (see  Raphael possible parameters)
 * @param {object} [opts.dummy.end] End dummy node options
 * @param {number} [opts.dummy.end.radius] End dummy radius
 * @param {object} [opts.dummy.end.attrs] End dummy options (see  Raphael possible parameters)
 * @param {object} [opts.handle] Handle options
 * @param {number} [opts.handle.timeout] Number of milliseconds handle stays shown
 * @param {object} [opts.handle.start] Start handle options
 * @param {boolean} [opts.handle.start.enabled] Start handle enabled/disabled
 * @param {number} [opts.handle.start.radius] Start handle radius
 * @param {object} [opts.handle.start.attrs] Start handle attributes (see  Raphael possible parameters)
 * @param {object} [opts.handle.end] End handle options
 * @param {boolean} [opts.handle.end.enabled] End handle enabled/disabled
 * @param {number} [opts.handle.end.radius] End handle radius
 * @param {object} [opts.handle.end.attrs] End handle attributes (see  Raphael possible parameters)
 * @param {object} [opts.bboxCorrection] Correction of a bounding box (useful when, e.g., the connection should start in the center of an object)
 * @param {object} [opts.bboxCorrection.start] BBox correction of the start object.
 * @param {string} [opts.bboxCorrection.start.type] "ellipse"|"rect"
 * @param {number} [opts.bboxCorrection.start.x] Translation in the x-axis
 * @param {number} [opts.bboxCorrection.start.y] Translation in the y-axis
 * @param {number} [opts.bboxCorrection.start.width] BBox width
 * @param {number} [opts.bboxCorrection.start.height] BBox height
 * @param {object} [opts.bboxCorrection.end] BBox correction of the end object.
 * @param {string} [opts.bboxCorrection.end.type] "ellipse"|"rect"
 * @param {number} [opts.bboxCorrection.end.x] Translation in the x-axis
 * @param {number} [opts.bboxCorrection.end.y] Translation in the y-axis
 * @param {number} [opts.bboxCorrection.end.width] BBox width
 * @param {number} [opts.bboxCorrection.end.height] BBox height
 * @example
 * Joint({x: 10, y: 10}, {x: 300, y: 100}, {
 *  label: "my label",
 *  beSmooth: true,
 *  startArrow: {
 *    type: "basic",
 *    size: 7,
 *    attrs: {
 *      fill: "red",
 *      stroke: "blue"
 *    }
 *  },
 *  handle: {
 *    timeout: 4000,
 *    start: {
 *      radius: 6,
 *      attrs: {
 *        fill: "green",
 *        stroke: "black"
 *      }
 *    },
 *    end: {
 *      radius: 4,
 *      attrs: {
 *        fill: "red",
 *        stroke: "black"
 *      }
 *    }
 *  }
 * });
 */
function Joint(from, to, opt){
    if (!(this instanceof Joint)){
	return new Joint(from, to, opt);
    }
    /**
     * @private
     * @type RaphaelPaper
     */
    var paper = this.paper = Joint.paper();

    // these objects are the ones I can connect to
    this._registeredObjects = [];

    this._conVerticesCurrentIndex = 0;
    this._nearbyVertexSqrDist = 500;	// sqrt(this._nearbyVertexSqrDist) is tolerable distance of vertex moving

    this.dom = {};	// holds all dom elements

    // connection from start to end
    this._start = { // start object
	shape: null,		// Raphael object
	dummy: false		// is it a dummy object?
    };
    this._end = { // end object
	shape: null,		// Raphael object
	dummy: false		// is it a dummy object?
    };

    // connection options
    this._opt = {
	vertices: [],	// joint path vertices
	attrs: {
	    "stroke": "#000",
	    //	    "fill": "#fff",	// can not be used if connection wiring is enabled
	    "fill-opacity": 0.0,
	    "stroke-width": 1,
	    "stroke-dasharray": "-",
	    "stroke-linecap": "round", // butt/square/round/mitter
	    "stroke-linejoin": "round", // butt/square/round/mitter
	    "stroke-miterlimit": 1,
	    "stroke-opacity": 1.0
	},
	cursor: "move",	// CSS cursor property
	beSmooth: false,// be a smooth line? (bezier curve aproximation)
	interactive: true, // is the connection interactive?
	label: undefined,
	labelAttrsDefault: {
            position: 1/2,
            offset: 0,  // y-offset
	    "font-size": 12,
	    "fill": "#000"
	},
        labelAttrs: [],
	labelBoxAttrsDefault: { stroke: "white", fill: "white" },
        labelBoxAttrs: [],
	// bounding box correction
	// (useful when the connection should start in the center of an object, etc...)
	bboxCorrection: {
	    start: { type: null, x: 0, y: 0, width: 0, height: 0 },
	    end: { type: null, x: 0, y: 0, width: 0, height: 0 }
	},
	// dummy nodes radius and SVG attributes
	dummy: {
	    start: {
		radius: 1,
		attrs: {"opacity": 0.0, "fill": "red"}
	    },
	    end: {
		radius: 1,
		attrs: {"opacity": 0.0, "fill": "yellow"}
	    }
	},
	// handles (usefull when picking "none" type of arrow)
	handle: {
	    timeout: 2000,
	    start: {
		enabled: false,
		radius: 4,
		attrs: { opacity: 1.0, fill: "red", stroke: "black" }
	    },
	    end: {
		enabled: false,
		radius: 4,
		attrs: { opacity: 1.0, fill: "red", stroke: "black" }
	    }
	}
    };
    // used arrows (default values)
    this._opt.arrow = {
	start: Joint.getArrow("none", 2, this._opt.attrs),
	end: Joint.getArrow("basic", 5)
    };
    // options
    if (opt) this.processOptions(opt);

    JointDOMBuilder.init(this.paper, this._opt, this._start, this._end);

    var startObject = this._start,
        endObject = this._end;

    if (from.x && from.y)	// from is point?
	JointDOMBuilder.dummy(startObject, from, this._opt.dummy.start);
    else
	startObject.shape = from.yourself();

    if (to.x && to.y)		// to is point?
	JointDOMBuilder.dummy(endObject, to, this._opt.dummy.end);
    else
	endObject.shape = to.yourself();

    // to be able to dispatch events in Raphael element attr method
    // TODO: possible source of memory leaks!!!
    this.addJoint(startObject.shape);
    this.addJoint(endObject.shape);
    // draw
    this.update();
}
global.Joint = Joint;	// the only global variable

Joint.euid = 1;	// elements/joints unique id
/**
 * Assign unique id to this.
 * @private
 * @example Joint.generateEuid.call(obj);
 */
Joint.generateEuid = function(){
    if (this._euid === undefined) this._euid = Joint.euid++;
    return this._euid;
};

/**
 * @private
 */
Joint.prototype = {
    // temporaries for moving objects
    _dx: undefined,
    _dy: undefined,
    /*
     * States.
     */
    IDLE: 0,
    STARTCAPDRAGGING: 1,
    ENDCAPDRAGGING: 2,
    CONNECTIONWIRING: 3,
    state: 0,	// IDLE
    /*
     * Callbacks.
     * @name Callbacks
     */
    _callbacks: {
	// called when a joint has just connected to an object
	// the object is accessed using this,
	// the only argument is what side has been connected ("start" | "end")
	justConnected: function(side){},
	disconnected: function(side){},
	justBroken: function(mousePos){},
	wiring: function(mousePos){},
	objectMoving: function(obj){}
    },
    /**
     * @return {String} Joint unique identifier.
     */
    euid: function(){
	return Joint.generateEuid.call(this);
    },
    /*
     * Getters.
     */
    connection: function(){ return this.dom.connection[0]; },
    endObject: function(){ return this._end.shape; },
    startObject: function(){ return this._start.shape; },
    endCap: function(){ return this.dom.endCap; },
    endCapConnected: function(){ return !this._end.dummy; },
    startCap: function(){ return this.dom.startCap; },
    startCapConnected: function(){ return !this._start.dummy; },
    isStartDummy: function(){ return this._start.dummy; },
    isEndDummy: function(){ return this._end.dummy; },
    /**
     * Replaces dummy object with a new object.
     * @private
     * @param {object} startOrEnd start or end object (old dummy)
     * @param {RaphaelObject} o
     */
    replaceDummy: function(startOrEnd, o){
	// assert(startOrEnd.dummy == true)
	startOrEnd.shape.remove();
	startOrEnd.dummy = false;
	startOrEnd.shape = o;
    },
    /**
     * Calls a callback.
     * @private
     * @param fnc Callback 
     * @param {object} scope Scope of the callback
     * @param {array} args Array of arguments
     */
    callback: function(fnc, scope, args){
	this._callbacks[fnc].apply(scope, args);
        return this;
    },
    /**
     * Search the registered objects and get the one (if any)
     * who's bounding box contains the point p.
     * @todo check document.elementFromPoint(x, y)
     * @private
     * @param {Point} p
     */
    objectContainingPoint: function(p){
	var register = this._registeredObjects,
	    idx = (register ? register.length : 0), o;
	while (idx--){
	    o = register[idx].yourself();
	    if (rect(o.getBBox()).containsPoint(p))
		return o;
	}
	return null;
    },
    /**
     * Remove reference to Joint from obj.
     * @private
     * @param {StartObject|EndObject} obj
     */
    freeJoint: function(obj){
	var jar = obj.yourself().joints(),
	    i = jar.indexOf(this);
	jar.splice(i, 1);
	return this;
    },
    /**
     * Add reference to Joint to obj.
     * @private
     * @param {RaphaelObject} obj
     */
    addJoint: function(obj){
	var joints = obj.joints();;
	// push the Joint object into obj.joints array
	// but only if obj.joints already doesn't have that Joint object
	if (joints.indexOf(this) === -1) joints.push(this);
    },
    /**
     * MouseDown event callback when on cap.
     * @private
     * @param {Event} e
     * @param {RaphaelObject} cap
     */
    capMouseDown: function(e, cap){
	Joint.currentJoint = this;	// keep global reference to me
	this._dx = e.clientX;
	this._dy = e.clientY;

	if (cap === this.dom.startCap){
            this.disconnect("start");
	    this.state = this.STARTCAPDRAGGING;
	} else if (cap === this.dom.endCap){
            this.disconnect("end");
	    this.state = this.ENDCAPDRAGGING;
	}
    },
    /**
     * MouseDown event callback when on connection.
     * @private
     * @param {Event} e
     */
    connectionMouseDown: function(e){
	Joint.currentJoint = this;	// keep global reference to me
	var mousePos = Joint.getMousePosition(e, this.paper.canvas);

	// if the mouse position is nearby a connection vertex
	// do not create a new one but move the selected one instead
	for (var i = 0, len = this._opt.vertices.length; i < len; i++){
	    var v = this._opt.vertices[i];
	    if (line(v, mousePos).squaredLength() < this._nearbyVertexSqrDist){
		this._conVerticesCurrentIndex = i;
		this.state = this.CONNECTIONWIRING;
		return;
	    }
	}

	// new vertices can be added CORRECTLY only at the end
	// or at the start of the connection
	// -> @todo
	var sbbCenter = rect(this.startObject().getBBox()).center(),
	    ebbCenter = rect(this.endObject().getBBox()).center(),
	    // squared lengths of the lines from the center of
	    // start/end object bbox to the mouse position
	    smLineSqrLen = line(sbbCenter, mousePos).squaredLength(),
	    emLineSqrLen = line(ebbCenter, mousePos).squaredLength();
	if (smLineSqrLen < emLineSqrLen){
	    // new vertex is added to the beginning of the vertex array
	    this._conVerticesCurrentIndex = 0;
	    this._opt.vertices.unshift(mousePos);
	} else {
	    // new vertex is added to the end of the vertex array
	    this._conVerticesCurrentIndex = this._opt.vertices.push(mousePos) - 1;
	}
	this.state = this.CONNECTIONWIRING;
	this.callback("justBroken", this, [mousePos]);
    },
    capDragging: function(e){
	// move dummy object
	if (this.state === this.STARTCAPDRAGGING){
	    this.startObject().translate(e.clientX - this._dx, e.clientY - this._dy);
	} else if (this.state === this.ENDCAPDRAGGING) {
	    this.endObject().translate(e.clientX - this._dx, e.clientY - this._dy);
	} else {
	    return;	// should not happen
	}
	this._dx = e.clientX;
	this._dy = e.clientY;

	this.update();
    },
    capEndDragging: function(){
	var dummyBB, 
	    STARTCAPDRAGGING = (this.state === this.STARTCAPDRAGGING),
	    ENDCAPDRAGGING = (this.state === this.ENDCAPDRAGGING),
	    capType = (STARTCAPDRAGGING) ? "start" : "end";

        
	if (STARTCAPDRAGGING){
            dummyBB = this.startObject().getBBox();	    
	} else if (ENDCAPDRAGGING){
	    dummyBB = this.endObject().getBBox();
	}
        
	var o = this.objectContainingPoint(point(dummyBB.x, dummyBB.y));
	if (o){
	    this.callback("justConnected", o, [capType]);
	    this.replaceDummy(this["_" + capType], o);
	    this.addJoint(o);
	}

	this.update();
    },
    connectionWiring: function(e){
	var mousePos = Joint.getMousePosition(e, this.paper.canvas);
	this._opt.vertices[this._conVerticesCurrentIndex] = mousePos;
	this.update();
	this.callback("wiring", this, [mousePos]);
    },
    update: function(){
	this.redraw().listenAll();
	// setTimeout makes drawing much faster!
//	var self = this;
//	enqueue(function(){self.redraw().listenAll();});
    },
    redraw: function(){
	this.clean(["connection", "startCap", "endCap", "handleStart", "handleEnd", "label"]);
	this.draw(["connection", "startCap", "endCap", "handleStart", "handleEnd", "label"]);
	return this;
    },
    listenAll: function(){
	if (!this._opt.interactive){
	    return this;
	}
	var self = this;
	this.dom.startCap.mousedown(function(e){
		           Joint.fixEvent(e);
			   self.capMouseDown(e, self.dom.startCap);
			   e.stopPropagation();
			   e.preventDefault();
        });
	this.dom.endCap.mousedown(function(e){
		           Joint.fixEvent(e);
			   self.capMouseDown(e, self.dom.endCap);
			   e.stopPropagation();
			   e.preventDefault();
	});
        var i;
        i = this.dom.connection.length;
        while (i--) {
	    this.dom.connection[i].mousedown(function(e){
                Joint.fixEvent(e);
		self.connectionMouseDown(e);
		e.stopPropagation();
		e.preventDefault();
            });
        }
	if (this._opt.handle.start.enabled){
	    this.dom.handleStart.mousedown(function(e){
			       Joint.fixEvent(e);
			       self.capMouseDown(e, self.dom.startCap);
			       e.stopPropagation();
			       e.preventDefault();
	    });
	}
	if (this._opt.handle.end.enabled){
	    this.dom.handleEnd.mousedown(function(e){
			       Joint.fixEvent(e);
			       self.capMouseDown(e, self.dom.endCap);
			       e.stopPropagation();
			       e.preventDefault();
	    });
	}
	if (this._opt.handle.timeout !== Infinity){
            i = this.dom.connection.length;
            while (i--) {
	       this.dom.connection[i].mouseover(function(e){
	           Joint.fixEvent(e);
		   self.showHandle();
	           setTimeout(function(){
		       self.hideHandle();
		   }, self._opt.handle.timeout);
		   e.stopPropagation();
		   e.preventDefault();
	        });
            }
	}
	return this;
    },
    /**
     * @private
     */
    boundPoint: function(bbox, type, rotation, p){
	if (type === "circle" || type === "ellipse")
	    return ellipse(bbox.center(), bbox.width/2, bbox.height/2).intersectionWithLineFromCenterToPoint(p);
        else if (type === 'rect' && bbox.width == bbox.height && rotation != 0) {
            // compute new bounding box of a rotated square
            // @todo Compute intersection properly
            var w = bbox.width,
                dia = Math.sqrt(w*w + w*w),
                origin = bbox.center().offset(-dia/2, -dia/2);
            bbox = rect(origin.x, origin.y, dia, dia);
            return bbox.boundPoint(p) || bbox.center();
        }
	return bbox.boundPoint(p) || bbox.center();
    },
    /**
     * @private
     * @param {object} start
     * @param {rect} start.bbox Start object bounding box.
     * @param {string} start.type Start object geometrical type.
     * @param {point} start.shift Start arrow offsets.
     * @param {object} end
     * @param {rect} end.bbox End object bounding box.
     * @param {string} end.type End object geometrical type.
     * @param {point} end.shift End arrow offsets.
     * @param {array} vertices Connection vertices.
     * @return {object} Object containing location of start/end of the joint.
     */
    jointLocation: function(start, end, vertices){
	var verticesLength = vertices.length, theta,
        firstVertex = (vertices.length ? vertices[0] : undefined),
        lastVertex = (vertices.length ? vertices[verticesLength - 1] : undefined),
        p1, p1bp, c1t, c1r, p2, p2bp, c2t, c2r;

	// start object boundary point
	p1bp = this.boundPoint(start.bbox, start.type, start.rotation, firstVertex || end.bbox.center());
	// shift
	theta = start.bbox.center().theta(firstVertex || end.bbox.center());
	// first point of the connection
	p1 = point(p1bp.x + (2 * start.shift.dx * cos(theta.radians)),
		   p1bp.y + (-2 * start.shift.dy * sin(theta.radians)));
	// start arrow translation
	c1t = point(p1bp.x + start.shift.dx * cos(theta.radians),
		    p1bp.y - start.shift.dy * sin(theta.radians));
	// start arrow rotation
	c1r = 360 - theta.degrees + 180;

	// end object boundary point
	p2bp = this.boundPoint(end.bbox, end.type, end.rotation, lastVertex || start.bbox.center());
	// shift
	theta = (lastVertex || start.bbox.center()).theta(end.bbox.center());
	// last point of the connection
	p2 = point(p2bp.x + (-2 * end.shift.dx * cos(theta.radians)),
		   p2bp.y + (2 * end.shift.dy * sin(theta.radians)));
	// end arrow translation
	c2t = point(p2bp.x - end.shift.dx * cos(theta.radians),
	            p2bp.y + end.shift.dy * sin(theta.radians));
	// end arrow rotation
	c2r = 360 - theta.degrees;

	return {
	    start: {
		bound: p1bp,
		connection: p1,
		translate: c1t,
		rotate: c1r
	    },
	    end: {
		bound: p2bp,
		connection: p2,
		translate: c2t,
		rotate: c2r
	    }
	};
    },
    /**
     * @private
     * @param {point} start Joint start location.
     * @param {point} end Joint end location.
     * @param {array} vertices Connection vertices.
     * @param {boolean} smooth Connection smooth flag.
     * @return {array} SVG path commands.
     */
    connectionPathCommands: function(start, end, vertices, smooth){
	if (smooth)
	    return Bezier.curveThroughPoints([start].concat(vertices, [end]));
	var commands = ["M", start.x, start.y], i = 0, l = vertices.length;
	for (; i < l; i++)
	    commands.push("L", vertices[i].x, vertices[i].y);
	commands.push("L", end.x, end.y);
	return commands;
    },

    /**
     * @private
     * @param {point} start Joint start location.
     * @param {point} end Joint end location.
     * @param {array} vertices Connection vertices.
     * @return {array} Locations of the label (array of points).
     */
    labelLocation: function(connectionPathCommands){
        var path = this.paper.path(connectionPathCommands.join(' ')),
            length = path.getTotalLength(),
            locations = [], attrs = this._opt.labelAttrs, len = attrs.length, i = 0,
            position;
        for (; i < len; i++) {
            position = attrs[i].position;
            position = (position > length) ? length : position; // sanity check
            position = (position < 0) ? length + position : position;
            position = position > 1 ? position : length * position;
            locations.push(path.getPointAtLength(position));
        }
        path.remove();
        return locations;
    },

    /**
     * @private
     */
    draw: function(components){
	var self = this,
	    paper = this.paper,
	    jointLocation = this.jointLocation(
	        {
	            bbox: rect(this.startObject().getBBox()).moveAndExpand(this._opt.bboxCorrection.start),
		    type: this.startObject().type,
                    rotation: this.startObject().attrs.rotation,
		    shift: this._opt.arrow.start
	        },
	        {
	            bbox: rect(this.endObject().getBBox()).moveAndExpand(this._opt.bboxCorrection.end),
		    type: this.endObject().type,
                    rotation: this.endObject().attrs.rotation,
		    shift: this._opt.arrow.end
	        },
	        this._opt.vertices
	    ),
            connectionPathCommands = this.connectionPathCommands(
		jointLocation.start.connection,
		jointLocation.end.connection,
		this._opt.vertices,
		this._opt.beSmooth
	    ),
	    labelLocation = this.labelLocation(connectionPathCommands),
	    dom = JointDOMBuilder.init(this.paper, this._opt, this._start, this._end, jointLocation, connectionPathCommands, labelLocation),
	    l = components.length,
	    component;

	for (var i = 0; i < l; i++){
	    component = components[i];
	    this.dom[component] = dom[component]();
	}
    },
    /**
     * Clean operations.
     * Remove the DOM elements of connection/startCap/endCap/label if they exist.
     * Clean operations support chaining.
     * @private
     */
    clean: function(components){
	var component, name, subComponents, idx = components.length;
	while (idx--){
	    name = components[idx];
	    component = this.dom[name];
	    if (component){
		if (component.node){
		    component.remove();
		    this.dom[name] = null;
		} else {  // component is a composite object
		    subComponents = component;
		    for (var key in subComponents){
			if (subComponents.hasOwnProperty(key))
			    subComponents[key].remove();
		    }
		}
		this.dom[name] = null;
	    }
	}
    },

    /**
     * Process options.
     * @todo Please fix me! I look like spagethi.
     * @private
     * @param {object} opt
     */
    processOptions: function(opt){
	var key, myopt = this._opt,
            topOptions = ['interactive', 'cursor', 'beSmooth'], i = topOptions.length;
        
        // top options
        while (i--) {
            if (opt[topOptions[i]] !== undefined)
                myopt[topOptions[i]] = opt[topOptions[i]];
        }

        myopt.subConnectionAttrs = opt.subConnectionAttrs || undefined;

	Mixin(myopt.attrs, opt.attrs);
        Mixin(myopt.bboxCorrection.start, opt.bboxCorrection && opt.bboxCorrection.start);
        Mixin(myopt.bboxCorrection.end, opt.bboxCorrection && opt.bboxCorrection.end);
        if (opt.vertices) this._setVertices(opt.vertices);

        // label(s) related options
	if (opt.label) {
            myopt.label = isArray(opt.label) ? opt.label : [opt.label];
            if (!isArray(opt.labelAttrs)) opt.labelAttrs = [opt.labelAttrs];
            for (i = 0; i < myopt.label.length; i++) {
                Supplement(opt.labelAttrs[i] || (opt.labelAttrs[i] = {}), myopt.labelAttrsDefault);
            }
	    myopt.labelAttrs = opt.labelAttrs;      // make a copy? (parse(stringify(opt)))

            var spread = undefined;
            if (!isArray(opt.labelBoxAttrs)) {
                if (typeof opt.labelBoxAttrs === 'object')
                    spread = opt.labelBoxAttrs;
                opt.labelBoxAttrs = [opt.labelBoxAttrs];
            }
            for (i = 0; i < myopt.label.length; i++) {
                if (spread) opt.labelBoxAttrs[i] = spread;
                Supplement(opt.labelBoxAttrs[i] || (opt.labelBoxAttrs[i] = {}), this._opt.labelBoxAttrsDefault);
            }
	    myopt.labelBoxAttrs = opt.labelBoxAttrs;      // make a copy? (parse(stringify(opt)))
	}

        // arrowheads
	var sa = opt.startArrow, ea = opt.endArrow;
	if (sa && sa.type) myopt.arrow.start = Joint.getArrow(sa.type, sa.size, sa.attrs);
	if (ea && ea.type) myopt.arrow.end = Joint.getArrow(ea.type, ea.size, ea.attrs);
	// direct arrow specification rewrites types
	if (opt.arrow) {
            myopt.arrow.start = opt.arrow.start || myopt.arrow.start;
            myopt.arrow.end = opt.arrow.end || myopt.arrow.end;
	}

        // dummies
	if (opt.dummy && opt.dummy.start) {
	    if (opt.dummy.start.radius) myopt.dummy.start.radius = opt.dummy.start.radius;
            Mixin(myopt.dummy.start.attrs, opt.dummy.start.attrs);
        }
	if (opt.dummy && opt.dummy.end) {
	    if (opt.dummy.end.radius) myopt.dummy.end.radius = opt.dummy.end.radius;
            Mixin(myopt.dummy.end.attrs, opt.dummy.end.attrs);
	}
        // handles
	if (opt.handle){
	    if (opt.handle.timeout) myopt.handle.timeout = opt.handle.timeout;
	    if (opt.handle.start){
		if (opt.handle.start.enabled) myopt.handle.start.enabled = opt.handle.start.enabled;
		if (opt.handle.start.radius) myopt.handle.start.radius = opt.handle.start.radius;
                Mixin(myopt.handle.start.attrs, opt.handle.start.attrs);
	    }
	    if (opt.handle.end){
		if (opt.handle.end.enabled) myopt.handle.end.enabled = opt.handle.end.enabled;
		if (opt.handle.end.radius) myopt.handle.end.radius = opt.handle.end.radius;
                Mixin(myopt.handle.end.attrs, opt.handle.end.attrs);
	    }
	}
    },
    // Public API

    /**
     * Disconnects joint from objects.
     * @param {string} cap "start|end|both" which side to disconnect
     * @return {Joint} return this to allow chaining
     */
    disconnect: function(cap){
        var disconnectedFrom, camelCap = (cap === "start")
                                          ? "Start"
                                          : (cap === "end"
                                             ? "End"
                                             : "Both");

        if (cap === "both" || cap === undefined){
            this.freeJoint(this.startObject())
                .freeJoint(this.endObject());
            
            if (!this.isStartDummy()){
                disconnectedFrom = this.startObject();
                this.draw(["dummyStart"]);
	        this.callback("disconnected", disconnectedFrom, [cap]);
            }
            if (!this.isEndDummy()){
                disconnectedFrom = this.endObject();
                this.draw(["dummyEnd"]);
	        this.callback("disconnected", disconnectedFrom, [cap]);
            }
            
        } else if (!this["is" + camelCap + "Dummy" ]()){
            // do not do anything with already disconnected side
            disconnectedFrom = this[cap + "Object"]();
            if (this.startObject() !== this.endObject()){
                this.freeJoint(disconnectedFrom);                
            }
            this.draw(["dummy" + camelCap]);
	    this.callback("disconnected", disconnectedFrom, [cap]);
        }

        return this;
    },

    /**
     * Register object(s) so that it can be pointed by my cap.
     * @param {RaphaelObject|Shape|array} obj
     * @param {string} cap "start|end|both" cap to register default: "both"
     * @return {Joint}
     * @example j.register(circle, "end")
     */
    register: function(obj, cap){
	if (!cap){
	    cap = "both";
	}
	// prepare array of objects that are to be registered
	var toRegister = (obj.constructor == Array) ? obj : [obj];
	// register all objects in toRegister array
	for (var i = 0, len = toRegister.length; i < len; i++){
	    toRegister[i].yourself()._capToStick = cap;
	    this._registeredObjects.push(toRegister[i]);
	}
	return this;
    },
    /**
     * The difference between register and registerForever is that registerForever
     * saves reference to an array passed as argument. It means that all objects pushed
     * into the array before and/or after the call of this method will be registered (for both caps).
     * This method is useful for applications that do not know to which objects the connection
     * can be sticked when the joint is created.
     * @param {array} arr An array holding objects which the joint is going to be registered to.
     * @return {Joint}
     * @example
     * var all = [];
     * j.registerForever(all);
     * // ... create objects and push them into all array
     */
    registerForever: function(arr){
        if (Object.prototype.toString.call(arr) !== "[object Array]")
            arr = Array.prototype.slice.call(arguments);
	this._registeredObjects = arr;
	return this;
    },
    /**
     * Cancel registration of an object.
     * @param {RaphaelObject|Shape} obj
     * @param {string} cap "start|end|both" cap to unregister default: "both"
     * @return {Joint}
     * @example j.unregister(circle, "end");
     */
    unregister: function(obj, cap){
	cap = cap || "both";

	var index = -1;
	for (var i = 0, len = this._registeredObjects.length; i < len; i++){
            var capToStick = this._registeredObjects[i].yourself()._capToStick || "both";
	    if (this._registeredObjects[i] === obj && capToStick === cap){
		index = i;
		break;
	    }
	}
	if (index !== -1){
	    this._registeredObjects.splice(index, 1);
	}
	return this;
    },
    /**
     * @return {array} Registered Objects.
     */
    registeredObjects: function(){
        return this._registeredObjects;
    },
    /**
     * Set the vertices of the connection
     * @param {array} vertices Array of points (vertices) - either of the form: {x: 5, y; 10} or "5 10" or "5@10"
     * @return {Joint}
     */
    setVertices: function(vertices){
        this._setVertices(vertices);
        this.update();
        return this;
    },
    /**
     * Set connection vertices.
     * @private
     */
    _setVertices: function(vertices) {
	var conVertices = this._opt.vertices = [], p;
	// cast vertices to points
	for (var i = 0, l = vertices.length; i < l; i++){
            p = (vertices[i].y === undefined) ?
                    point(vertices[i]) : point(vertices[i].x, vertices[i].y);
	    conVertices.push(p);
	}
	return this;
    },
    /**
     * Get connection vertices.
     * @return {array} array of connection vertices
     */
    getVertices: function(){
	return this._opt.vertices;
    },
    /**
     * Toggle the connection smoothing (bezier/straight).
     * @return {Joint}
     */
    toggleSmoothing: function(){
	this._opt.beSmooth = !this._opt.beSmooth;
	this.update();
	return this;
    },
    /**
     * Find out whether the connection is smooth or not.
     * @return {boolean} true if connection is smooth
     */
    isSmooth: function(){
	return this._opt.beSmooth;
    },
    /**
     * Set a label of the connection.
     * @param {string|array} str label(s)
     * @return {Joint}
     */
    label: function(str){
        this._opt.label = isArray(str) ? str : [str];
        for (var i = 0; i < str.length; i++) {
            this._opt.labelAttrs[i] = this._opt.labelAttrsDefault;
            this._opt.labelBoxAttrs[i] = this._opt.labelBoxAttrsDefault;
        }
	this.update();
	return this;
    },
    /**
     * Register callback function on various events.
     * @link Callbacks
     * @param {string} evt "justConnected"|"disconnected"|"justBroken"|"wiring"|"objectMoving"
     * @param fnc Callback
     * @return {Joint}
     * @example
     * j.registerCallback("justConnected", function(side){ ... this points to the object the joint was just connected to ... });
     * j.registerCallback("disconnected", function(side){ ... this points to the object the joint was just disconnected from ... });
     * j.registerCallback("justBroken", function(mousePos){ ... this points to the joint object ... });
     * j.registerCallback("wiring", function(mousePos){ ... this points to the joint object ... });
     * j.registerCallback("objectMoving", function(obj){ ... this points to the joint object ... });
     *
     * j.registerCallback("justConnected", function(side){
     *   if (side === "start"){
     *     console.log("Start cap connected.");
     *   } else {  // side === "end"
     *     console.log("End cap connected");
     *   }
     * });
     */
    registerCallback: function(evt, fnc){
	this._callbacks[evt] = fnc;
	return this;
    },
    /**
     * Straighten the bent connection path.
     * @return {Joint}
     */
    straighten: function(){
	this._opt.vertices = [];
	this.update();
	return this;
    },
    /**
     * Show/hide handle(s).
     * If a connection arrow is, e.g., of type none, it is difficult to grab the end of the connection.
     * For these cases, you can use handles, which are just simple circles showing at the end of a connection.
     * @param {string} cap &optional [start|end] Specifies on what side handle should be shown.
     * @return {Joint}
     */
    toggleHandle: function(cap){
	var handle = this._opt.handle;
	if (!cap){
	    handle.start.enabled = !handle.start.enabled;
	    handle.end.enabled = !handle.end.enabled;
	} else {
	    handle[cap].enabled = !handle[cap].enabled;
	}
	this.update();
	return this;
    },
    /**
     * Show handle.
     * @return {Joint}
     */
    showHandle: function(cap){
	var handle = this._opt.handle;
	if (!cap){
	    handle.start.enabled = true;
	    handle.end.enabled = true;
	} else {
	    handle[cap].enabled = true;
	}
	this.update();
	return this;
    },
    /**
     * Hide handle.
     * @return {Joint}
     */
    hideHandle: function(cap){
	var handle = this._opt.handle;
	if (!cap){
	    handle.start.enabled = false;
	    handle.end.enabled = false;
	} else {
	    handle[cap].enabled = false;
	}
	this.update();
	return this;
    },
    /**
     * Set bounding box correction.
     * This advanced feature of Joint library allows you to shift a point to which a connection sticks.
     * You can for example modify a connection to point to the center of an object or you can set a distance
     * between an object and a connection arrow.
     * @param {object} [corr] correction Correction
     * @param {string} [corr.type] fake type of an object to which a cap points
     * @param {number} [corr.x] x-axis shift of an object bounding box
     * @param {number} [corr.y] y-axis shift of an object bounding box
     * @param {number} [corr.width] change in an object bounding box width (can be negative)
     * @param {number} [corr.height] change in an object bounding box height (can be negative)
     * @param {string} cap "start|end"|undefined cap (undefined === both caps)
     * @return {Joint}
     * @example
     * // 1.) both sides of the connection will point to the center of
     * //     a circular object with radius == 30
     * j.setBBoxCorrection({
     *   type: "ellipse",
     *   x: 30,
     *   y: 30,
     *   width: -60,
     *   height: -60
     * });
     *
     * // 2.) keep 20px distance between connection's arrow
     * //     and a circular object
     * j.setBBoxCorrection({
     *   type: "ellipse",
     *   x: -20,
     *   y: -20,
     *   width: 40,
     *   height: 40
     * });
     */
    setBBoxCorrection: function(corr, cap){
	if (!cap){
	    this._opt.bboxCorrection.start = this._opt.bboxCorrection.end = corr;
	} else {
	    this._opt.bboxCorrection[cap] = corr;
	}
	this.update();
	return this;
    },

    /**
     * Highlight connection.
     * Note that highlight diseappears after the first update.
     * @return {Joint} Return this.
     */
    highlight: function(color){
        color = color || "red";
	this.connection().attr("stroke", color);
	return this;
    },

    /**
     * Unhighlight connection.
     * @return {Joint} Return this.
     */
    unhighlight: function(){
	this.connection().attr("stroke", this._opt.attrs.stroke || "#000");
	return this;
    }
};

/**
 * Reference to current joint when an object is dragging
 * can be global across all raphael 'worlds' because only one object can be dragged at a time.
 * @private
 * @type Joint
 */
Joint.currentJoint = null;

/**
 * Set a paper for graphics rendering.
 * @param {Raphael|number,number,number,number|string,number,number|HTMLElement} p
 * @return {Raphael} Paper.
 * @example
 * // create paper from existing HTMLElement with id "world" specifying width and height
 * Joint.paper("world", 640, 480);
 * // create paper specifying x, y position and width and height
 * Joint.paper(50, 50, 640, 480);
 * // paper is created from the HTMLElement with id "world"
 * Joint.paper(document.getElementById("world"));
 * // create paper using Raphael
 * Joint.paper(Raphael("world", 640, 480));
 */
Joint.paper = function paper(){
    var p = arguments[0];
    if (p === undefined){
	return this._paper;
    }
    this._paperArguments = arguments;	// save for later reset
    if (!(p instanceof global.Raphael)){
	return (this._paper = global.Raphael.apply(global, arguments));
    }
    return (this._paper = p);
};

/**
 * Clear paper, reset again.
 * @example
 * // create paper from existing HTMLElement with id "world" specifying width and height
 * Joint.paper("world", 640, 480);
 * // ... draw objects, diagrams, etc. ...
 * Joint.resetPaper();
 * // paper is clear and ready for next usage
 */
Joint.resetPaper = function resetPaper(){
    if (!this._paper){
	return;
    }
    var canvas = this._paper.canvas;
    canvas.parentNode.removeChild(canvas);
    Joint.paper.apply(Joint, this._paperArguments);
};

    // get an arrow object
Joint.getArrow = function(type, size, attrs){
    if (!size){
	size = 2; // default
    }
    var arrow = Joint.arrows[type](size);
    if (!arrow.attrs) arrow.attrs = {};

    if (attrs){
	for (var key in attrs){
	    arrow.attrs[key] = attrs[key];
	}
    }
    return arrow;
};

/**
 * This object contains predefined arrow types. Currently, there are only two types: none and basic.
 * These are considered general types and are suitable for most diagrams. Nevertheless, new arrows
 * can be easily added. See arrows.js plugin, which provides some fancier arrows.
 * The names can be used as startArrow|endArrow types.
 * @example circle.joint(rect, { startArrow: { type: basic, size: 5, attrs: ... } });
 */
Joint.arrows = {
    none: function(size){
	if (!size){ size = 2; }
	return {
	    path: ["M",size.toString(),"0","L",(-size).toString(),"0"],
	    dx: size,
	    dy: size,
            attrs: { opacity: 0 }
	};
    },
    basic: function(size){
	if (!size){ size = 5; }
   	return {
	    path: ["M",size.toString(),"0",
		   "L",(-size).toString(),(-size).toString(),
		   "L",(-size).toString(),size.toString(),"z"],
	    dx: size,
	    dy: size,
	    attrs: {
		stroke: "black",
		fill: "black"
	    }
	};
    }
};

/**
 * Get an absolute position of an element.
 * @private
 * @return {Point}
 */
Joint.findPos = function(el){
    var p = point(0, 0);
    if (el.offsetParent){
	while (el){
	    p.offset(el.offsetLeft, el.offsetTop);
	    el = el.offsetParent;
	}
    } else {
	// firefox (supposing el is Raphael canvas element)
	p.offset(el.parentNode.offsetLeft, el.parentNode.offsetTop);
    }
    return p;
};
/**
 * Get the mouse position relative to the raphael paper.
 * @private
 * @param {Event} e Javascript event object
 * @param {Element} el DOM element
 * @return {Point}
 */
Joint.getMousePosition = function(e, el){
    var pos;
    if (e.pageX || e.pageY) {
        pos = point(e.pageX, e.pageY);
    } else {
	var
	docEl = document.documentElement,
	docBody = document.body;
	pos = point(e.clientX + (docEl.scrollLeft || docBody.scrollLeft) - docEl.clientLeft,
		    e.clientY + (docEl.scrollTop || docBody.scrollTop) - docEl.clientTop);
    }
    var rp = Joint.findPos(el);
    return point(pos.x - rp.x, pos.y - rp.y);
};
/**
 * MouseMove event callback.
 * @private
 * @param {Event} e
 */
Joint.mouseMove = function(e){
    if (Joint.currentJoint !== null){
	var joint = Joint.currentJoint;
	if (joint.state === joint.STARTCAPDRAGGING ||
	    joint.state === joint.ENDCAPDRAGGING){
	    joint.capDragging(e);
	} else if (joint.state === joint.CONNECTIONWIRING){
	    joint.connectionWiring(e);
	}
    }
};
/**
 * MouseUp event callback.
 * @private
 * @param {Event} e
 */
Joint.mouseUp = function(e){
    if (Joint.currentJoint !== null){
	var joint = Joint.currentJoint;
	if (joint.state === joint.STARTCAPDRAGGING ||
	    joint.state === joint.ENDCAPDRAGGING){
	    joint.capEndDragging();
	}
    }
    Joint.currentJoint = null;
};

Joint.fixEvent = function(event) {
    // add W3C standard event methods
    event.preventDefault = Joint.fixEvent.preventDefault;
    event.stopPropagation = Joint.fixEvent.stopPropagation;
    return event;
};
Joint.fixEvent.preventDefault = function() {
    this.returnValue = false;
};
Joint.fixEvent.stopPropagation = function() {
    this.cancelBubble = true;
};
Joint.handleEvent = function(event){
    var returnValue = true;
    // grab the event object (IE uses a global event object)
    event = event || Joint.fixEvent(((global.ownerDocument || global.document || global).parentWindow || global).event);
    // get a reference to the hash table of event handlers
    var handlers = this.events[event.type];
    // execute each event handler
    for (var i in handlers) {
	this.$$handleEvent = handlers[i];
	if (this.$$handleEvent(event) === false) {
	    returnValue = false;
	}
    }
    return returnValue;
};
Joint.addEvent = function(element, type, handler){
    if (element.addEventListener) {
	element.addEventListener(type, handler, false);
    } else {
	// assign each event handler a unique ID
	if (!handler.$$guid){ handler.$$guid = Joint.addEvent.guid++; }
	// create a hash table of event types for the element
	if (!element.events){ element.events = {}; }
	// create a hash table of event handlers for each element/event pair
	var handlers = element.events[type];
	if (!handlers) {
	    handlers = element.events[type] = {};
	    // store the existing event handler (if there is one)
	    if (element["on" + type]) {
		handlers[0] = element["on" + type];
	    }
	}
	// store the event handler in the hash table
	handlers[handler.$$guid] = handler;
	// assign a global event handler to do all the work
	element["on" + type] = Joint.handleEvent;
    }
};
// a counter used to create unique IDs
Joint.addEvent.guid = 1;

Joint.removeEvent = function(element, type, handler){
    if (element.removeEventListener) {
	element.removeEventListener(type, handler, false);
    } else {
	// delete the event handler from the hash table
	if (element.events && element.events[type]){
	    delete element.events[type][handler.$$guid];
	}
    }
};

/*
 * @todo register handlers only if draggable caps
 * are allowed in options. Applications may not need it.
 */
Joint.addEvent(document, "mousemove", Joint.mouseMove);
Joint.addEvent(document, "mouseup", Joint.mouseUp);

var JointDOMBuilder = {
    init: function(paper, opt, start, end, jointLocation, connectionPathCommands, labelLocation){
	this.paper = paper;
	this.opt = opt;
	this.start = start;
	this.end = end;
	this.jointLocation = jointLocation;
	this.connectionPathCommands = connectionPathCommands;
	this.labelLocation = labelLocation;
	return this;
    },
    dummy: function(startOrEnd, pos, opt){
	startOrEnd.dummy = true;
	startOrEnd.shape = this.paper.circle(pos.x, pos.y, opt.radius).attr(opt.attrs);
	startOrEnd.shape.show();
	return startOrEnd.shape;
    },
    dummyStart: function(){
	return this.dummy(this.start, this.jointLocation.start.bound, this.opt.dummy.start);
    },
    dummyEnd: function(){
	return this.dummy(this.end, this.jointLocation.end.bound, this.opt.dummy.end);
    },
    handleStart: function(){
	var opt = this.opt.handle.start;
	if (!opt.enabled) return undefined;
	var pos = this.jointLocation.start.bound;
	return this.paper.circle(pos.x, pos.y, opt.radius).attr(opt.attrs);
    },
    handleEnd: function(){
	var opt = this.opt.handle.end;
	if (!opt.enabled) return undefined;
	var pos = this.jointLocation.end.bound;
	return this.paper.circle(pos.x, pos.y, opt.radius).attr(opt.attrs);
    },
    connection: function(){
	var opt = this.opt, paths = [],
	    con = this.paper.path(this.connectionPathCommands.join(" ")).attr(opt.attrs);
        if (opt.subConnectionAttrs) {
            var i = 0, l = opt.subConnectionAttrs.length, 
                length = con.getTotalLength();
            for (; i < l; i++) {
                var attrs = opt.subConnectionAttrs[i];
                var from = attrs.from || 2, to = attrs.to || 1;
                from = from > length ? length : from;
                from = from < 0 ? length + from : from;
                from = from > 1 ? from : length * from;
                to = to > length ? length : to;
                to = to < 0 ? length + to : to;
                to = to > 1 ? to : length * to;                
                var subPath = this.paper.path(con.getSubpath(from, to)).attr(attrs);
                subPath.node.style.cursor = opt.cursor;
                paths.push(subPath);
            }
        }
	con.node.style.cursor = opt.cursor;
	con.show();
	return [con].concat(paths);
    },
    label: function(){
	if (this.opt.label === undefined) return undefined;
	var labels = isArray(this.opt.label) ? this.opt.label : [this.opt.label],
            attrs = this.opt.labelAttrs,
            len = labels.length, i = 0, components = [];

        for (; i < len; i++) {
            var pos = this.labelLocation[i],
	        labelText = this.paper.text(pos.x, pos.y + (attrs[i].offset || 0), labels[i]).attr(attrs[i]),
	        bb = labelText.getBBox(),
                padding = attrs[i].padding || 0,
	        labelBox = this.paper.rect(bb.x - padding, bb.y - padding + (attrs[i].offset || 0), bb.width + 2*padding, bb.height + 2*padding).attr(this.opt.labelBoxAttrs[i]);
	    labelText.insertAfter(labelBox);
            components.push(labelText, labelBox)
        }
	return components;
    },
    startCap: function(){
	var opt = this.opt.arrow.start,
	    startCap = this.paper.path(opt.path.join(" ")).attr(opt.attrs);
	startCap.translate(this.jointLocation.start.translate.x,
			   this.jointLocation.start.translate.y);
	startCap.rotate(this.jointLocation.start.rotate);
	startCap.show();
	return startCap;
    },
    endCap: function(){
	var opt = this.opt.arrow.end,
	    endCap = this.paper.path(opt.path.join(" ")).attr(opt.attrs);
	endCap.translate(this.jointLocation.end.translate.x,
			 this.jointLocation.end.translate.y);
	endCap.rotate(this.jointLocation.end.rotate);
	endCap.show();
	return endCap;
    }
};

/**
 * Geometry-Primitives.
 */

/**
 * Point object.
 * @constructor
 */
function Point(x, y){
    var xy;
    if (y === undefined){
        // from string
        xy = x.split(x.indexOf("@") === -1 ? " " : "@");
        this.x = parseInt(xy[0], 10);
        this.y = parseInt(xy[1], 10);
    } else {
        this.x = x;
        this.y = y;
    }
}
function point(x, y){ return new Point(x, y); }

Point.prototype = {
    constructor: Point,
    _isPoint: true,

    toString: function(){ return this.x + "@" + this.y; },

    deepCopy: function(){ return point(this.x, this.y); },
    /**
     * If I lie outside rectangle r, return the nearest point on the boundary of rect r,
     * otherwise return me.
     * (see Squeak Smalltalk, Point>>adhereTo:)
     * @param {Rect} r
     * @return {Point}
     */
    adhereToRect: function(r){
	if (r.containsPoint(this)){
	    return this;
	}
	this.x = mmin(mmax(this.x, r.x), r.x + r.width);
	this.y = mmin(mmax(this.y, r.y), r.y + r.height);
	return this;
    },

    /**
     * Compute the angle between me and p and the x axis.
     * (cartesian-to-polar coordinates conversion)
     * @param {Point} p
     * @return {object} theta in degrees and radians
     */
    theta: function(p){
	var y = -(p.y - this.y),	// invert the y-axis
	x = p.x - this.x,
	rad = atan2(y, x);
	if (rad < 0){ // correction for III. and IV. quadrant
	    rad = 2*PI + rad;
	}
	return {
	    degrees: 180*rad / PI,
	    radians: rad
	};
    },

    /**
     * @return {number} distance between me and point p
     */
    distance: function(p){
	return line(this, p).length();
    },

    /**
     * Offset me by the specified amount.
     */
    offset: function(dx, dy){
	this.x += dx;
	this.y += dy;
	return this;
    },

    /**
     * Scale the line segment between (0,0) and me to have a length of len
     */
    normalize: function(len){
	var s = len / sqrt((this.x*this.x) + (this.y*this.y));
	this.x = s * this.x;
	this.y = s * this.y;
	return this;
    }
};

/**
 * Alternative constructor, from polar coordinates.
 */
Point.fromPolar = function(r, angle){
    return point(r * cos(angle), r * sin(angle));
};


/**
 * Line object.
 */
function Line(p1, p2){
    this.start = p1;
    this.end = p2;
}

function line(p1, p2) { return new Line(p1, p2); }

Line.prototype = {
    constructor: Line,

    toString: function(){
	return "start: " + this.start.toString() + " end:" + this.end.toString();
    },

    /**
     * @return {double} length of the line
     */
    length: function(){ return sqrt(this.squaredLength()); },

    /**
     * @return {integer} length without sqrt
     * @note for applications where the exact length is not necessary (e.g. compare only)
     */
    squaredLength: function(){
	var
	x0 = this.start.x, y0 = this.start.y,
	x1 = this.end.x, y1 = this.end.y;
	return (x0 -= x1)*x0 + (y0 -= y1)*y0;
    },

    /**
     * @return {point} my midpoint
     */
    midpoint: function(){
	return point((this.start.x + this.end.x) / 2,
		     (this.start.y + this.end.y) / 2);
    },


    /**
     * @return {point} where I intersect l.
     * @see Squeak Smalltalk, LineSegment>>intersectionWith:
     */
    intersection: function(l){
	var pt1Dir = point(this.end.x - this.start.x, this.end.y - this.start.y),
	pt2Dir = point(l.end.x - l.start.x, l.end.y - l.start.y),
	det = (pt1Dir.x * pt2Dir.y) - (pt1Dir.y * pt2Dir.x),
	deltaPt = point(l.start.x - this.start.x, l.start.y - this.start.y),
	alpha = (deltaPt.x * pt2Dir.y) - (deltaPt.y * pt2Dir.x),
	beta = (deltaPt.x * pt1Dir.y) - (deltaPt.y * pt1Dir.x);

	if (det === 0 ||
	    alpha * det < 0 ||
	    beta * det < 0){
	    return null;	// no intersection
	}

	if (det > 0){
	    if (alpha > det || beta > det){
		return null;
	    }
	} else {
	    if (alpha < det || beta < det){
		return null;
	    }
	}
	return point(this.start.x + (alpha * pt1Dir.x / det),
		     this.start.y + (alpha * pt1Dir.y / det));
    }
};

/**
 * Rectangle object.
 */
function Rect(o){
    this.x = o.x;
    this.y = o.y;
    this.width = o.width;
    this.height = o.height;
}

function rect(o){
    if (typeof o.width === "undefined"){
	return new Rect({x: arguments[0],
			 y: arguments[1],
			 width: arguments[2],
			 height: arguments[3]});
    }
    return new Rect(o);
}

Rect.prototype = {
    constructor: Rect,

    toString: function(){
	return "origin: " + this.origin().toString() + " corner: " + this.corner().toString();
    },

    origin: function(){ return point(this.x, this.y); },
    corner: function(){ return point(this.x + this.width, this.y + this.height); },
    topRight: function(){ return point(this.x + this.width, this.y); },
    bottomLeft: function(){ return point(this.x, this.y + this.height); },
    center: function(){ return point(this.x + this.width/2, this.y + this.height/2); },

    /**
     * @return {boolean} true if rectangles intersect
     */
    intersect: function(r){
	var myOrigin = this.origin(),
	myCorner = this.corner(),
	rOrigin = r.origin(),
	rCorner = r.corner();
	if (rCorner.x <= myOrigin.x){ return false; }
	if (rCorner.y <= myOrigin.y){ return false; }
	if (rOrigin.x >= myCorner.x){ return false; }
	if (rOrigin.y >= myCorner.y){ return false; }
	return true;
    },

    /**
     * @return {string} (left|right|top|bottom) side which is nearest to point
     * @see Squeak Smalltalk, Rectangle>>sideNearestTo:
     */
    sideNearestToPoint: function(p){
	var distToLeft = p.x - this.x,
	distToRight = (this.x + this.width) - p.x,
	distToTop = p.y - this.y,
	distToBottom = (this.y + this.height) - p.y,
	closest = distToLeft,
	side = "left";
	if (distToRight < closest){
	    closest = distToRight;
	    side = "right";
	}
	if (distToTop < closest){
	    closest = distToTop;
	    side = "top";
	}
	if (distToBottom < closest){
	    closest = distToBottom;
	    side = "bottom";
	}
	return side;
    },

    /**
     * @return {bool} true if point p is insight me
     */
    containsPoint: function(p){
	if (p.x > this.x && p.x < this.x + this.width &&
	    p.y > this.y && p.y < this.y + this.height){
	    return true;
	}
	return false;
    },

    /**
     * @return {point} a point on my border nearest to parameter point
     * @see Squeak Smalltalk, Rectangle>>pointNearestTo:
     */
    pointNearestToPoint: function(p){
	if (this.containsPoint(p)){
	    var side = this.sideNearestToPoint(p);
	    switch (side){
	    case "right": return point(this.x + this.width, p.y);
	    case "left": return point(this.x, p.y);
	    case "bottom": return point(p.x, this.y + this.height);
	    case "top": return point(p.x, this.y);
	    }
	} else {
	    return p.adhereToRect(this);
	}
    },

    /**
     * Find point on me where line starting
     * from my center ending in point p intersects my boundary.
     */
    boundPoint: function(p){
	var center = point(this.x + this.width/2, this.y + this.height/2);
	// (clockwise, starting from the top side)
	var sides = [
	    line(this.origin(), this.topRight()),
	    line(this.topRight(), this.corner()),
	    line(this.corner(), this.bottomLeft()),
	    line(this.bottomLeft(), this.origin())
	],
	connector = line(center, p);
	for (var i = sides.length - 1; i >= 0; --i){
	    var intersection = sides[i].intersection(connector);
	    if (intersection !== null){
		return intersection;
	    }
	}
	// assert(false)
    },

    /**
     * Move and expand me.
     * @param r {rectangle} representing deltas
     */
    moveAndExpand: function(r){
	this.x += r.x;
	this.y += r.y;
	this.width += r.width;
	this.height += r.height;
	return this;
    }
};

/**
 * Ellipse object.
 */
function Ellipse(c, a, b){
    this.x = c.x;
    this.y = c.y;
    this.a = a;
    this.b = b;
}

function ellipse(c, a, b){ return new Ellipse(c, a, b); }

Ellipse.prototype = {
    constructor: Ellipse,

    bbox: function(){
	return rect({x: this.x - this.a, y: this.y - this.b, width: 2*this.a, height: 2*this.b});
    },

    /**
     * Find point on me where line from my center to
     * point p intersects my boundary.
     * @see Squeak Smalltalk, EllipseMorph>>intersectionWithLineSegmentFromCenterTo:
     */
    intersectionWithLineFromCenterToPoint: function(p){
	var dx = p.x - this.x,
	dy = p.y - this.y;
	if (dx === 0){
	    return this.bbox().pointNearestToPoint(p);
	}

	var m = dy / dx,
	mSquared = m * m,
	aSquared = this.a * this.a,
	bSquared = this.b * this.b,
	x = sqrt(1 / ((1 / aSquared) + (mSquared / bSquared)));
	if (dx < 0){
	    x = -x;
	}
	var y = m * x;
	return point(this.x + x, this.y + y);
    }

};

/**
 * Bezier segment object.
 */
function BezierSegment(p0, p1, p2, p3){
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
}

function bezierSegment(p0, p1, p2, p3){
    return new BezierSegment(p0, p1, p2, p3);
}

BezierSegment.prototype = {
    constructor: BezierSegment,

    /**
     * Get a point on me at the specified time t.
     */
    getPoint: function(t){
	var
	a = 1 - t,	// (1 - t)
	b = a*a,	// (1 - t)^2
	c = b*a,	// (1 - t)^3
	tt = t*t,	// t^2
	ttt = tt*t;	// t^3

	return point(c*this.p0.x + 3*b*t*this.p1.x + 3*a*tt*this.p2.x + ttt*this.p3.x,
		     c*this.p0.y + 3*b*t*this.p1.y + 3*a*tt*this.p2.y + ttt*this.p3.y);
    }

};

/**
 * Various methods for Bezier curves manipulation.
 */
function Bezier(){}

/**
 * Cubic Bezier curve path through points.
 * Ported from ActionScript implementation by Andy Woodruff (http://cartogrammar.com/blog)
 */
Bezier.curveThroughPoints = function(points, z, angleFactor){
    // default values
    if (typeof z === "undefined"){
	z = 0.5;
    }
    if (typeof angleFactor === "undefined"){
	angleFactor = 0.75;
    }

    var path = [];	// the result SVG path as an array of path commands
    if (points.length < 2){
	throw new Error("Points array must have minimum of two points.");
    }

    var p = [points[0]];
    // remove duplicate neighbours
    for (var i = 1, len = points.length; i < len; i++){
	if (points[i].x != points[i-1].x || points[i].y != points[i-1].y){
	    p.push(points[i]);
	}
    }

    // z is_in (0,1]
    if (z <= 0){
	z = 0.5;
    } else if (z > 1){
	z = 1;
    }

    // angleFactor is_in [0,1]
    if (angleFactor < 0){
	angleFactor = 0;
    } else if (angleFactor > 1){
	angleFactor = 1;
    }

    /**
     * Calculate all the curve control points.
     */

    // None of this junk will do any good if there are only two points
    if (p.length > 2){
	// Ordinarily, curve calculations will start with the second point
	// and go through the second-to-last point
	var firstPt = 1;
	var lastPt = p.length-1;
	// Check if this is a closed line
	if (p[0].x == p[lastPt].x && p[0].y == p[lastPt].y){
	    // Include first and last points in curve calculations
	    firstPt = 0;
	    lastPt = p.length;
	}

	// An array to store the two control points for each point
	var controlPts = [];
	// Loop through all the points (except the first and last
	// if not a closed line) to get curve control points for each.
	for (var i = firstPt; i < lastPt; i++) {
	    // The previous, current, and next points

	    // If the first point (of a closed line), use the
	    // second-to-last point as the previous point
	    var p0 = (i-1 < 0) ? p[p.length-2] : p[i-1];
	    var p1 = p[i];
	    // If the last point (of a closed line), use the
	    // second point as the next point
	    var p2 = (i+1 == p.length) ? p[1] : p[i+1];

	    // Distance from previous point to current point
	    var a = p0.distance(p1);
	    // Correct for near-zero distances, a cheap way to prevent
	    // division by zero
	    if (a < 0.001){ a = 0.001; }
	    // Distance from current point to next point
	    var b = p1.distance(p2);
	    if (b < 0.001){ b = 0.001; }
	    // Distance from previous point to next point
	    var c = p0.distance(p2);
	    if (c < 0.001){ c = 0.001; }
	    var cos = (b*b+a*a-c*c)/(2*b*a);
	    // Make sure above value is between -1 and 1 so that acos will work
	    if (cos < -1){ cos = -1; }
	    else if (cos > 1){ cos = 1; }
	    // Angle formed by the two sides of the triangle
	    // (described by the three points above) adjacent to the current point
	    var C = acos(cos);
	    // Duplicate set of points. Start by giving previous and next points
	    // values RELATIVE to the current point.
	    var aPt = point(p0.x-p1.x,p0.y-p1.y);
	    var bPt = point(p1.x,p1.y);
	    var cPt = point(p2.x-p1.x,p2.y-p1.y);

	    /* We'll be adding adding the vectors from the previous and next points
	       to the current point, but we don't want differing magnitudes (i.e.
	       line segment lengths) to affect the direction of the new vector.
               Therefore we make sure the segments we use, based on the duplicate points
	       created above, are of equal length. The angle of the new vector will
               thus bisect angle C (defined above) and the perpendicular to this is
               nice for the line tangent to the curve. The curve control points will
               be along that tangent line.
	    */
	    if (a > b){
		// Scale the segment to aPt (bPt to aPt) to the size of b
		// (bPt to cPt) if b is shorter.
		aPt.normalize(b);
	    } else if (b > a){
		// Scale the segment to cPt (bPt to cPt) to the size of a (aPt to bPt)
		// if a is shorter.
		cPt.normalize(a);
	    }
	    // Offset aPt and cPt by the current point to get them back to
	    // their absolute position.
	    aPt.offset(p1.x,p1.y);
	    cPt.offset(p1.x,p1.y);

	    // Get the sum of the two vectors, which is perpendicular to the line
	    // along which our curve control points will lie.

	    // x component of the segment from previous to current point
	    var ax = bPt.x-aPt.x;
	    var ay = bPt.y-aPt.y;
	    // x component of the segment from next to current point
	    var bx = bPt.x-cPt.x;
	    var by = bPt.y-cPt.y;
	    // sum of x components
	    var rx = ax + bx;
	    var ry = ay + by;
	    // Correct for three points in a line by finding the angle between just two of them
	    if (rx === 0 && ry === 0){
		// Really not sure why this seems to have to be negative
		rx = -bx;
		ry = by;
	    }
	    // Switch rx and ry when y or x difference is 0. This seems to prevent
	    // the angle from being perpendicular to what it should be.
	    if (ay === 0 && by === 0){
		rx = 0;
		ry = 1;
	    } else if (ax === 0 && bx === 0){
		rx = 1;
		ry = 0;
	    }
	    // length of the summed vector - not being used, but there it is anyway
	    // var r = sqrt(rx*rx+ry*ry);
	    // angle of the new vector
	    var theta = atan2(ry,rx);
	    // Distance of curve control points from current point: a fraction
	    // the length of the shorter adjacent triangle side
	    var controlDist = mmin(a,b)*z;
	    // Scale the distance based on the acuteness of the angle. Prevents
	    // big loops around long, sharp-angled triangles.
	    var controlScaleFactor = C/PI;
	    // Mess with this for some fine-tuning
	    controlDist *= ((1-angleFactor) + angleFactor*controlScaleFactor);
	    // The angle from the current point to control points:
	    // the new vector angle plus 90 degrees (tangent to the curve).
	    var controlAngle = theta+PI/2;
	    // Control point 2, curving to the next point.
	    var controlPoint2 = Point.fromPolar(controlDist,controlAngle);
	    // Control point 1, curving from the previous point
	    // (180 degrees away from control point 2).
	    var controlPoint1 = Point.fromPolar(controlDist,controlAngle+PI);

	    // Offset control points to put them in the correct absolute position
	    controlPoint1.offset(p1.x,p1.y);
	    controlPoint2.offset(p1.x,p1.y);

	    /* Haven't quite worked out how this happens, but some control
	       points will be reversed. In this case controlPoint2 will be
               farther from the next point than controlPoint1 is.
	       Check for that and switch them if it's true.
	    */
	    if (controlPoint2.distance(p2) > controlPoint1.distance(p2)){
		// Add the two control points to the array in reverse order
		controlPts[i] = [controlPoint2,controlPoint1];
	    } else {
		// Otherwise add the two control points to the array in normal order
		controlPts[i] = [controlPoint1,controlPoint2];
	    }
	}//endfor (var i = firstPt; i < lastPt; i++) {

	// DRAW THE CURVE

	path.push("M", p[0].x, p[0].y);
	// console.log(controlPts);

	// If this isn't a closed line
	if (firstPt == 1){
	    // Draw a regular quadratic Bézier curve from the first to second points,
	    // using the first control point of the second point
	    path.push("S", controlPts[1][0].x,controlPts[1][0].y,p[1].x,p[1].y);
	}

	// Change to true if you want to use lineTo for straight lines of 3 or
	// more points rather than curves. You'll get straight lines but possible sharp corners!
	var straightLines = true;
	// Loop through points to draw cubic Bézier curves through the penultimate
	// point, or through the last point if the line is closed.
	for (var i = firstPt; i < lastPt - 1; i++){
	    // Determine if multiple points in a row are in a straight line
	    var isStraight = false;
	    if ( ( i > 0 && atan2(p[i].y-p[i-1].y,p[i].x-p[i-1].x) == atan2(p[i+1].y-p[i].y,p[i+1].x-p[i].x) )|| ( i < p.length - 2 && atan2(p[i+2].y-p[i+1].y,p[i+2].x-p[i+1].x) == atan2(p[i+1].y-p[i].y,p[i+1].x-p[i].x) ) ){
		isStraight = true;
	    }

	    if (straightLines && isStraight){
		path.push("L", p[i+1].x,p[i+1].y);
	    } else {
		// BezierSegment instance using the current point, its second control
		// point, the next point's first control point, and the next point
		var bezier = bezierSegment(p[i],controlPts[i][1],controlPts[i+1][0],p[i+1]);
		// Construct the curve out of 100 segments (adjust number for less/more detail)
		for (var t = 0.01; t < 1.01; t += 0.01){
		    // x,y on the curve for a given t
		    var val = bezier.getPoint(t);
		    path.push("L", val.x, val.y);
		}
	    }
	}
	// If this isn't a closed line
	if (lastPt == p.length-1){
	    // Curve to the last point using the second control point of the penultimate point.
	    path.push("S", controlPts[i][1].x,controlPts[i][1].y,p[i+1].x,p[i+1].y);
	}

	// just draw a line if only two points
    } else if (p.length == 2){
	path.push("M", p[0].x,p[0].y);
	path.push("L", p[1].x,p[1].y);
    }
    return path;
};

Joint.Point = Point;
Joint.point = point;
Joint.Rect = Rect;
Joint.rect = rect;
Joint.Line = Line;
Joint.line = line;
Joint.Ellipse = Ellipse;
Joint.ellipse = ellipse;
Joint.BezierSegment = BezierSegment;
Joint.bezierSegment = bezierSegment;
Joint.Bezier = Bezier;
Joint.Mixin = Mixin;
Joint.Supplement = Supplement;
Joint.DeepMixin = DeepMixin;
Joint.DeepSupplement = DeepSupplement;

/**
 * TODO: rotation support. there is a problem because
 * rotation does not set any attribute in this.attrs but
 * instead it sets transformation directly to let the browser
 * SVG engine compute the position.
 */
var _attr = global.Raphael.el.attr;
global.Raphael.el.attr = function(){
    // is it a getter or el is not a joint object?
    if ((arguments.length == 1 &&
	 (typeof arguments[0] === "string" || typeof arguments[0] === "array")) ||
	(typeof this.joints === "undefined")){
	return _attr.apply(this, arguments);	// yes
    }

    // old attributes
    var o = {};
    for (var key in this.attrs){
	o[key] = this.attrs[key];
    }

    _attr.apply(this, arguments);

    var
    n = this.attrs,	// new attributes
    positionChanged = false,
    strokeChanged = false;

    if (o.x != n.x || o.y != n.y ||	// rect/image/text
	o.cx != n.cx || o.cy != n.cy ||	// circle/ellipse
	o.path != n.path ||	// path
	o.r != n.r){	// radius
	positionChanged = true;
    }
    if (o.stroke != n.stroke){
	strokeChanged = true;
    }

    for (var i = this.joints().length - 1; i >= 0; --i){
	var joint = this.joints()[i];

	if (positionChanged){
	    joint.update();
	    joint.callback("objectMoving", joint, [this]);
	}
	//if (strokeChanged){}
    }
    return this;
};


/**
 * Create a joint between a Raphael object and to object.
 * @param {RaphaelObject} to
 * @param {object} [opts] opt {@link Joint}
 * @return {Joint}
 */
global.Raphael.el.joint = function(to, opt){
    Joint.paper(this.paper);
    return new Joint(this, to, opt);
};

/**
 * Return element unique id.
 */
global.Raphael.el.euid = function(){
    return Joint.generateEuid.call(this);
};

global.Raphael.el.yourself = function(){
    return this;
};

global.Raphael.el.joints = function(){
    return (this._joints || (this._joints = []));
};

global.Raphael.fn.euid = function(){
    return Joint.generateEuid.call(this);
};

})(this);	// END CLOSURE

(function(global){


/**
 * @name Joint.arrows
 * @namespace Additional ready-to-use arrows.
<h3>Creating your own arrows</h3>
  <p>New arrows can be easily added. Each arrow is a function of one parameter (size) returning an object 
     which describes the arrow. The object has four properties:</p>
  <ul>
    <li><i>path</i>: SVG path of arrow shape</li>
    <li><i>dx</i>: x-axis offset</li>
    <li><i>dy</i>: y-axis offset</li>
    <li><i>attrs</i>: SVG path attributes</li>
  </ul>
 <p>Let's say you want to create an arrow of a square shape. First of all, you need a SVG path describing 
    the square. Note that the symmetry of the square is along the origin (0, 0). After you have created the path, 
    you need to specify the dx, dy offsets. The offsets tell the Joint library where to start drawing the connection. 
    For our square arrow, they equal to its size. As the last thing, you can set some default path attributes 
    suitable for you arrows. A good practice is to set the fill attribute. Doing so allows you to grab your arrow 
    by mouse wherever inside your arrow shape.</p>
 <pre>
Joint.arrows.square = function(size){
    var minusSize = (-size).toString(); 
    size = size.toString();
    return {
        path: ["M", size, size,
               "L", minusSize, size,
               "L", minusSize, minusSize,
               "L", size, minusSize, "z"],
        dx: size,
        dy: size,
        attrs: {
            stroke: "black",
            fill: "white"
        }
    };
};
Joint({x: 20, y: 20}, {x: 300, y: 30}, {
  startArrow: {
    type: "square",
    size: 10
  }
});
 </pre>
 */
var arrows = global.Joint.arrows;

/**
 * Hand arrow.
 * @name Joint.arrows.hand
 * @memberOf Joint.arrows
 * @example 
Joint({x: 40, y: 40}, {x: 300, y: 70}, {
  startArrow: {
      type: "flower"
  },
  endArrow: {
      type: "hand"
  }
});
 */
arrows.hand = function(size){
    // size is scale here!
    size = size ? 1 + (0.1 * size) : 1;
    return {
	path: ["M","-15.681352","-5.1927657","C","-15.208304","-5.2925912","-14.311293","-5.5561164","-13.687993","-5.7783788","C","-13.06469","-6.0006406","-12.343434","-6.2537623","-12.085196","-6.3408738","C","-10.972026","-6.7163768","-7.6682017","-8.1305627","-5.9385615","-8.9719142","C","-4.9071402","-9.4736293","-3.9010109","-9.8815423","-3.7027167","-9.8783923","C","-3.5044204","-9.8752373","-2.6780248","-9.5023173","-1.8662751","-9.0496708","C","-0.49317056","-8.2840047","-0.31169266","-8.2208528","0.73932854","-8.142924","L","1.8690327","-8.0591623","L","2.039166","-7.4474021","C","2.1327395","-7.1109323","2.1514594","-6.8205328","2.0807586","-6.8020721","C","2.010064","-6.783614","1.3825264","-6.7940997","0.68622374","-6.8253794","C","-0.66190616","-6.8859445","-1.1814444","-6.8071497","-1.0407498","-6.5634547","C","-0.99301966","-6.4807831","-0.58251196","-6.4431792","-0.12850911","-6.4798929","C","1.2241412","-6.5892761","4.7877672","-6.1187783","8.420785","-5.3511477","C","14.547755","-4.056566","16.233479","-2.9820024","15.666933","-0.73209438","C","15.450654","0.12678873","14.920327","0.61899573","14.057658","0.76150753","C","13.507869","0.85232533","12.818867","0.71394493","9.8149232","-0.090643373","C","7.4172698","-0.73284018","6.1067424","-1.0191399","5.8609814","-0.95442248","C","5.6587992","-0.90118658","4.8309652","-0.89582008","4.0213424","-0.94250688","C","3.0856752","-0.99645868","2.5291546","-0.95219288","2.4940055","-0.82101488","C","2.4635907","-0.70750508","2.4568664","-0.61069078","2.4790596","-0.60585818","C","2.5012534","-0.60103228","2.9422761","-0.59725718","3.4591019","-0.59747878","C","3.9759261","-0.59770008","4.4500472","-0.58505968","4.512693","-0.56939128","C","4.7453841","-0.51117988","4.6195024","0.92436343","4.318067","1.650062","C","3.8772746","2.7112738","2.9836566","3.9064107","2.2797382","4.3761637","C","1.5987482","4.8306065","1.52359","4.9484512","1.8576616","5.0379653","C","1.9860795","5.0723748","2.2155555","4.9678227","2.3676284","4.8056312","C","2.6253563","4.5307504","2.6497332","4.5328675","2.7268401","4.8368824","C","2.8605098","5.3638848","2.3264901","6.4808604","1.6782299","7.0301956","C","1.3498639","7.30845","0.75844624","8.0404548","0.36396655","8.6568609","C","-0.58027706","10.132325","-0.69217806","10.238528","-1.4487256","10.377186","C","-2.2048498","10.515767","-4.6836995","9.9021604","-6.41268","9.1484214","C","-9.9464649","7.6078865","-10.697587","7.3186028","-12.142194","6.9417312","C","-13.020384","6.712621","-14.184145","6.4654454","-14.72833","6.3924328","C","-15.272516","6.3194263","-15.731691","6.241583","-15.748724","6.2194535","C","-15.813855","6.1348086","-16.609132","-4.7586323","-16.562804","-4.9315285","C","-16.551052","-4.9753876","-16.154402","-5.0929474","-15.681351","-5.192769","L","-15.681352","-5.1927657","z","M","11.288619","-1.446424","L","10.957631","-0.2111606","L","11.627189","-0.031753373","C","13.374637","0.43647423","14.580622","0.18262123","15.042031","-0.75056578","C","15.503958","-1.6847955","14.648263","-2.6070187","12.514834","-3.4742549","L","11.634779","-3.8320046","L","11.627191","-3.2568392","C","11.623019","-2.9405087","11.470661","-2.1258178","11.288619","-1.446424","z"],
	dx: size * 17, 
	dy: size * 17,
	attrs: {
            scale: size,
	    fill: "white"
	}
    };
};
/**
 * Flower arrow.
 * @name Joint.arrows.flower
 * @memberOf Joint.arrows
 */
arrows.flower = function(size){
    // size is scale here!
    size = size ? 1 + (0.1 * size) : 1;
    return {
	path: ["M","14.407634","0.14101164","C","13.49394","-0.67828198","12.640683","-1.3981484","11.695412","-1.9684748","C","9.0580339","-3.5615387","6.1975385","-4.0965167","3.8809003","-3.2050972","C","-1.0202735","-1.4355585","-2.2650956","-0.75266958","-6.1678175","-0.75266958","L","-6.1678175","-2.0100414","C","-1.8745566","-2.0888183","1.0024122","-3.7090503","1.8649218","-6.1147565","C","2.2734082","-7.1733737","2.0690534","-8.5444386","0.7737959","-9.8037723","C","-0.82956951","-11.36162","-5.2455289","-11.821547","-6.0950803","-7.2474282","C","-5.3751604","-7.7316963","-3.8041596","-7.6860056","-3.2477662","-6.7174716","C","-2.8775009","-5.9772878","-3.0228781","-5.1443269","-3.3412911","-4.7534348","C","-3.7218578","-4.1236184","-4.935379","-3.5168459","-6.1678175","-3.5168459","L","-6.1678175","-5.6886834","L","-8.5890734","-5.6886834","L","-8.5890734","-1.1787104","C","-9.8368017","-1.2379009","-10.838424","-1.918296","-11.394817","-3.1843135","C","-11.92063","-3.0214395","-12.984452","-2.2582108","-12.911997","-1.2099015","C","-14.045721","-1.0028338","-14.687381","-0.80225028","-15.717737","0.14101164","C","-14.687714","1.0836088","-14.046053","1.2744822","-12.911997","1.4815506","C","-12.984786","2.5298263","-11.92063","3.2930879","-11.394817","3.4559626","C","-10.838424","2.1902771","-9.8368017","1.5095164","-8.5890734","1.4503588","L","-8.5890734","5.9603315","L","-6.1678175","5.9603315","L","-6.1678175","3.788495","C","-4.935379","3.788495","-3.7218578","4.3958989","-3.3412911","5.0250837","C","-3.0228781","5.4159757","-2.8775009","6.2482381","-3.2477662","6.9891209","C","-3.8041596","7.9569902","-5.3751604","8.003345","-6.0950803","7.5190778","C","-5.2455353","12.093197","-0.82956631","11.643978","0.7737959","10.08583","C","2.0693864","8.827128","2.2734082","7.4453226","1.8649218","6.3864056","C","1.00208","3.980998","-1.8745566","2.3705098","-6.1678175","2.2920986","L","-6.1678175","1.0243179","C","-2.2650956","1.0243179","-1.0206064","1.7065088","3.8809003","3.4767455","C","6.1975385","4.367168","9.0580339","3.8331873","11.695412","2.2401238","C","12.640683","1.669431","13.493608","0.95964074","14.407634","0.14101164","z"],
	dx: size * 15, 
	dy: size * 15,
	attrs: {
            scale: size,
	    fill: "white"
	}
    };
};
/**
 * Rectangle arrow.
 * @name Joint.arrows.rect
 * @memberOf Joint.arrows
 */
arrows.rect = function(size){
    if (!size) { size = 5; }
    return {
	path: ["M",(3*size).toString(),size.toString(),
               "L",(-3*size).toString(),size.toString(),
               "L",(-3*size).toString(),(-size).toString(),
               "L", (3*size).toString(), (-size).toString(), "z"],
	dx: 3*size, 
	dy: 3*size,
	attrs: { 
	    stroke: "black",
	    fill: "white",             
	    "stroke-width": 1.0
	}
    };
};

})(this);

(function(global){	// BEGIN CLOSURE

var Joint = global.Joint;

var point = Joint.point;
var rect = Joint.rect;

/**
 * @name Joint.dia
 * @namespace Holds functionality related to all diagrams and their elements.
 */
var dia = Joint.dia = {
    /**
     * Current dragged object.
     * @private
     */
    _currentDrag: false,
    /**
     * Current zoomed object.
     * @private
     */
    _currentZoom: false,
    /**
     * Table with all registered objects.
     *  - registered objects can embed and can be embedded
     *  - the table is of the form: {RaphaelPaper1: [shape1, shape2, ...]}
     * @private
     */
    _registeredObjects: {},
    /**
     * Table whith all registered joints.
     *  - the table is of the form: {RaphaelPaper1: [joint1, joint2, ...]}
     * @private
     */
    _registeredJoints: {},
    /**
     * Create new joint and register it. All joints appearing in a diagram should
     * be created using this function. Otherwise they won't be registered and
     * therefore not serialized when needed.
     * @param {Object} args Joint parameters.
     * @see Joint
     * @return {Joint}
     */
    Joint: function(args){
	var j = Joint.apply(null, arguments);
	this.registerJoint(j);
	return j;
    },
    /**
     * Returns registered elements of the current paper.
     * @return {array} Array of registered elements.
     */
    registeredElements: function(){
	return (this._registeredObjects[Joint.paper().euid()] || (this._registeredObjects[Joint.paper().euid()] = []));
    },
    /**
     * Returns registered joints of the current paper.
     * @return {array} Array of registered joints.
     */
    registeredJoints: function(){
	return (this._registeredJoints[Joint.paper().euid()] || (this._registeredJoints[Joint.paper().euid()] = []));
    },
    /**
     * Register object to the current paper.
     * You don't have to use this method unless you really know what you're doing.
     * @param {Element|Joint} obj Object to be registered.
     * @return {Element|Joint} Registered object.
     */
    register: function(obj){
	(this._registeredObjects[Joint.paper().euid()] || (this._registeredObjects[Joint.paper().euid()] = [])).push(obj);
    },
    /**
     * Cancel registration of an element in the current paper.
     * @param {Element} obj Object to be unregistered.
     */
    unregister: function(obj){
	var register = (this._registeredObjects[Joint.paper().euid()] || (this._registeredObjects[Joint.paper().euid()] = [])),
	    idx = register.length;
	while (idx--)
	    if (register[idx] === obj)
		register.splice(idx, 1);
    },
    /**
     * Register joint to the current paper. Avoid registering the the same joint twice.
     * You don't have to use this method unless you really know what you're doing.
     * @param {Joint} j Joint object to be registered.
     */
    registerJoint: function(j){
	(this._registeredJoints[Joint.paper().euid()] || (this._registeredJoints[Joint.paper().euid()] = [])).push(j);
    },
    /**
     * Cancel registration of a joint in the current paper.
     * @param {Joint} j Joint to be unregistered.
     */
    unregisterJoint: function(j){
	var register = (this._registeredJoints[Joint.paper().euid()] || (this._registeredJoints[Joint.paper().euid()] = [])),
	    idx = register.length;
	while (idx--)
	    if (register[idx] === j)
		register.splice(idx, 1);
    }
};

/**
 * Abstract object of all diagram elements.
 * This object is never used directly, instead, specific diagram elements inherits from it.
 * Allows easy creation of new specific diagram elements preserving all features that Joint library and Joint.dia plugin offer.
 * <h3>Wrapper</h3>
 *  All custom elements must have a wrapper set. Wrapper is the key object that Joint library counts with.
 *  There cannot be any element without a wrapper. Usually it is an object which wraps all the subelements
 *  that a specific diagram element contains. The wrapper must be set in init method.
 *  To set a wrapper, use setWrapper(aWrapper) method. The single parameter to the method is a Raphaël vector object.
 *  Later on, you can access this object using wrapper property.
 * <h3>Inner</h3>
 *  Inner objects are subelements of an element. Although they are optional, they are commonly used. To add a subelement
 *  to the element, use addInner(anInner) method. It takes a Raphaël vector object as an argument. All inner objects are
 *  placed to an array that you can access using inner property.
 * <h3><i>init</i> method</h3>
 *  The <i>init</i> method has to be part of every element you create. It takes all element options as an argument,
 *  sets wrapper and adds inners.
 * <h3><i>joint</i> method</h3>
 *  If you have specific elements, in which connections are not controlled by wrapper, you can implement your own joint method.
 * <h3><i>zoom</i> method</h3>
 *  As Joint.dia library does not know how your specific element should behave after scaling, you can use zoom method to implement
 *  the desired behaviour.
 * @name Element
 * @memberOf Joint.dia
 * @constructor
 * @example
var mydia = Joint.dia.mydia = {};
var Element = Joint.dia.Element;

mydia.MyElement = Element.extend({
  // init method must be always presented
  init: function(properties){
    var p = this.properties;
    // parameters processing
    p.position = properties.position;
    p.radius = properties.radius || 30;
    // every element must have a wrapper
    this.setWrapper(this.paper.circle(p.position.x, p.position.y, p.radius));
    // optional inner elements
    this.addInner(this.paper.text(p.position.x, p.position.y, "my element"));
  }
});

// ...

var e = mydia.MyElement.create({
  position: {x: 50, y: 50},
  radius: 20
});
 */
var Element = dia.Element = function(){};

/**
 * Use this to instantiate particular elements.
 * @private
 */
Element.create = function(properties){
    var instance = new this(properties);
    if (instance.init) instance.init(properties);
    instance.defaults(instance.properties);
    instance.paper.safari();        // fix webkit bug
    return instance;
};

/**
 * @private
 */
Element.extend = function(prototype){
    var C = prototype.constructor = function(properties){
	this.construct(properties);
    };
    C.base = this;
    var proto = C.prototype = new this();
    Joint.Mixin(proto, prototype);
    Joint.Supplement(C, this);
    return C;
};

Element.prototype = {
    parentElement: null,
    toolbox: null,
    _isElement: true,
    // auxiliaries for scaling and translating
    lastScaleX: 1.0,
    lastScaleY: 1.0,
    dx: undefined,
    dy: undefined,
    // original bounding box (before scaling a translating)
    // set in setWrapper()
    origBBox: undefined,

    construct: function(properties){
	this.properties = {
	    dx: 0, dy: 0,		// translation
	    rot: 0,			// rotation
	    sx: 1.0, sy: 1.0,		// scale
	    module: this.module,
	    object: this.object,
	    parent: properties.parent
	};
	this.wrapper = null;
        this.shadow = null;
        this.shadowAttrs = {
            stroke: 'none', 
            fill: '#999', 
            translation: '7,7',
            opacity: 0.5
        };
	this.inner = [];
	// ghost attributes
	this.ghostAttrs = {
	    opacity: 0.5,
	    "stroke-dasharray": "-",
	    stroke: "black"
	};
	this._opt = {
	    draggable: true,	// enable dragging?
	    ghosting: false,		// enable ghosting?
	    toolbox: false		// enable toolbox?
	};

	this.paper = Joint.paper();
	dia.register(this); // register me in the global table
    },
    defaults: function(properties) {
        if (properties.shadow) {
            Joint.Mixin(this.shadowAttrs, properties.shadow);
            this.createShadow();
        }
    },
    /**
     * @methodOf Joint.dia.Element#
     * @return Element unique id.
     */
    euid: function(){
	return Joint.generateEuid.call(this);
    },
    // this is needed in joint library when
    // manipulating with a raphael object joints array
    // - just delegate joints array methods to the wrapper
    joints: function(){
	return this.wrapper.joints();
    },

    /**
     * Used in joint.js for unified access to the wrapper.
     * For all RaphaelObjects returns just this.
     * @private
     * @return {RaphaelObject} Return wrapper.
     */
    yourself: function(){
	return this.wrapper;
    },

    updateJoints: function(){
	var joints = this.wrapper.joints();
	if (joints){
	    for (var i = 0, l = joints.length; i < l; i++){
		joints[i].update();
	    }
	}
    },

    /**
     * Toggle ghosting of the element.
     * Dragging a diagram object causes moving of the wrapper and all inners, and update
     * of all correspondent connections. It can be sometimes expensive. If your elements
     * are complex and you want to prevent all this rendering and computations,
     * you can enable ghosting. It means that only a ghost of your wrapper will be dragged.
     * @methodOf Joint.dia.Element#
     * @return {Element}
     */
    toggleGhosting: function(){
	this._opt.ghosting = !this._opt.ghosting;
	return this;
    },

    /**
     * Create a ghost shape which is used when dragging.
     * (in the case _opt.ghosting is enabled)
     * @private
     */
    createGhost: function(){
        this.ghost = this.cloneWrapper(this.ghostAttrs);
    },

    /**
     * Create a shadow.
     * @private
     */
    createShadow: function(){
        this.shadowAttrs.rotation = this.wrapper.attrs.rotation;
        this.shadow = this.cloneWrapper(this.shadowAttrs);
        this.shadow.toBack();
    },

    /**
     * Creates the same object as the wrapper is.
     * Used for ghosting and shadows.
     * @private
     * @return {RaphaelObject} created clone
     */
    cloneWrapper: function(attrs) {
	var wa = this.wrapper.attrs,
	    paper = this.wrapper.paper,
            clone;

	switch (this.wrapper.type) {
	case "rect":
	    clone = paper.rect(wa.x, wa.y, wa.width, wa.height, wa.r);
	    break;
	case "circle":
	    clone = paper.circle(wa.cx, wa.cy, wa.r);
	    break;
	case "ellipse":
	    clone = paper.ellipse(wa.cx, wa.cy, wa.rx, wa.ry);
	    break;
	default:
	    break;
	}
	clone.attr(attrs);
        return clone;
    },

    /**
     * Get object position.
     * @private
     * @return point
     */
    objPos: function(objname){
	switch (this[objname].type){
	case "rect":
	    return point(this[objname].attr("x"), this[objname].attr("y"));
	case "circle":
	case "ellipse":
	    return point(this[objname].attr("cx"), this[objname].attr("cy"));
	default:
	    break;
	}
    },

    wrapperPos: function(){
	return this.objPos("wrapper");
    },
    ghostPos: function(){
	return this.objPos("ghost");
    },

    /**
     * Sends the wrapper and all inners to the front.
     * @methodOf Joint.dia.Element#
     * @return {Element}
     */
    toFront: function(){
        this.shadow && this.shadow.toFront();
	this.wrapper && this.wrapper.toFront();
	for (var i = 0, len = this.inner.length; i < len; i++)
	    this.inner[i].toFront();
	return this;
    },

    /**
     * Sends the wrapper and all inners to the back.
     * @methodOf Joint.dia.Element#
     * @return {Element}
     */
    toBack: function(){
	for (var i = this.inner.length - 1; i >= 0; --i)
	    this.inner[i].toBack();
	this.wrapper && this.wrapper.toBack();
        this.shadow && this.shadow.toBack();
	return this;
    },

    /**
     * dia.Element mousedown event.
     * @private
     */
    dragger: function(e){
	if (!this.wholeShape._opt.draggable) return;
	dia._currentDrag = this.wholeShape;
	if (dia._currentDrag._opt.ghosting){
	    dia._currentDrag.createGhost();
	    dia._currentDrag.ghost.toFront();
	} else
	    dia._currentDrag.toFront();

	dia._currentDrag.removeToolbox();
	// small hack to get the connections to front
	dia._currentDrag.translate(1,1);

	dia._currentDrag.dx = e.clientX;
	dia._currentDrag.dy = e.clientY;
	e.preventDefault && e.preventDefault();
    },

    /**
     * dia.Element zoom tool mousedown event.
     * @private
     */
    zoomer: function(e){
	dia._currentZoom = this;
	dia._currentZoom.toFront();
	dia._currentZoom.removeToolbox();

	var bb = rect(dia._currentZoom.origBBox);
	dia._currentZoom.dx = e.clientX;
	dia._currentZoom.dy = e.clientY;
	dia._currentZoom.dWidth = bb.width * dia._currentZoom.lastScaleX;
	dia._currentZoom.dHeight = bb.height * dia._currentZoom.lastScaleY;

	e.preventDefault && e.preventDefault();
    },
    /**
     * Move the element by offsets.
     * @methodOf Joint.dia.Element#
     * @param {Number} dx Offset in x-axis.
     * @param {Number} dy Offset in y-axis.
     */
    translate: function(dx, dy){
	// save translation
	this.properties.dx += dx;
	this.properties.dy += dy;
	// translate wrapper, all inner and toolbox
	this.wrapper.translate(dx, dy);
	this.shadow && this.shadow.translate(dx, dy);
	for (var i = this.inner.length - 1; i >= 0; --i){
	    this.inner[i].translate(dx, dy);
	}
	this.translateToolbox(dx, dy);
        this.paper.safari();
    },

    /**
     * Add wrapper.
     * @methodOf Joint.dia.Element#
     * @param {RaphaelObject} s Vector object specifying a wrapper.
     */
    setWrapper: function(s){
	this.wrapper = s;			// set wrapper
	this.wrapper.wholeShape = this;		// set wrapper's reference to me
	this.type = this.wrapper.type;		// set my type
	this.origBBox = this.wrapper.getBBox();	// save original bounding box
	// if dragging enabled, register mouse down event handler
	if (this._opt && this._opt.draggable){
	    this.wrapper.mousedown(this.dragger);
	    this.wrapper.node.style.cursor = "move";
	}
	// make sure wrapper has the joints method
	if (!this.wrapper.joints){
	    this.wrapper._joints = [];
	    this.wrapper.joints = function(){ return this._joints; };
	}
	// add toolbox if enabled
	this.addToolbox();
	return this;
    },

    /**
     * Add a subelement.
     * @methodOf Joint.dia.Element#
     * @param {Element} s The subelement to be added.
     * @return {Element} this
     */
    addInner: function(s){
	this.inner.push(s);
	// @remove one of them?
	s.wholeShape = this;
	s.parentElement = this;
	if (s._isElement) s.properties.parent = this.euid();
	// if dragging enabled, register mouse down event handler
	if (!s._isElement && this._opt && this._opt.draggable){
	    s.mousedown(this.dragger);
	    s.node.style.cursor = "move";
	}
	s.toFront();	// always push new inner to the front
	return this;
    },

    /**
     * Remove a subelement.
     * @methodOf Joint.dia.Element#
     * @param {Element} s The subelement to be removed.
     * @return {Element} this
     */
    delInner: function(s){
	var
	i = 0,
	len = this.inner.length;
	for (; i < len; i++)
	    if (this.inner[i] == s)
		break;
	if (i < len){
	    this.inner.splice(i, 1);
	    s.parentElement = null;
	    if (s._isElement) s.properties.parent = undefined;
	}
	return this;
    },

    /**
     * Show toolbox.
     * @private
     */
    addToolbox: function(){
	// do not show toolbox if it is not enabled
	if (!this._opt.toolbox){
	    return this;
	}

	var
	self = this,
	bb = this.wrapper.getBBox(),	// wrapper bounding box
	tx = bb.x - 10,	// toolbox x position
	ty = bb.y - 22;	// toolbox y position

	this.toolbox = [];
	this.toolbox.push(this.paper.rect(tx, ty, 33, 22, 5).attr({fill: "white"}));
	// zoom in/out (mint icon: search.png)
	this.toolbox.push(this.paper.image("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAE5SURBVHjaYvz//z8DsQAggFhARGRkpBETE1M/kGkOxIz//v078+HDh4odO3acBPJ//4eaCBBADCA6Kirq4JlzJ978/vPrNwifOHX4fUhIyFmgvDQQs4HUgDBAALFAbTDX1zNiZmFmBfONDM14WFlZdYFMCSD+AsS/QOIAAcQEVcyIw5m8IJNhHIAAAisGufHMuZNfgE74A8Knzx7/LiLO91tfXx9kOgsjEIDUAQQQ2FqQZ3q7Jk6AWs2gqCbOkZDn8l9AiLuNi4vrxfHjx7cC1X8HCCCwYqiv/aBu5NXQ0FD9+/dfr4uf/te7N1/Mu337ttmbN2/uAwQQzIO/gfg11DNsN4BA/LD4n8f33swF8v8DFQoAaS6AAGLEFilQN3JCbQLhH0B8HyCAGHHFIFQDB1QTSNEXgAADAEQ2gYZ9CcycAAAAAElFTkSuQmCC", tx, ty, 11, 11));
	this.toolbox[this.toolbox.length-1].toFront();
	Joint.addEvent(this.toolbox[this.toolbox.length-1].node, "mousedown", function(e){
			   dia.Element.prototype.zoomer.apply(self, [e]);
		       });
	// embed (mint icon: page_spearmint_up.png)
	this.toolbox.push(this.paper.image("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAEJSURBVHjaYvj//z8DFGOAnz9/rjl27Jg0AwMDExAzAAQQI0ghFPz/8usZjM3ACJTnYBEC0iyfmZmZZYBCXwECiAkm+evXL4bff34w/P33C4z//PvB8O33awYmJiZeoDQ/ELMBBBALSKGJiQkPOzs7AxsbC8OaTXMZWFhZoEb8g5nFDsTMAAHEBFIIZLwCuo/hy5dvDCF+yQx/fv+BuAvhRDAACCCQM0AO5YRJfv78lSE+Ko/h79+/DP8RJoMBQACheHDv4wYGdOAs28DAyMioCmS+AAggJgYSAEAAoZiMUxHUZIAAYkES4AJSQjD3o4HvQPwXIIDgJgMVM4PCEhREWBT/BUUFQIABAMuFbgea+o0EAAAAAElFTkSuQmCC", tx + 22, ty, 11, 11));
	this.toolbox[this.toolbox.length-1].toFront();
	this.toolbox[this.toolbox.length-1].node.onclick = function(){ self.embed(); };
	// unembed (mint icon: page_spearmint_down.png)
	this.toolbox.push(this.paper.image("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAEJSURBVHjaYvj//z8DFGOAnz9/rjl27Jg0AwMDExAzAAQQI0ghFPz/8usZjM3ACJTnYBEC0iyfmZmZZYBCXwECiIkBCfz99wuO//z7wfDt92sGJiYmXqAUPxCzAQQQi4mJyX0gQwFZExcXJ8OaTXMYODmZYULsQMwMEEAgk9WB+D0jIyNElJ2NYdXG2QzsHOwMSE4EA4AAYjpz5swvIC3By8sLVrh2yzygiRwQTzD8Q1EMEEBwD/779+//7gcNDCysKN5gcJZtYADaqgpkvgAIILgM0CMYCtEBQAChBB1ORVCTAQKIBUmAC0gJATEnFvXfQSELEEBwk4GKQeHEBgoiLIr/AvEvgAADAH4mYO9cg5S2AAAAAElFTkSuQmCC", tx + 11, ty, 11, 11));
	this.toolbox[this.toolbox.length-1].toFront();
	this.toolbox[this.toolbox.length-1].node.onclick = function(){ self.unembed(); };
	// delete (icon: stop.png)
//	this.toolbox.push(this.paper.image("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oFEBQbDFwnwRsAAAE8SURBVBjTVZG9agJREEbP1TWL266wja2tWggipEhpIxh9gIUgiIW1vZWvkHJJHVLYig+ghWARbGzEYgMKrojr/t4UNwoZmGY4882BEfyVHA5HmOaEXA6khCSB83nK4fAmHOcAoAFI2+7RaIwxTQhDiGO1cLu1WK3egS6AkIPBiFptjGU9kc3Cfg++D4WCSg8CyWLxRRD0MxjGBMNQYLMJlQoUi9BuQ6kEx6PAMDrAs4aUcL3C5QLLJVSrUC6D68J8Duez0gIySKk8fV8ppCnoOux24HkQRUoH0EhTNTBNpeG6CqzX4XSC2eyRrBEEUzyvha7Deq1Oe54CXVcFxfE3sBXStgsYxjuW9UqaCsJQAfcOwx/i+EU4zkY8ntLrfZLPdwB1NklUYpJ0heNsHk8BIIr6RNEH/2t7BwF+AeKFndSgPkjIAAAAAElFTkSuQmCC", tx + 11, ty + 11, 11, 11));
        this.toolbox.push(this.paper.path("M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248").attr({fill: "#000", stroke: "none"}).translate(tx, ty).scale(0.5));
	this.toolbox[this.toolbox.length-1].toFront();
	this.toolbox[this.toolbox.length-1].node.onclick = function(){ self.remove(); };
	// clone (mint icon: sound_grey.png)
	this.toolbox.push(this.paper.image("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAEjSURBVHjaYvz//z8DsQAggJjwSaanpwsBMReMDxBATAQMO/zv379eRkZGdiBmAgggJiymqaWlpS0GSrIAFZ4A0h5AYR4gZgEIICaoAg6ggolACea/f/9aAulAoDD3169fNwPZ0kA2B0gxQADBTBYECuYCaa7bt2/vACkEYs4zZ84cA9KsQAwKBUaAAGIBqfzz5w8jExPTRiCTXUFBwQ9IfwP5x8TExAJI/4IpBgggsOJ58+Y9B1JRQMwGdOdjoFP2ghRwcnL6A4P2KUghiA8QQGDFQIH/QGf8BDJ/L1myZC8fHx/IeiZmZmbr379/H4ApBgggFlgoANX/A1L/gJoYP336BHIG47Nnz1zu3r0LUvgD5FqAAGLEF4Og0EHy4G+AAAMAho1gqqugDLgAAAAASUVORK5CYII=", tx, ty + 11, 11, 11));
	this.toolbox[this.toolbox.length-1].toFront();
	this.toolbox[this.toolbox.length-1].node.onmousedown = function(){ dia._currentDrag = self.clone()[0]; console.log(dia._currentDrag[0])};
	// toolbox wrapper
	return this;
    },

    /**
     * Hide (remove) toolbox.
     * @todo Will be public after it is properly tested.
     * @private
     */
    removeToolbox: function(){
	if (this.toolbox)
	    for (var i = this.toolbox.length - 1; i >= 0; --i)
		this.toolbox[i].remove();
	this.toolbox = null;
	return this;
    },

    /**
     * Show/hide toolbox.
     * @todo Will be public after it is properly tested.
     * @private
     */
    toggleToolbox: function(){
	this._opt.toolbox = !this._opt.toolbox;
	if (this._opt.toolbox){
	    this.addToolbox();
	} else {
	    this.removeToolbox();
	}
	return this;
    },

    /**
     * Move toolbox by offset (dx, dy).
     * @private
     */
    translateToolbox: function(dx, dy){
	if (this.toolbox)
	    for (var i = this.toolbox.length - 1; i >= 0; --i)
		this.toolbox[i].translate(dx, dy);
    },

    /**
     * Disconnects element from all joints. Empties the element joints array.
     * Note that it preserves registration of the element in its joints.
     * @methodOf Joint.dia.Element#
     */
    disconnect: function(){
	var joints = this.joints(), idx = joints.length, j;
	while (idx--){
	    j = joints[idx];

	    if (j.endObject().wholeShape === this){
		j.freeJoint(j.endObject());
		j.draw(["dummyEnd"]);
		j.update();
	    }
	    if (j.startObject().wholeShape === this){
		j.freeJoint(j.startObject());
		j.draw(["dummyStart"]);
		j.update();
	    }
	}
    },

    /**
     * Unregister the element from its joints registeredObjects.
     * After the call, the element is not registered in any of its joints.
     * @private
     */
    unregisterFromJoints: function(){
	var joints = this.joints(), idx = joints.length;
	while (idx--) joints[idx].unregister(this);
	return this;
    },

    /**
     * Remove element.
     * @methodOf Joint.dia.Element#
     * @return {null}
     */
    remove: function(){
	var inners = this.inner, idx = inners.length;
	this.unregisterFromJoints();
	this.disconnect();
	this.removeToolbox();
	this.unembed();
	while (idx--) inners[idx].remove();
	this.wrapper.remove();
	dia.unregister(this);
        this.removed = true;
        return null;
    },

    /**
     * Remove element and all joints pointing from and to this element.
     * @methodOf Joint.dia.Element#
     * @return {null}
     */
    liquidate: function(){
	var joints = this.joints(), idx = joints.length, j, inners = this.inner;
	// remove joints
	while (idx--){
	    j = joints[idx];
	    j.freeJoint(j.startObject());
	    j.freeJoint(j.endObject());
	    j.clean(["connection", "startCap", "endCap", "handleStart", "handleEnd", "label"]);
	    dia.unregisterJoint(j);
	    j.unregister(this);
	}
	this.removeToolbox();
	this.unembed();
	// liquidate subelements
	idx = inners.length;
	while (idx--){
	    if (inners[idx].liquidate) inners[idx].liquidate();
	    else inners[idx].remove();
	}
	this.wrapper.remove();
	dia.unregister(this);
        this.removed = true;
        return null;
    },

    /**
     * Enable/disable dragging of the element.
     * @methodOf Joint.dia.Element#
     * @param {boolean} enable True/false.
     * @return {Element} Return this.
     */
    draggable: function(enable){
	this._opt.draggable = enable;
        this.wrapper.node.style.cursor = enable ? "move" : null;
        var idx = this.inner.length;
        while (idx--) this.inner[idx].node.style.cursor = enable ? "move" : null;
	return this;
    },

    /**
     * Highlights the element.
     * Override in inherited objects or @todo set in options.
     * @methodOf Joint.dia.Element#
     * @return {Element} Return this.
     */
    highlight: function(){
	this.wrapper.attr("stroke", "red");
	return this;
    },

    /**
     * Unhighlights the element.
     * @methodOf Joint.dia.Element#
     * @return {Element} Return this.
     */
    unhighlight: function(){
	this.wrapper.attr("stroke", this.properties.attrs.stroke || "#000");
	return this;
    },

    /**
     * Embed me into the first registered dia.Element whos bounding box
     * contains my bounding box origin. Both elements will behave as a whole.
     * @todo It is probably out of date. Retest!!!
     * @methodOf Joint.dia.Element#
     * @return {Element}
     */
    embed: function(){
	var
	ros = dia._registeredObjects[this.paper.euid()],
	myBB = rect(this.wrapper.getBBox()),
	embedTo = null;

	// for all registered objects (sharing the same raphael paper)
	for (var i = 0, len = ros.length; i < len; i++){
	    var
	    shape = ros[i],
	    shapeBB = rect(shape.getBBox());

	    // does shape contain my origin point?
	    if (shapeBB.containsPoint(myBB.origin()))
		embedTo = shape;	// if yes, save the shape

	    if (shape == this.parentElement){
		shape.delInner(this);

		// just for optimization, a shape can be a subshape of
		// only one shape, so if I have been deleted from my parent,
		// I am free, and further, if I know where to embed -> do not search deeper
		if (embedTo) break;
	    }
	}

	// embed if possible
	embedTo && embedTo.addInner(this);
	return this;
    },

    /**
     * Decouple embedded element from its parent.
     * @methodOf Joint.dia.Element#
     * @return {Element}
     */
    unembed: function(){
	if (this.parentElement){
	    this.parentElement.delInner(this);
	    this.parentElement = null;
	    this.properties.parent = undefined;
	}
	return this;
    },

    /**
     * Scale element.
     * @methodOf Joint.dia.Element#
     * @param {Number} sx Scale in x-axis.
     * @param {Number} &optional sy Scale in y-axis.
     * @example e.scale(1.5);
     */
    scale: function(sx, sy){
	// save translation
	this.properties.sx = sx;
	this.properties.sy = sy;

	this.shadow && this.shadow.scale.apply(this.shadow, arguments);
	this.wrapper.scale.apply(this.wrapper, arguments);
	this.zoom.apply(this, arguments);
	// apply scale to all subshapes that are Elements (were embeded)
	for (var i = 0, len = this.inner.length; i < len; i++){
	    var inner = this.inner[i];
	    if (inner._isElement){
		inner.scale.apply(inner, arguments);
	    }
	}
	if (this._doNotRedrawToolbox) return;
	this.removeToolbox();
	this.addToolbox();
    },
    /**
     * This method should be overriden by inherited elements to implement
     * the desired scaling behaviour.
     * @methodOf Joint.dia.Element#
     * @param {Number} sx Scale in x-axis.
     * @param {Number} &optional sy Scale in y-axis.
     */
    zoom: function(sx, sy){
	// does nothing, overriden by specific elements
    },

    /**
     * @methodOf Joint.dia.Element#
     * @return {Object} Bounding box of the element.
     */
    getBBox: function(){
	return this.wrapper.getBBox();
    },

    /**
     * @see Joint
     * @methodOf Joint.dia.Element#
     */
    joint: function(to, opt){
	var toobj = (to._isElement) ? to.wrapper : to,
	    j = this.wrapper.joint.apply(this.wrapper, [toobj, opt]);
	Joint.dia.registerJoint(j);
	return j;
    },

    /**
     * Delegate attr message to my wrapper.
     * @private
     */
    attr: function(){
	return Raphael.el.attr.apply(this.wrapper, arguments);
    }
};


/**
 * Document mousemove event.
 * @private
 */
Element.mouseMove = function(e){
    e = e || window.event;
    // object dragging
    if (dia._currentDrag){
	if (dia._currentDrag._opt.ghosting)	// if ghosting, move ghost
	    dia._currentDrag.ghost.translate(e.clientX - dia._currentDrag.dx, e.clientY - dia._currentDrag.dy);
	else	// otherwise, move the whole shape
	    dia._currentDrag.translate(e.clientX - dia._currentDrag.dx, e.clientY - dia._currentDrag.dy);

	dia._currentDrag.dx = e.clientX;
	dia._currentDrag.dy = e.clientY;
    }

    // object zooming
    if (dia._currentZoom){
	var
	dx = e.clientX - dia._currentZoom.dx,
	dy = e.clientY - dia._currentZoom.dy;

	dia._currentZoom.dWidth -= dx;
	dia._currentZoom.dHeight -= dy;
	// correction
	if (dia._currentZoom.dWidth < 1) dia._currentZoom.dWidth = 1;
	if (dia._currentZoom.dHeight < 1) dia._currentZoom.dHeight = 1;

	// scaling parameters
	var
	sx = dia._currentZoom.dWidth / dia._currentZoom.origBBox.width,
	sy = dia._currentZoom.dHeight / dia._currentZoom.origBBox.height;

	// do not redraw toolbox because it is not there
	dia._currentZoom._doNotRedrawToolbox = true;
	dia._currentZoom.scale(sx, sy);	// scale
	r.safari();

	// save for later usage
	dia._currentZoom.dx = e.clientX;
	dia._currentZoom.dy = e.clientY;
	dia._currentZoom.lastScaleX = sx;
	dia._currentZoom.lastScaleY = sy;
    }
};

/**
 * Document mouseup event.
 * @private
 */
Element.mouseUp = function(e){
    // if ghosting is enabled, translate whole shape to the position of
    // the ghost, then remove ghost and update joints
    if (dia._currentDrag && dia._currentDrag._opt.ghosting){
	var
	gPos = dia._currentDrag.ghostPos(),
	wPos = dia._currentDrag.wrapperPos();

	dia._currentDrag.translate(gPos.x - wPos.x, gPos.y - wPos.y);
	dia._currentDrag.ghost.remove();
	dia._currentDrag.updateJoints();
    }
    // add toolbar again when dragging is stopped
    if (dia._currentDrag){
	dia._currentDrag.addToolbox();
	dia._currentDrag.toFront();
	// small hack: change slightely the position to get the connections to front
	dia._currentDrag.translate(1,1);
    }

    // add toolbar again when zooming is stopped
    if (dia._currentZoom){
	// remove toolbox, because scale above may create one,
	// so there would be two toolboxes after addToolbox() below
	dia._currentZoom.removeToolbox();
	dia._currentZoom.addToolbox();
	dia._currentZoom.toFront();
    }

    dia._currentDrag = false;
    dia._currentZoom = false;
};

Joint.addEvent(document, "mousemove", Element.mouseMove);
Joint.addEvent(document, "mouseup", Element.mouseUp);


})(this);	// END CLOSURE
(function(global){	// BEGIN CLOSURE

var Joint = global.Joint,
     Element = Joint.dia.Element,
     point = Joint.point;

/**
 * @name Joint.dia.cdm
 * @namespace Holds functionality related to Conceptual Data Model (CDM) and Logical Data Model (LDM) diagrams.
 * CDMs and LDMs serve different purposes, but entity attributes are likely only to be displayed in a Logical Data Model.
 * Relationship lines in a CDM often display labels for the member roles; this feature is not implemented.
 */
var cdm = Joint.dia.cdm = {};

Joint.arrows.crowfoot = function(size) {
    size = size || 2;
    return {
	path: ["M",(4*size).toString(),4*size.toString(),
               "L",(-4*size).toString(),'0',
               "L",(4*size).toString(),'0',
               "M",(-4*size).toString(),'0',
               "L",(4*size).toString(),(-size*4).toString()],
        dx: 4*size,
        dy: 4*size,
        attrs: {
            stroke: '#800040',
            fill: 'none',
            'stroke-width': 1.0
        }
    };
};

Joint.arrows.crowfootdashed = function(size) {
    size = size || 2;
    return {
	path: ["M",(4*size).toString(),4*size.toString(),
               "L",(-4*size).toString(),'0',
               "L",(size/4).toString(),'0',"M",(2*size).toString(),'0',"L",(4*size).toString(),'0',
               "M",(-4*size).toString(),'0',
               "L",(4*size).toString(),(-size*4).toString()],
        dx: 4*size,
        dy: 4*size,
        attrs: {
            stroke: '#800040',
            fill: 'white',
            'stroke-width': 1.0
        }
    };
};



/**
 * The following relationship lines are solid for their entire length, indicating each member is mandatory.
  * Below this set are similar lines when both members are optional.
  * Below that relationships with both optional and mandatory members will eventually be added.
  */



/**
 * Predefined crow's foot line ending for a one-to-many relationship connecting two entities. 
 * Both are mandatory.
 * @name oneToMany
 * @memberOf Joint.dia.cdm
 * @example c1.joint(c2, Joint.dia.cdm.oneToMany);
 */

cdm.oneToMany = {
  endArrow: { type: "crowfoot" },
  startArrow: {type: "none"},
  attrs: { "stroke-dasharray": "none", stroke:"#800040" }
};


/**
 * Predefined crow's foot line ending for a many-to-one relationship connecting two entities.
 * Both are mandatory.
 * @name manyToOne
 * @memberOf Joint.dia.cdm
 * @example c1.joint(c2, Joint.dia.cdm.manyToOne);
 */

cdm.manyToOne = {
    startArrow: {type: "crowfoot"},
    endArrow: {type: "none"},
    attrs: {"stroke-dasharray": "none", stroke:"#800040"}
};

/**
 * Predefined crow's foot line endings on both ends, indicating a many-to-many relationship connecting two entities.
 * Both are mandatory.
 * @name manyToMany
 * @memberOf Joint.dia.cdm
 * @example c1.joint(c2, Joint.dia.cdm.manyToMany);
 */

cdm.manyToMany = {
    startArrow: {type: "crowfoot"},
    endArrow: {type: "crowfoot"},
    attrs: {"stroke-dasharray": "none", stroke:"#800040"}
};

/**
 * Predefined one-to-one relationship line.
 * Both are mandatory.
 * @name plain
 * @memberOf Joint.dia.cdm
 * @example s1.joint(s2, Joint.dia.cdm.plain);
 */

cdm.plain = {
    startArrow: {type: "none"},
    endArrow: {type: "none"},
    attrs: {"stroke-dasharray": "none", stroke:"#800040"}
};


/**
 * Predefined arrow similar to that in UML, in case that script isn't loaded. This produces a solid line for the length of the arrow.
 * @name Joint.dia.cdm.arrow
 * @memberOf Joint.dia.cdm
 * @example s1.joint(s2, Joint.dia.cdm.arrow);
 */
cdm.arrow = {
    startArrow: {type: "none"},
    endArrow: {type: "basic", size: 5, attrs:{fill:"#800040", stroke:"#800040"}},
    attrs: {"stroke-dasharray": "none", stroke:"#800040"}
};



/**
 * The following relationship lines use dashes, indicating each member is optional.
  * Above this set are similar definitions for mandatory members.
  * Below this set similar definitions for relationships with both mandatory and optional members will eventually be added.
  */


/**
 * Predefined crow's foot line ending for a one-to-many relationship connecting two entities.
 * Both are optional.
 * @name oneToManyDashes
 * @memberOf Joint.dia.cdm
 * @example c1.joint(c2, Joint.dia.cdm.oneToManySashes);
 */

cdm.oneToManyDashes = {
  endArrow: { type: "crowfootdashed" },
  startArrow: {type: "none"},
  attrs: { "stroke-dasharray": "--", stroke:"#800040" }
};


/**
 * Predefined crow's foot line ending for a many-to-one relationship connecting two entities.
 * Both are optional.
 * @name manyToOneDashes
 * @memberOf Joint.dia.cdm
 * @example c1.joint(c2, Joint.dia.cdm.manyToOneDashes);
 */

cdm.manyToOneDashes = {
    startArrow: {type: "crowfootdashed"},
    endArrow: {type: "none"},
    attrs: {"stroke-dasharray": "--", stroke:"#800040"}
};

/**
 * Predefined crow's foot line endings on both ends, indicating a many-to-many relationship connecting two entities.
 * Both are optional.
 * @name manyToManyDashes
 * @memberOf Joint.dia.cdm
 * @example c1.joint(c2, Joint.dia.cdm.manyToManyDashes);
 */
cdm.manyToManyDashes = {
    startArrow: {type: "crowfoot"},
    endArrow: {type: "crowfoot"},
    attrs: {"stroke-dasharray": "-- ", stroke:"#800040"}
};

/**
 * This is an example showing styling subpaths of connections.
 */
cdm.exampleArrow = {
    startArrow: {type: "crowfoot"},
    endArrow: {type: "crowfootdashed"},
    attrs: {"stroke-dasharray": "--", stroke:"#800040"},
    subConnectionAttrs: [ 
        {from: 1.1, to: 1/2, 'stroke-dasharray': 'none', stroke: '#800040'}
    ],
    label: ['many', 'many'],
    labelAttrs: [
        {position: 20, offset: -10},
        {position: -20, offset: -10}
    ]
};

/**
 * Predefined one-to-one relationship line.
 * Both are optional.
 * @name dashes
 * @memberOf Joint.dia.cdm
 * @example s1.joint(s2, Joint.dia.cdm.plain);
 */

cdm.dashes = {
    startArrow: {type: "none"},
    endArrow: {type: "none"},
    attrs: {"stroke-dasharray": "--", stroke:"#800040"}
};

/**
 * CDM EntityChart.
 * @name Entity.create
 * @methodOf Joint.dia.cdm
 * @param {Object} properties
 * @param {Object} properties.rect Bounding box of the Entity (e.g. {x: 50, y: 100, width: 100, height: 80}).
 * @param {Number} [properties.radius] Radius of the corners of the entity rectangle.
 * @param {String} [properties.label] The name of the entity.
 * @param {Number} [properties.labelOffsetX] Offset in x-axis of the label from the entity rectangle origin.
 * @param {Number} [properties.labelOffsetY] Offset in y-axis of the label from the entity rectangle origin.
 * @param {Object} [properties.attrs] SVG attributes of the appearance of the entity. 
 * @param {String} [properties.entityAttributes] Attributes of the entity.
 * @param {Number} [properties.attributesOffsetX] Offset in x-axis of the attributes.
 * @param {Number} [properties.attributesOffsetY] Offset in y-axis of the attributes.
 * @example
var s1 = Joint.dia.cdm.Entity.create({
  rect: {x: 120, y: 70, width: 100, height: 60},
  label: "state 1",
  attrs: {
    fill: "315-#fff-#808000"
  },
  entityAttributes: {
    entry: "init()",
    exit: "destroy()",
    inner: ["Evt1", "foo()", "Evt2", "bar()"]
  }
});
 */
cdm.Entity = Element.extend({
    object: "Entity",
    module: "cdm",
    init: function(properties){
	// options
	var p = Joint.DeepSupplement(this.properties, properties, {
            radius: 10,
            attrs: { fill: 'white' },
            label: '',
            labelOffsetX: 20,
            labelOffsetY: 5,
            actions: {
                entry: null,
                exit: null,
                inner: []
            },
            attributesOffsetX: 5,
            attributesOffsetY: 5
        });
	// wrapper
	this.setWrapper(this.paper.rect(p.rect.x, p.rect.y, p.rect.width, p.rect.height, p.radius).attr(p.attrs));
	// inner
	this.addInner(this.getLabelElement());
	this.addInner(this.getAttributesElement());

    },
    getLabelElement: function(){
	var p = this.properties,
	    bb = this.wrapper.getBBox(),
	    t = this.paper.text(bb.x, bb.y, p.label).attr(p.labelAttrs || {}),
	    tbb = t.getBBox();
	t.translate(bb.x - tbb.x + p.labelOffsetX, bb.y - tbb.y + p.labelOffsetY);
	return t;
    },
    getAttributesElement: function(){
	// collect all actions
	var p = this.properties;
	var str = (p.actions.entry) ? "entry/ " + p.actions.entry + "\n" : "";
	str += (p.actions.exit) ? "exit/ " + p.actions.exit + "\n" : "";
	var l = p.actions.inner.length;
	for (var i = 0; i < l; i += 2){
	    str += p.actions.inner[i] + "/ " + p.actions.inner[i+1] + "\n";
	}
	// trim
	str = str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

	// draw text with actions
	var bb = this.wrapper.getBBox(),
	    t = this.paper.text(bb.x + p.attributesOffsetX, bb.y + p.labelOffsetY + p.attributesOffsetY, str),
	    tbb = t.getBBox();
	t.attr("text-anchor", "start");
	t.translate(0, tbb.height/2);	// tune the y position
	return t;
    },
    zoom: function(){
	this.wrapper.attr("r", this.properties.radius); 	// set wrapper's radius back to its initial value (it deformates after scaling)
	this.shadow && this.shadow.attr("r", this.properties.radius); 	// update shadow as well if there is one 
	this.inner[0].remove();	// label
	this.inner[1].remove();	// entityAttributes
	this.inner[0] = this.getLabelElement();
	this.inner[1] = this.getAttributesElement();
    }
});



})(this);	// END CLOSURE
(function(global){	// BEGIN CLOSURE

var Joint = global.Joint,
     Element = Joint.dia.Element;

/**
 * @name Joint.dia.devs
 * @namespace Holds functionality related to Discrete EVent System (DEVS) diagrams.
 */
var devs = Joint.dia.devs = {};

/**
 * Predefined arrow.
 * @name Joint.dia.devs.arrow
 * @memberOf Joint.dia.devs
 * @example a1.port("o", "out1").joint(c1.port("i", "in"), Joint.dia.devs.arrow);
 */
devs.arrow = {
  endArrow: { type: "none" },
  startArrow: {type: "none"},
  attrs: { "stroke-dasharray": "none" }
};

/**
 * DEVS atomic/coupled model.
 * @name Model.create
 * @methodOf Joint.dia.devs
 * @param {Object} properties
 * @param {Object} properties.rect Bounding box of the model (e.g. {x: 50, y: 100, width: 150, height: 100}).
 * @param {String} [properties.label] The name of the model.
 * @param {Number} [properties.labelOffsetX] Offset in x-axis of the label from the model rectangle origin.
 * @param {Number} [properties.labelOffsetY] Offset in y-axis of the label from the model rectangle origin.
 * @param {Number} [properties.portsOffsetX] Offset in x-axis of the ports from the model rectangle origin.
 * @param {Number} [properties.portsOffsetY] Offset in y-axis of the ports from the model rectangle origin.
 * @param {Number} [properties.iPortRadius] Radius of the input ports circle.
 * @param {Number} [properties.oPortRadius] Radius of the output ports circle.
 * @param {Object} [properties.iPortAttrs] SVG attributes of the appearance of the input ports.
 * @param {Object} [properties.oPortAttrs] SVG attributes of the appearance of the output ports.
 * @param {Number} [properties.iPortLabelOffsetX] Offset in x-axis of the input ports label.
 * @param {Number} [properties.oPortLabelOffsetX] Offset in x-axis of the output ports label.
 * @param {array} [properties.iPorts] The input port names.
 * @param {array} [properties.oPorts] The output port names.
 * @param {Object} [properties.attrs] SVG attributes of the appearance of the model.
 * @example
var a1 = Joint.dia.devs.Model.create({
  rect: {x: 30, y: 90, width: 100, height: 60},
  label: "Atomic 1",
  attrs: {
    fill: "90-#000-#f00:1-#fff"
  },
  iPorts: ["in1"],
  oPorts: ["out1", "out2"]
});
 */
devs.Model = Element.extend({
     object: "Model",
     module: "devs",
     init: function(properties){
	 // options
	 var p = Joint.DeepSupplement(this.properties, properties, {
             labelOffsetX: 20,
             labelOffsetY: 5,
             portsOffsetX: 5,
             portsOffsetY: 20,
             iPortRadius: 5,
             oPortRadius: 5,
             iPortAttrs: { fill: 'green', stroke: 'black' },
             oPortAttrs: { fill: 'red', stroke: 'black' },
             iPortLabelOffsetX: -10,
             iPortLabelOffsetY: -10,
             oPortLabelOffsetX: 10,
             oPortLabelOffsetY: -10,
             iPorts: [],
             oPorts: []
         });
	 // wrapper
	 var paper = this.paper, i;
	 this.setWrapper(paper.rect(p.rect.x, p.rect.y, p.rect.width, p.rect.height).attr(p.attrs));
	 // inner
	 this.addInner(this.getLabelElement());	// label
	 // draw ports
	 for (i = 0, l = p.iPorts.length; i < l; i++){
	     this.addInner(this.getPortElement("i", i + 1, p.iPorts[i]));
	 }
	 for (i = 0, l = p.oPorts.length; i < l; i++){
	     this.addInner(this.getPortElement("o", i + 1, p.oPorts[i]));
	 }
	 // delete all ports related properties, they are saved in port objects
	 p.iPorts = p.oPorts = p.portsOffsetX = p.portsOffsetY = p.iPortRadius = p.oPortRadius = p.iPortAttrs = p.oPortAttrs = p.iPortLabelOffsetX = p.iPortLabelOffsetY = p.oPortLabelOffsetX = p.oPortLabelOffsetY = undefined;
     },
     getLabelElement: function(){
	 var p = this.properties,
	     bb = this.wrapper.getBBox(),
	     t = this.paper.text(bb.x, bb.y, p.label).attr(p.labelAttrs || {}),
	     tbb = t.getBBox();
	 t.translate(bb.x - tbb.x + p.labelOffsetX, bb.y - tbb.y + p.labelOffsetY);
	 return t;
     },
     getPortElement: function(type, index, label){
	 var bb = this.wrapper.getBBox(), p = this.properties,
	     port = devs.Port.create({
	         label: label,
    	         type: type,
	         position: {x: bb.x + ((type === "o") ? bb.width : 0), y: bb.y + p.portsOffsetY * index},
	         radius: p[type + "PortRadius"],
	         attrs: p[type + "PortAttrs"],
	         offsetX: p[type + "PortLabelOffsetX"],
	         offsetY: p[type + "PortLabelOffsetY"]
             });
	 return port;
     },
     /**
      * Get a port object. It can be used further for connecting other port objects.
      * @param {String} type "i"|"o"
      * @param {String} label Name of the port.
      * @return {Port}
      */
     port: function(type, label){
	 var el;
	 for (var i = 0, l = this.inner.length; i < l; i++){
	     el = this.inner[i];
	     if (el.properties && label == el.properties.label && type == el.properties.type){
		 return el;
	     }
	 }
	 return undefined;
     },
     joint: function(oPort, to, iPort, opt){
	 // shorthand
	 if (!to.port) return undefined;	// non-DEVS object
	 return this.port("o", oPort).joint(to.port("i", iPort), opt);
     },
     zoom: function(){
	 // @todo
     }				
});

devs.Port = Element.extend({
     object: "Port",
     module: "devs",
     // doesn't have object and module properties => it's invisible for serializer
     init: function(properties){
	 var p = Joint.DeepSupplement(this.properties, properties, {
             label: '',
             offsetX: 0,
             offsetY: 0,
             type: 'i'
         });
	 this.setWrapper(this.paper.circle(p.position.x, p.position.y, p.radius).attr(p.attrs));
	 this.addInner(this.getLabelElement());
     },
     getLabelElement: function(){
	 var bb = this.wrapper.getBBox(), p = this.properties,
	     t = this.paper.text(bb.x, bb.y, p.label),
	     tbb = t.getBBox();
	 t.translate(bb.x - tbb.x + p.offsetX, bb.y - tbb.y + p.offsetY);
	 return t;
     },
     zoom: function(){
	 // @todo
     }
});

})(this);	// END CLOSURE

(function(global){	// BEGIN CLOSURE

var Joint = global.Joint,
     Element = Joint.dia.Element,
     point = Joint.point;

/**
 * @name Joint.dia.erd
 * @namespace Holds functionality related to Entity-relationship diagrams.
 */
var erd = Joint.dia.erd = {};

/**
 * Predefined arrow. You are free to use this arrow as the option parameter to joint method.
 * Implements Chen-style cardinality notation.
 * @name Joint.dia.erd.arrow
 * @memberOf Joint.dia.erd
 * @example
 * var arrow = Joint.dia.erd.arrow;
 */
erd.arrow = {
    startArrow: {type: 'none'},
    endArrow: {type: 'none'},
    attrs: {"stroke-dasharray": "none"}
};

erd.toMany = {
    startArrow: {type: 'none'},
    endArrow: {type: 'none'},
    attrs: {"stroke-dasharray": "none"},
    label: 'n',
    labelAttrs: { position: -10, offset: -10 }
};

erd.manyTo = {
    startArrow: {type: 'none'},
    endArrow: {type: 'none'},
    attrs: {"stroke-dasharray": "none"},
    label: 'n',
    labelAttrs: { position: 10, offset: -10 }
};

erd.toOne = {
    startArrow: {type: 'none'},
    endArrow: {type: 'none'},
    attrs: {"stroke-dasharray": "none"},
    label: '1',
    labelAttrs: { position: -10, offset: -10 }
};

erd.oneTo = {
    startArrow: {type: 'none'},
    endArrow: {type: 'none'},
    attrs: {"stroke-dasharray": "none"},
    label: '1',
    labelAttrs: { position: 10, offset: -10 }
};

erd.oneToMany = {
    startArrow: {type: 'none'},
    endArrow: {type: 'none'},
    attrs: {"stroke-dasharray": "none"},
    label: ['1', 'n'],
    labelAttrs: [ { position: 10, offset: -10 }, { position: -10, offset: -10 } ]
};

erd.manyToOne = {
    startArrow: {type: 'none'},
    endArrow: {type: 'none'},
    attrs: {"stroke-dasharray": "none"},
    label: ['n', '1'],
    labelAttrs: [ { position: 10, offset: -10 }, { position: -10, offset: -10 } ]
};


/**
 * ERD Entity and Weak Entity.
 * @methodOf Joint.dia.erd
 */
erd.Entity = Element.extend({
    object: 'Entity',
    module: 'erd',
    init: function(properties) {
        var p = Joint.DeepSupplement(this.properties, properties, {
            attrs: { fill: 'lightgreen', stroke: '#008e09', 'stroke-width': 2 },
            label: '',
            labelAttrs: { 'font-weight': 'bold' },
            shadow: true,
            weak: false,        // Weak Entity?
            padding: 5
        });
        this.setWrapper(this.paper.rect(p.rect.x, p.rect.y, p.rect.width, p.rect.height).attr(p.attrs));

        if (p.weak) {
            this.addInner(this.paper.rect(p.rect.x + p.padding, p.rect.y + p.padding, p.rect.width - 2*p.padding, p.rect.height - 2*p.padding).attr(p.attrs));
        }
        this.addInner(this.getLabelElement());
    },
    getLabelElement: function() {
	var p = this.properties,
	    bb = this.wrapper.getBBox(),
	    t = this.paper.text(bb.x + bb.width/2, bb.y + bb.height/2, p.label).attr(p.labelAttrs || {}),
	    tbb = t.getBBox();
	t.translate(bb.x - tbb.x + p.labelOffsetX,
		    bb.y - tbb.y + p.labelOffsetY);
	return t;
    }
});

/**
 * ERD Relationship.
 * @methodOf Joint.dia.erd
 */
erd.Relationship = Element.extend({
    object: 'Relationship',
    module: 'erd',
    init: function(properties) {
        var p = Joint.DeepSupplement(this.properties, properties, {
            attrs: { rotation: 45, fill: 'lightblue', stroke: '#000d5b', 'stroke-width': 2 },
            label: '',
            labelAttrs: { 'font-weight': 'bold' }
        });
        this.setWrapper(this.paper.rect(p.rect.x, p.rect.y, p.rect.width, p.rect.height).attr(p.attrs));
        this.addInner(this.getLabelElement());
    },
    getLabelElement: function() {
	var p = this.properties,
	    bb = this.wrapper.getBBox(),
	    t = this.paper.text(bb.x + bb.width/2, bb.y + bb.height/2, p.label).attr(p.labelAttrs || {}),
	    tbb = t.getBBox();
	t.translate(bb.x - tbb.x + p.labelOffsetX,
		    bb.y - tbb.y + p.labelOffsetY);
	return t;
    }
});

/**
 * ERD Attribute, Key Attribute, Multivalued Attribute and Derived Attribute.
 * @methodOf Joint.dia.erd
 */
erd.Attribute = Element.extend({
    object: 'Attribute',
    module: 'erd',
    init: function(properties) {
        var p = Joint.DeepSupplement(this.properties, properties, {
            attrs: { fill: 'red', opacity: (properties.primaryKey ? 0.8 : 0.5), 
                     stroke: '#5b0001', 'stroke-width': 2, 
                     'stroke-dasharray': (properties.derived ? '.' : 'none') },
            label: '',
            labelAttrs: { 'font-weight': 'bold' },
            multivalued: false,
            derived: false,
            padding: 5
        });
        this.setWrapper(this.paper.ellipse(p.ellipse.x, p.ellipse.y, p.ellipse.rx, p.ellipse.ry).attr(p.attrs));
        if (p.multivalued) {
            this.addInner(this.paper.ellipse(p.ellipse.x, p.ellipse.y, p.ellipse.rx - p.padding, p.ellipse.ry - p.padding).attr(p.attrs));
        }
        this.addInner(this.getLabelElement());
    },
    getLabelElement: function() {
	var p = this.properties,
	    bb = this.wrapper.getBBox(),
	    t = this.paper.text(bb.x + bb.width/2, bb.y + bb.height/2, p.label).attr(p.labelAttrs || {}),
	    tbb = t.getBBox();
	t.translate(bb.x - tbb.x + p.labelOffsetX,
		    bb.y - tbb.y + p.labelOffsetY);
	return t;
    }
});

})(this);	// END CLOSURE

(function(global){	// BEGIN CLOSURE

var Joint = global.Joint,
     Element = Joint.dia.Element,
     point = Joint.point;

/**
 * @name Joint.dia.fsa
 * @namespace Holds functionality related to FSA diagrams.
 */
var fsa = Joint.dia.fsa = {};

/**
 * Predefined arrow. You are free to use this arrow as the option parameter to joint method.
 * @name arrow
 * @memberOf Joint.dia.fsa
 * @example
 * var arrow = Joint.dia.fsa.arrow;
 * s1.joint(s2, (arrow.label = "anEvent", arrow));
 */
fsa.arrow = {
    startArrow: {type: "none"},
    endArrow: {type: "basic", size: 5},
    attrs: {"stroke-dasharray": "none"}
};

/**
 * Finite state machine state.
 * @name State.create
 * @methodOf Joint.dia.fsa
 * @param {Object} properties
 * @param {Object} properties.position Position of the State (e.g. {x: 50, y: 100}).
 * @param {Number} [properties.radius] Radius of the circle of the state.
 * @param {String} [properties.label] The name of the state.
 * @param {Number} [properties.labelOffsetX] Offset in x-axis of the label from the state circle origin.
 * @param {Number} [properties.labelOffsetY] Offset in y-axis of the label from the state circle origin.
 * @param {Object} [properties.attrs] SVG attributes of the appearance of the state.
 * @example
var s1 = Joint.dia.fsa.State.create({
  position: {x: 120, y: 70},
  label: "state 1",
  radius: 40,
  attrs: {
    stroke: "blue",
    fill: "yellow"
  }
});
 */
fsa.State = Element.extend({
    object: "State",
    module: "fsa",
    init: function(properties){
	// options
	var p = Joint.DeepSupplement(this.properties, properties, {
            position: point(0,0),
            radius: 30,
            label: 'State',
            labelOffsetX: 30/2,
            labelOffsetY: 30/2 + 8,
            attrs: { fill: 'white' }
        });
	// wrapper
	this.setWrapper(this.paper.circle(p.position.x, p.position.y, p.radius).attr(p.attrs));
	// inner
	this.addInner(this.getLabelElement());
    },
    getLabelElement: function(){
	var
	p = this.properties,
	bb = this.wrapper.getBBox(),
	t = this.paper.text(bb.x, bb.y, p.label),
	tbb = t.getBBox();
	t.translate(bb.x - tbb.x + p.labelOffsetX,
		    bb.y - tbb.y + p.labelOffsetY);
	return t;
    }
});

/**
 * Finite state machine start state.
 * @name StartState.create
 * @methodOf Joint.dia.fsa
 * @param {Object} properties
 * @param {Object} properties.position Position of the start state (e.g. {x: 50, y: 100}).
 * @param {Number} [properties.radius] Radius of the circle of the start state.
 * @param {Object} [properties.attrs] SVG attributes of the appearance of the start state.
 * @example
var s0 = Joint.dia.fsa.StartState.create({
  position: {x: 120, y: 70},
  radius: 15,
  attrs: {
    stroke: "blue",
    fill: "yellow"
  }
});
 */
fsa.StartState = Element.extend({
     object: "StartState",
     module: "fsa",
     init: function(properties){
	 // options
         var p = Joint.DeepSupplement(this.properties, properties, {
             position: point(0,0),
             radius: 10,
             attrs: { fill: 'black' }
         });
	 // wrapper
	 this.setWrapper(this.paper.circle(p.position.x, p.position.y, p.radius).attr(p.attrs));
     }
});

/**
 * Finite state machine end state.
 * @name EndState.create
 * @methodOf Joint.dia.fsa
 * @param {Object} properties
 * @param {Object} properties.position Position of the end state (e.g. {x: 50, y: 100}).
 * @param {Number} [properties.radius] Radius of the circle of the end state.
 * @param {Number} [properties.innerRadius] Radius of the inner circle of the end state.
 * @param {Object} [properties.attrs] SVG attributes of the appearance of the end state.
 * @param {Object} [properties.innerAttrs] SVG attributes of the appearance of the inner circle of the end state.
 * @example
var s0 = Joint.dia.fsa.EndState.create({
  position: {x: 120, y: 70},
  radius: 15,
  innerRadius: 8,
  attrs: {
    stroke: "blue",
    fill: "yellow"
  },
  innerAttrs: {
    fill: "red"
  }
});
 */
fsa.EndState = Element.extend({
     object: "EndState",
     module: "fsa",
     init: function(properties){
	 // options
	 var p = Joint.DeepSupplement(this.properties, properties, {
             position: point(0,0),
             radius: 10,
             innerRadius: (properties.radius && (properties.radius / 2)) || 5,
             attrs: { fill: 'white' },
             innerAttrs: { fill: 'black' }
         });
	 // wrapper
	 this.setWrapper(this.paper.circle(p.position.x, p.position.y, p.radius).attr(p.attrs));
	 // inner
	 this.addInner(this.paper.circle(p.position.x, p.position.y, p.innerRadius).attr(p.innerAttrs));
     },
     zoom: function(){
	 this.inner[0].scale.apply(this.inner[0], arguments);
     }
});

})(this);	// END CLOSURE

(function(global){	// BEGIN CLOSURE

var Joint = global.Joint,
     Element = Joint.dia.Element,
     point = Joint.point;

/**
 * @name Joint.dia.org
 * @namespace Holds functionality related to Org-charts.
 */
var org = Joint.dia.org = {};

/**
 * Predefined arrow. You are free to use this arrow as the option parameter to joint method.
 * @name arrow
 * @memberOf Joint.dia.org
 * @example
 * var arrow = Joint.dia.org.arrow;
 */
org.arrow = {
    startArrow: {type: 'none'},
    endArrow: {type: 'none'},
    attrs: {"stroke-dasharray": "none", 'stroke-width': 2, stroke: 'gray' }
};


/**
 * Organizational chart member.
 * @methodOf Joint.dia.org
 */
org.Member = Element.extend({
    object: 'Member',
    module: 'org',
    init: function(properties) {
        var p = Joint.DeepSupplement(this.properties, properties, {
            attrs: { fill: 'lightgreen', stroke: '#008e09', 'stroke-width': 2 },
            name: '',
            position: '',
            nameAttrs: { 'font-weight': 'bold' },
            positionAttrs: {},
            swimlaneAttrs: { 'stroke-width': 1, stroke: 'black' },
            labelOffsetY: 10,
            radius: 10,
            shadow: true,
            avatar: '',
            padding: 5
        });
        this.setWrapper(this.paper.rect(p.rect.x, p.rect.y, p.rect.width, p.rect.height, p.radius).attr(p.attrs));
        if (p.avatar) {
            this.addInner(this.paper.image(p.avatar, p.rect.x + p.padding, p.rect.y + p.padding, p.rect.height - 2*p.padding, p.rect.height - 2*p.padding));
            p.labelOffsetX = p.rect.height;
        }
        if (p.position) {
            var positionElement = this.getPositionElement();
            this.addInner(positionElement[0]);
            this.addInner(positionElement[1]);      // swimlane
        }
        this.addInner(this.getNameElement());
    },
    getPositionElement: function() {
	var p = this.properties,
	    bb = this.wrapper.getBBox(),
	    t = this.paper.text(bb.x + bb.width/2, bb.y + bb.height/2, p.position).attr(p.positionAttrs || {}),
	    tbb = t.getBBox();
	t.translate(bb.x - tbb.x + p.labelOffsetX, bb.y - tbb.y + tbb.height);
        tbb = t.getBBox();
        var l = this.paper.path(['M', tbb.x, tbb.y + tbb.height + p.padding, 
                                 'L', tbb.x + tbb.width, tbb.y + tbb.height + p.padding].join(' '));
	return [t, l];
    },
    getNameElement: function() {
	var p = this.properties,
	    bb = this.wrapper.getBBox(),
	    t = this.paper.text(bb.x + bb.width/2, bb.y + bb.height/2, p.name).attr(p.nameAttrs || {}),
	    tbb = t.getBBox();
	t.translate(bb.x - tbb.x + p.labelOffsetX, bb.y - tbb.y + tbb.height*2 + p.labelOffsetY);
	return t;
    }
});

})(this);	// END CLOSURE

(function(global){	// BEGIN CLOSURE

var Joint = global.Joint,
     Element = Joint.dia.Element;

/**
 * @name Joint.dia.pn
 * @namespace Holds functionality related to Petri net diagrams.
 */
var pn = Joint.dia.pn = {};

/**
 * Predefined arrow.
 * @name Joint.dia.pn.arrow
 * @memberOf Joint.dia.pn
 * @example p1.joint(e2, Joint.dia.pn.arrow);
 */
pn.arrow = {
    startArrow: {type: "none"},
    endArrow: {type: "basic", size: 5}, 
    attrs: {"stroke-dasharray": "none"}
};

/**
 * Petri net place.
 * @name Place.create
 * @methodOf Joint.dia.pn
 * @param {Object} properties
 * @param {Object} properties.position Position of the place (e.g. {x: 50, y: 100}).
 * @param {Number} [properties.radius] Radius of the circle of the place.
 * @param {Number} [properties.tokenRadius] Radius of the tokens of the place.
 * @param {Number} [properties.tokens] Number of tokens.
 * @param {String} [properties.label] The name of the place.
 * @param {Object} [properties.attrs] SVG attributes of the appearance of the place.
 * @param {Object} [properties.tokenAttrs] SVG attributes of the appearance of the token circles.
 * @example
var p1 = Joint.dia.pn.Place.create({
  position: {x: 120, y: 70},
  radius: 25,
  tokenRadius: 4,
  tokens: 3,
  label: "p1",
  attrs: {
    stroke: "blue"
  },
  tokenAttrs: {
    fill: "red"
  }
});
 */
pn.Place = Element.extend({
     object: "Place",
     module: "pn",
     init: function(properties){
	 // options
	 var p = Joint.DeepSupplement(this.properties, properties, {
             radius: 20,
             tokenRadius: 3,
             tokens: 0,
             attrs: { fill: 'white' },
             tokenAttrs: { fill: 'black' }
         });
	 // wrapper
	 var paper = this.paper;
	 this.setWrapper(paper.circle(p.position.x, p.position.y, p.radius).attr(p.attrs));
	 // inner
	 var strut = 2; // px
	 switch (p.tokens){
	 case 0:
	     break;
	 case 1:
	     this.addInner(paper.circle(p.position.x, p.position.y, p.tokenRadius).attr(p.tokenAttrs));
	     break;
	 case 2:
	     this.addInner(paper.circle(p.position.x - (p.tokenRadius * 2), p.position.y, p.tokenRadius).attr(p.tokenAttrs));
	     this.addInner(paper.circle(p.position.x + (p.tokenRadius * 2), p.position.y, p.tokenRadius).attr(p.tokenAttrs));
	     break;
	 case 3:
	     this.addInner(paper.circle(p.position.x - (p.tokenRadius * 2) - strut, p.position.y, p.tokenRadius).attr(p.tokenAttrs));
	     this.addInner(paper.circle(p.position.x + (p.tokenRadius * 2) + strut, p.position.y, p.tokenRadius).attr(p.tokenAttrs));
	     this.addInner(paper.circle(p.position.x, p.position.y, p.tokenRadius).attr(p.tokenAttrs));
	     break;
	 default:
	     this.addInner(paper.text(p.position.x, p.position.y, p.tokens.toString()));
	     break;
	 }
	 // label
	 if (p.label){
	     this.addInner(paper.text(p.position.x, p.position.y - p.radius, p.label));
	     this.inner[this.inner.length - 1].translate(0, -this.inner[this.inner.length - 1].getBBox().height);
	 }
     },
     zoom: function(){
	 // @todo tokens must move accordingly
	 for (var i = 0, len = this.inner.length; i < len; i++){
	     this.inner[i].scale.apply(this.inner[i], arguments);
	 }
	 if (this.label){
	     this.inner[this.inner.length - 1].remove();
	     var bb = this.wrapper.getBBox();
	     this.inner[this.inner.length - 1] = this.paper.text(bb.x, bb.y, this.properties.label);
	     this.inner[this.inner.length - 1].translate(0, -this.inner[this.inner.length - 1].getBBox().height);
	 }
     }
});

/**
 * Petri net event.
 * @name Event.create
 * @methodOf Joint.dia.pn
 * @param {Object} properties
 * @param {Object} properties.rect Bounding box of the event (e.g. {x: 50, y: 100, width: 30, height: 100}).
 * @param {String} [properties.label] The name of the event.
 * @param {Object} [properties.attrs] SVG attributes of the appearance of the event.
 * @example
var p1 = Joint.dia.pn.Event.create({
  rect: {x: 120, y: 70, width: 50, height: 7},
  label: "e1",
  attrs: {
    stroke: "blue",
    fill: "yellow"
  }
});
 */
pn.Event = Element.extend({
     object: "Event",
     module: "pn",
     init: function(properties){
	 // options
	 var p = Joint.DeepSupplement(this.properties, properties, {
             attrs: { fill: 'black', stroke: 'black' }
         });
	 // wrapper
	 var paper = this.paper;
	 this.setWrapper(paper.rect(p.rect.x, p.rect.y, p.rect.width, p.rect.height).attr(p.attrs));
	 if (p.label){
	     this.addInner(paper.text(p.rect.x, p.rect.y, p.label));
	     this.inner[0].translate(0, -this.inner[0].getBBox().height);
	 }
     },
     zoom: function(){
	 if (this.properties.label){
	     this.inner[0].remove();
	     var bb = this.wrapper.getBBox();
	     this.inner[0] = this.paper.text(bb.x, bb.y, this.properties.label);
	     this.inner[0].translate(0, -this.inner[0].getBBox().height);
	 }
     }
});

})(this);	// END CLOSURE

(function(global){	// BEGIN CLOSURE

var Joint = global.Joint;

Joint.Mixin(Joint.prototype, /** @lends Joint.prototype */ {
    /**
     * Returns compact object representation of joint. Used for serialization.
     * @return {Object} Compact representation of the joint.
     */
    compact: function(){
	var start = this.startObject(), end = this.endObject(),
	    regs = this._registeredObjects, iRegs = regs.length, reg,
	    j = {
		object: "joint",
		euid: this.euid(),
		opt: this._opt,
		from: undefined,
		to: undefined,
		registered: {
		    start: [],
		    end: [],
		    both: []
		}
	    };
	// @todo Ugly!!! Joint shouldn't know anything about Joint.dia! Remove!

	// from/to
	if (start.wholeShape)
	    j.from = start.wholeShape.euid();
	if (end.wholeShape)
	    j.to = end.wholeShape.euid();

	if (this.isStartDummy())
	    j.from = start.attrs.cx + "@" + start.attrs.cy;
	if (this.isEndDummy())
	    j.to = end.attrs.cx + "@" + end.attrs.cy;

	// registered objects processing
	while(iRegs--){
	    reg = regs[iRegs];
	    j.registered[reg._capToStick || "both"].push(reg.euid());
	}
	return j;
    },
    /**
     * @return {String} JSON representation of joint.
     */
    stringify: function(){
	return JSON.stringify(this.compact());
    }
});

Joint.Mixin(Joint.dia, /** @lends Joint.dia */ {
     /**
      * Clones diagram in the current paper.
      * @return {Array} Array of the constructed elements.
      */
    clone: function(){
	return this.parse(this.stringify(Joint.paper()));
    },
    /**
     * Construct a diagram from the JSON representation.
     * @param {String} JSON
     * @return {Array} Array of the constructed elements.
     */
    parse: function(json){
	var arr = JSON.parse(json), o, m, e,
	    element, joints = [], i, len, elements = {},
	    objects = [];

	if (!(arr instanceof Array)) arr = [arr];

	// for all elements
	for (i = 0, len = arr.length; i < len; i++){
	    o = arr[i];

	    m = o.module;
	    e = o.object;

	    // create joints separatly, after all elements are created
	    // so that they can connect them
	    if (e === "joint"){
		joints.push(o);
		objects.push(o);
		continue;
	    }
	    // construct the element
	    if (this[m]){
		if (this[m][e]){
		    element = this[m][e].create(o);
		} else {
		    console.error("Object " + e + " of module " + m + " is missing.");
		    return;
		}
	    } else {
		console.error("Module " + m + " is missing.");
		return;
	    }
	    if (o.euid) elements[o.euid] = element;

	    // translate, @todo rotate, scale
	    element.translate(o.dx, o.dy);
	    // element.rotate(o.rot);
	    element.scale(o.sx, o.sy);
	    objects.push(element);
	}
	this.hierarchize(elements);
	this.createJoints(joints, elements);
	return objects;
    },
    /**
     * @private
     */
    hierarchize: function(elements){
	var euid, element;
	for (euid in elements){
	    if (!elements.hasOwnProperty(euid)) continue;
	    element = elements[euid];
	    if (element.properties.parent && elements[element.properties.parent])
		elements[element.properties.parent].addInner(element);
	}
    },
    /**
     * Create joints.
     * @private
     * @param {Array} joints Matrix of joints for each element.
     * @param {Object} elements Hash table of elements (key: euid, value: element).
     */
    createJoints: function(joints, elements){
	var iJoints = joints.length,
            joint, from, to, realFrom, realTo,
            newJoint, toRegister, toRegisterElement, iRegister, cap,
	    sides = ["start", "end", "both"], iSides = sides.length;
	// for all joints of all elements
	while (iJoints--){
	    joint = joints[iJoints];
	    from = elements[joint.from];
	    to = elements[joint.to];

	    // point or element wrapper
	    realFrom = (from) ? from.wrapper : {x: joint.from.split("@")[0], y: joint.from.split("@")[1]};
	    realTo = (to) ? to.wrapper : {x: joint.to.split("@")[0], y: joint.to.split("@")[1]};

	    // create joint
	    newJoint = this.Joint(realFrom, realTo, joint.opt);
	    // register caps - elements
	    toRegister = [];
	    iSides = sides.length;
	    while (iSides--){
		cap = sides[iSides];
		iRegister = joint.registered[cap].length;
		while (iRegister--){
		    if (elements[joint.registered[cap][iRegister]]){
			toRegisterElement = elements[joint.registered[cap][iRegister]];
			toRegisterElement._capToStick = cap;
			toRegister.push(toRegisterElement);
		    }
		}
	    }
	    newJoint.registerForever(toRegister);
	}//endwhile (iJoints--)
    },
    /**
     * Stringify the whole diagram (occupying a paper).
     * @param {RaphaelPaper} paper Raphael paper the diagram belongs to.
     * @return {String} JSON representation of the diagram.
     */
    stringify: function(paper){
	var objs, iObjs, o, str = [],
            registeredObjects = this._registeredObjects, registeredJoints = this._registeredJoints,
            paperEuid = paper.euid();
	// elements
	if (registeredObjects[paperEuid]){
	    objs = registeredObjects[paperEuid];
	    iObjs = objs.length;
	    while (iObjs--){
		o = objs[iObjs];
		if (o.object)
		    str.push(o.stringify());
	    }
	}
	// joints
	if (registeredJoints[paperEuid]){
	    objs = registeredJoints[paperEuid];
	    iObjs = objs.length;
	    while (iObjs--){
		o = objs[iObjs];
		str.push(o.stringify());
	    }
	}
	return "[" + str.join(",") + "]";
    }
});

Joint.Mixin(Joint.dia.Element.prototype, /** @lends Joint.dia.Element.prototype */ {
    /**
     * @return JSON representation of the element.
     */
    stringify: function(){
	return JSON.stringify(Joint.Mixin(this.properties, { euid: this.euid() }));
    },
    /**
     * Clone element.
     * @return {Element} Cloned element.
     */
    clone: function(){
	return Joint.dia.parse(this.stringify())[0];
    }
});

})(this);	// END CLOSURE

(function(global){	// BEGIN CLOSURE

var Joint = global.Joint,
     Element = Joint.dia.Element,
     point = Joint.point;

/**
 * @name Joint.dia.uml
 * @namespace Holds functionality related to UML diagrams.
 */
var uml = Joint.dia.uml = {};

Joint.arrows.aggregation = function(size){
    return {
	path: ["M","7","0","L","0","5","L","-7","0", "L", "0", "-5", "z"],
	dx: 9,
	dy: 9,
	attrs: {
	    stroke: "black",
	    "stroke-width": 2.0,
	    fill: "black"
	}
    };
};

/**
 * Predefined aggregation arrow for Class diagram.
 * @name aggregationArrow
 * @memberOf Joint.dia.uml
 * @example c1.joint(c2, Joint.dia.uml.aggregationArrow);
 */
uml.aggregationArrow = {
  endArrow: { type: "aggregation" },
  startArrow: {type: "none"},
  attrs: { "stroke-dasharray": "none" }
};
/**
 * Predefined dependency arrow for Class diagram.
 * @name dependencyArrow
 * @memberOf Joint.dia.uml
 * @example c1.joint(c2, Joint.dia.uml.dependencyArrow);
 */
uml.dependencyArrow = {
  endArrow: { type: "basic", size: 5 },
  startArrow: {type: "none"},
  attrs: { "stroke-dasharray": "none" }
};
/**
 * Predefined generalization arrow for Class diagram.
 * @name generalizationArrow
 * @memberOf Joint.dia.uml
 * @example c1.joint(c2, Joint.dia.uml.generalizationArrow);
 */
uml.generalizationArrow = {
  endArrow: { type: "basic", size: 10, attrs: {fill: "white"} },
  startArrow: {type: "none"},
  attrs: { "stroke-dasharray": "none" }
};
/**
 * Predefined arrow for StateChart.
 * @name Joint.dia.uml.arrow
 * @memberOf Joint.dia.uml
 * @example s1.joint(s2, Joint.dia.uml.arrow);
 */
uml.arrow = {
    startArrow: {type: "none"},
    endArrow: {type: "basic", size: 5},
    attrs: {"stroke-dasharray": "none"}
};

/**
 * UML StateChart state.
 * @name State.create
 * @methodOf Joint.dia.uml
 * @param {Object} properties
 * @param {Object} properties.rect Bounding box of the State (e.g. {x: 50, y: 100, width: 100, height: 80}).
 * @param {Number} [properties.radius] Radius of the corners of the state rectangle.
 * @param {String} [properties.label] The name of the state.
 * @param {Number} [properties.labelOffsetX] Offset in x-axis of the label from the state rectangle origin.
 * @param {Number} [properties.labelOffsetY] Offset in y-axis of the label from the state rectangle origin.
 * @param {Number} [properties.swimlaneOffsetY] Offset in y-axis of the swimlane shown after the state label.
 * @param {Object} [properties.attrs] SVG attributes of the appearance of the state.
 * @param {Object} [properties.actions] Actions of the state.
 * @param {String} [properties.actions.entry] Entry action of the state.
 * @param {String} [properties.actions.exit] Exit action of the state.
 * @param {array} [properties.actions.inner] Actions of the state (e.g. ["Evt1", "Action1()", "Evt2", "Action2()"])
 * @param {Number} [properties.actionsOffsetX] Offset in x-axis of the actions.
 * @param {Number} [properties.actionsOffsetY] Offset in y-axis of the actions.
 * @example
var s1 = Joint.dia.uml.State.create({
  rect: {x: 120, y: 70, width: 100, height: 60},
  label: "state 1",
  attrs: {
    fill: "90-#000-green:1-#fff"
  },
  actions: {
    entry: "init()",
    exit: "destroy()",
    inner: ["Evt1", "foo()", "Evt2", "bar()"]
  }
});
 */
uml.State = Element.extend({
    object: "State",
    module: "uml",
    init: function(properties){
	// options
        var p = Joint.DeepSupplement(this.properties, properties, {
            radius: 15,
            attrs: { fill: 'white' },
            label: '',
            labelOffsetX: 20,
            labelOffsetY: 5,
            swimlaneOffsetY: 18,
            actions: {
                entry: null,
                exit: null,
                inner: []
            },
            actionsOffsetX: 5,
            actionsOffsetY: 5
        });
	// wrapper
	this.setWrapper(this.paper.rect(p.rect.x, p.rect.y, p.rect.width, p.rect.height, p.radius).attr(p.attrs));
	// inner
	this.addInner(this.getLabelElement());
	this.addInner(this.getSwimlaneElement());
	this.addInner(this.getActionsElement());
    },
    getLabelElement: function(){
	var
	p = this.properties,
	bb = this.wrapper.getBBox(),
	t = this.paper.text(bb.x, bb.y, p.label).attr(p.labelAttrs || {}),
	tbb = t.getBBox();
	t.translate(bb.x - tbb.x + p.labelOffsetX,
		    bb.y - tbb.y + p.labelOffsetY);
	return t;
    },
    getSwimlaneElement: function(){
	var bb = this.wrapper.getBBox(), p = this.properties;
	return this.paper.path(["M", bb.x, bb.y + p.labelOffsetY + p.swimlaneOffsetY, "L", bb.x + bb.width, bb.y + p.labelOffsetY + p.swimlaneOffsetY].join(" "));
    },
    getActionsElement: function(){
	// collect all actions
	var p = this.properties;
	var str = (p.actions.entry) ? "entry/ " + p.actions.entry + "\n" : "";
	str += (p.actions.exit) ? "exit/ " + p.actions.exit + "\n" : "";
	var l = p.actions.inner.length;
	for (var i = 0; i < l; i += 2){
	    str += p.actions.inner[i] + "/ " + p.actions.inner[i+1] + "\n";
	}
	// trim
	str = str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

	// draw text with actions
	var
	bb = this.wrapper.getBBox(),
	t = this.paper.text(bb.x + p.actionsOffsetX, bb.y + p.labelOffsetY + p.swimlaneOffsetY + p.actionsOffsetY, str),
	tbb = t.getBBox();
	t.attr("text-anchor", "start");
	t.translate(0, tbb.height/2);	// tune the y position
	return t;
    },
    zoom: function(){
	this.wrapper.attr("r", this.properties.radius); 	// set wrapper's radius back to its initial value (it deformates after scaling)
	this.shadow && this.shadow.attr("r", this.properties.radius); 	// update shadow as well if there is one 
	this.inner[0].remove();	// label
	this.inner[1].remove();	// swimlane
	this.inner[2].remove();	// actions
	this.inner[0] = this.getLabelElement();
	this.inner[1] = this.getSwimlaneElement();
	this.inner[2] = this.getActionsElement();
    }
});


/**
 * UML StateChart start state.
 * @name StartState.create
 * @methodOf Joint.dia.uml
 * @param {Object} properties
 * @param {Object} properties.position Position of the start state (e.g. {x: 50, y: 100}).
 * @param {Number} [properties.radius] Radius of the circle of the start state.
 * @param {Object} [properties.attrs] SVG attributes of the appearance of the start state.
 * @example
var s0 = Joint.dia.uml.StartState.create({
  position: {x: 120, y: 70},
  radius: 15,
  attrs: {
    stroke: "blue",
    fill: "yellow"
  }
});
 */
uml.StartState = Element.extend({
     object: "StartState",
     module: "uml",
     init: function(properties){
	 // options
	 var p = Joint.DeepSupplement(this.properties, properties, {
             position: point(0,0),
             radius: 10,
             attrs: { fill: 'black' }
         });
	 // wrapper
	 this.setWrapper(this.paper.circle(p.position.x, p.position.y, p.radius).attr(p.attrs));
     }
});


/**
 * UML StateChart end state.
 * @name EndState.create
 * @methodOf Joint.dia.uml
 * @param {Object} properties
 * @param {Object} properties.position Position of the end state (e.g. {x: 50, y: 100}).
 * @param {Number} [properties.radius] Radius of the circle of the end state.
 * @param {Number} [properties.innerRadius] Radius of the inner circle of the end state.
 * @param {Object} [properties.attrs] SVG attributes of the appearance of the end state.
 * @param {Object} [properties.innerAttrs] SVG attributes of the appearance of the inner circle of the end state.
 * @example
var s0 = Joint.dia.uml.EndState.create({
  position: {x: 120, y: 70},
  radius: 15,
  innerRadius: 8,
  attrs: {
    stroke: "blue",
    fill: "yellow"
  },
  innerAttrs: {
    fill: "red"
  }
});
 */
uml.EndState = Element.extend({
     object: "EndState",
     module: "uml",
     init: function(properties){
	 // options
	 var p = Joint.DeepSupplement(this.properties, properties, {
             position: point(0,0),
             radius: 10,
             innerRadius: (properties.radius && properties.radius / 2) || 5,
             attrs: { fill: 'white' },
             innerAttrs: { fill: 'black' }
         });
	 // wrapper
	 this.setWrapper(this.paper.circle(p.position.x, p.position.y, p.radius).attr(p.attrs));
	 // inner
	 this.addInner(this.paper.circle(p.position.x, p.position.y, p.innerRadius).attr(p.innerAttrs));
     },
     zoom: function(){
	 this.inner[0].scale.apply(this.inner[0], arguments);
     }
});


/**
 * UML StateChart class.
 * @name Class.create
 * @methodOf Joint.dia.uml
 * @param {Object} properties
 * @param {Object} properties.rect Bounding box of the Class (e.g. {x: 50, y: 100, width: 100, height: 80}).
 * @param {String} [properties.label] The name of the class.
 * @param {Number} [properties.labelOffsetX] Offset in x-axis of the label from the class rectangle origin.
 * @param {Number} [properties.labelOffsetY] Offset in y-axis of the label from the class rectangle origin.
 * @param {Number} [properties.swimlane1OffsetY] Offset in y-axis of the swimlane shown after the class label.
 * @param {Number} [properties.swimlane2OffsetY] Offset in y-axis of the swimlane shown after the class attributes.
 * @param {Object} [properties.attrs] SVG attributes of the appearance of the state.
 * @param {array} [properties.attributes] Attributes of the class.
 * @param {array} [properties.methods] Methods of the class.
 * @param {Number} [properties.attributesOffsetX] Offset in x-axis of the attributes.
 * @param {Number} [properties.attributesOffsetY] Offset in y-axis of the attributes.
 * @param {Number} [properties.methodsOffsetX] Offset in x-axis of the methods.
 * @param {Number} [properties.methodsOffsetY] Offset in y-axis of the methods.
 * @example
var c1 = Joint.dia.uml.Class.create({
  rect: {x: 120, y: 70, width: 120, height: 80},
  label: "MyClass",
  attrs: {
    fill: "90-#000-yellow:1-#fff"
  },
  attributes: ["-position"],
  methods: ["+createIterator()"]
});
 */
uml.Class = Element.extend({
    object: "Class",
    module: "uml",
    init: function(properties){
	var p = Joint.DeepSupplement(this.properties, properties, {
            attrs: { fill: 'white' },
            label: '',
            labelOffsetX: 20,
            labelOffsetY: 5,
            swimlane1OffsetY: 18,
            swimlane2OffsetY: 18,
            attributes: [],
            attributesOffsetX: 5,
            attributesOffsetY: 5,
            methods: [],
            methodsOffsetX: 5,
            methodsOffsetY: 5
        });
	// wrapper
	this.setWrapper(this.paper.rect(p.rect.x, p.rect.y, p.rect.width, p.rect.height).attr(p.attrs));
	// inner
	this.addInner(this.getLabelElement());
	this.addInner(this.getSwimlane1Element());
	this.addInner(this.getAttributesElement());
	this.addInner(this.getSwimlane2Element());
	this.addInner(this.getMethodsElement());
    },
    getLabelElement: function(){
	var
	p = this.properties,
	bb = this.wrapper.getBBox(),
	t = this.paper.text(bb.x, bb.y, p.label).attr(p.labelAttrs || {}),
	tbb = t.getBBox();
	t.translate(bb.x - tbb.x + p.labelOffsetX, bb.y - tbb.y + p.labelOffsetY);
	return t;
    },
    getSwimlane1Element: function(){
	var bb = this.wrapper.getBBox(), p = this.properties;
	return this.paper.path(["M", bb.x, bb.y + p.labelOffsetY + p.swimlane1OffsetY, "L", bb.x + bb.width, bb.y + p.labelOffsetY + p.swimlane1OffsetY].join(" "));
    },
    getSwimlane2Element: function(){
	var
	p = this.properties,
	bb = this.wrapper.getBBox(),
	bbAtrrs = this.inner[2].getBBox();  // attributes
	return this.paper.path(["M", bb.x, bb.y + p.labelOffsetY + p.swimlane1OffsetY + bbAtrrs.height + p.swimlane2OffsetY, "L", bb.x + bb.width, bb.y + p.labelOffsetY + p.swimlane1OffsetY + bbAtrrs.height + p.swimlane2OffsetY].join(" "));
    },
    getAttributesElement: function(){
	var str = " ", p = this.properties;
	for (var i = 0, len = p.attributes.length; i < len; i++){
	    str += p.attributes[i] + "\n";
	}
	// trim
	str = str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

	var
	bb = this.wrapper.getBBox(),
	t = this.paper.text(bb.x + p.attributesOffsetX, bb.y + p.labelOffsetY + p.swimlane1OffsetY + p.attributesOffsetY, str),
	tbb = t.getBBox();
	t.attr("text-anchor", "start");
	t.translate(0, tbb.height/2);	// tune the y-position
	return t;
    },
    getMethodsElement: function(){
	var str = " ", p = this.properties;
	for (var i = 0, len = p.methods.length; i < len; i++){
	    str += p.methods[i] + "\n";
	}
	// trim
	str = str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    	var
	bb = this.wrapper.getBBox(),
	bbAtrrs = this.inner[2].getBBox(),  // attributes
	t = this.paper.text(bb.x + p.methodsOffsetX, bb.y + p.labelOffsetY + p.swimlane1OffsetY + p.attributesOffsetY + bbAtrrs.height + p.swimlane2OffsetY + p.methodsOffsetY, str),
	tbb = t.getBBox();
	t.attr("text-anchor", "start");
	t.translate(0, tbb.height/2);	// tune the y-position
	return t;
    },
    zoom: function(){
	this.inner[0].remove();	// label
	this.inner[1].remove();	// swimlane1
	this.inner[2].remove();	// attributes
	this.inner[3].remove();	// swimlane2
	this.inner[4].remove();	// methods
	this.inner[0] = this.getLabelElement();
	this.inner[1] = this.getSwimlane1Element();
	this.inner[2] = this.getAttributesElement();
	this.inner[3] = this.getSwimlane2Element();
	this.inner[4] = this.getMethodsElement();
    }
});

})(this);	// END CLOSURE

return this.Joint;
});