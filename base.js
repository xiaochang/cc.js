/**
 * User : YuanChang<Yuan-Chang@qq.com>
 * Date : 2015/5/8.
 * Time : 18:46
 */
function TC() {
    this._elements = [];
}

//Base
TC.prototype.selectType = function (selector) {  //Judgment  selector type
    if (/^#/.test(selector)) {
        return {type: "id", value: selector.replace(/^#/, "")};
    } else if (/^\./.test(selector)) {
        return {type: "className", value: selector.replace(/^\./, "")};
    } else {
        return {type: "tag", value: selector};
    }
};
TC.prototype.ready = function (fn) {  //未对低版本和IE做兼容
    if (typeof document.addEventListener != "undefined") {
        this.addEvent(document, "DOMContentLoaded", function () {
            fn();
            TC.prototype.rmEvent(document, "DOMContentLoaded", arguments.callee);
        });
    } else {
        this.addEvent(window, "load", function () {
            fn();
            TC.prototype.rmEvent(window, "load", arguments.callee);
        });
    }
};
TC.prototype.ltrim = function (value) {
    return value.replace(/^\s*/g, "");
};
TC.prototype.rtrim = function (value) {
    return value.replace(/\s*$/g, "");
};
TC.prototype.trim = function (value) {
    return value.replace(/(^\s*)|(\s*$)/g, "");
};
TC.prototype.len = function () {
    return this._elements.length;
}

//Event Interface
TC.prototype.eFit = function (e) {
    var event = e || window.event;
    if (typeof event.preventDefault == "undefined") {
        event.preventDefault = function () {
            this.returnValue = false;
        };
        event.stopPropagation = function () {
            this.cancelBubble = true;
        }
    }
    return event;
};
TC.prototype.eventExec = function (event) {
    var e = event || window.event,
        e = TC.prototype.eFit(e),
        type = e.type,
        es = this.events[type];
    for (i in this.events[type]) {
        this.events[type][i].call(this, e);
    }
};
TC.prototype.addEvent = function (obj, type, fn) {
    if (typeof obj.addEventListener != "undefined") {   //w3c
        obj.addEventListener(type, fn);
    } else {  //ie
        if (!obj.events) {
            obj.events = {};
        }
        var es = obj.events[type];
        if (!es) {
            es = obj.events[type] = [];
            es[0] = fn;
            obj[type + "ID"] = 0;
            obj["on" + type] = this.eventExec;
        } else {
            var flag = true;
            for (i in es) {
                if (es[i] == fn) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                es[++obj[type + "ID"]] = fn;
                obj["on" + type] = this.eventExec;
            }
        }
    }
};
TC.prototype.rmEvent = function (obj, type, fn) {
    if (typeof obj.removeEventListener != "undefined") {   //w3c
        obj.removeEventListener(type, fn);
    } else {  //ie
        var es = obj.events[type];
        if (es) {
            for (i in es) {
                if (es[i] == fn) {
                    delete es[i];
                    break;
                }
            }
        }
    }
    return this;
};
TC.prototype.bind = function (type, fn) { //绑定事件
    for (var i = this._elements.length; i--;) {
        this.addEvent(this._elements[i], type, fn);
    }
    return this;
};
TC.prototype.unbind = function (type, fn) { //移除事件
    for (var i = this._elements.length; i--;) {
        this.rmEvent(this._elements[i], type, fn);
    }
    return this;
};
TC.prototype.click = function (fn) {
    for (var i = this._elements.length; i--;) {
        this.addEvent(this._elements[i], "click", fn);
    }
    return this;
};
TC.prototype.hover = function (over, out) {
    this.mouseover(over);
    this.mouseout(out);
};
TC.prototype.mouseover = function (fn) {
    for (var i = this._elements.length; i--;) {
        this.addEvent(this._elements[i], "mouseover", fn);
    }
    return this;
};
TC.prototype.mouseout = function (fn) {
    for (var i = this._elements.length; i--;) {
        this.addEvent(this._elements[i], "mouseout", fn);
    }
    return this;
};
TC.prototype.toggle = function () {
    var fnList = arguments,
        fucount = fnList.length,
        _this = this;

    for (var i = this._elements.length; i--;) {
        (function (element, fn) {
            var _count = 0;
            _this.addEvent(element, "click", function () {
                fn[_count++ % fucount].call(element); //为了将函数中的this指向该元素
            });
        })(this._elements[i], fnList)

    }
    return this;
};

//DOM Interface
TC.prototype.id = function (id) {
    return [document.getElementById(id)] || document.all[id] || [];
};
TC.prototype.className = function (className, parent) {
    if (typeof parent == "undefined")parent = document;
    if (typeof document.getElementsByClassName != "undefined") {  // for W3C
        return parent.getElementsByClassName(className) || [];
    } else if (typeof document.getElementsByTagName != "undefined" || typeof document.all != "undefined") {   // for lower version
        var all = parent.getElementsByTagName("*") || parent.all(),
            childElement = [];
        for (var i = all.length; i--;) {
            if (this.hasClass(className, all[i])) {
                childElement.unshift(all[i]);
            }
        }
        return childElement;
    }
};
TC.prototype.tag = function (tagName, parent) {
    //parent.tags for IE4
    if (typeof parent == "undefined")parent = document;
    return parent.getElementsByTagName(tagName) || parent.tags(tagName) || [];
};
TC.prototype.from = function (tagName, parent) {
    if (typeof parent == "undefined")parent = document;
    this._elements = parent.getElementsByName(tagName) || [];
    return this;
};
TC.prototype.first = function () {    //return firstChild
    var _len = this._elements.length;
    if (_len) {
        var findElement = null, childElement = [];
        for (var _i = 0; _i < _len; _i++) {
            findElement = this._elements[_i].firstElementChild || this._elements[_i].children[0];
            if (findElement) {
                childElement.push(findElement);
            }
        }
        this._elements = childElement;
    } else {
        this._elements = document.firstElementChild || document.children[0];
    }
    return this;
};
TC.prototype.last = function (parent) { //return lastChild
    var _len = this._elements.length;
    if (_len) {
        var findElement = null, childElement = [];
        for (var _i = 0; _i < _len; _i++) {
            findElement = this._elements[_i].lastElementChild || this._elements[_i].children[this._elements[_i].children.length - 1];
            if (findElement) {
                childElement.push(findElement);
            }
        }
        this._elements = childElement;
    } else {
        this._elements = document.lastElementChild || document.children[document.children.length - 1];
    }
    return this;
};
TC.prototype.next = function () {
    var _len = this._elements.length;
    if (_len) {
        this._elements = [this._elements[0].nextElementSibling || this._elements[0].nextSibling];
    }
    return this;
};
TC.prototype.prev = function () {
    var _len = this._elements.length;
    if (_len) {
        this._elements = [this._elements[0].previousElementSibling || this._elements[0].previousSibling];
    }
    return this;
};
TC.prototype.eq = function (num) { //return nth Child
    var _len = this._elements.length;
    if (_len) {
        var findElement = null, childElement = [];
        for (var _i = 0; _i < _len; _i++) {
            findElement = this._elements[_i].children[num];
            if (findElement) {
                childElement.push(findElement);
            }
        }
        this._elements = childElement;
    } else {
        this._elements = document.children[num];
    }
    return this;
};
TC.prototype.get = function (num) { //return nth Child
    var _len = this._elements.length;
    if (_len) {
        this._elements = [this._elements[num]];
    }
    return this;
};
TC.prototype.child = function () {
    var _len = this._elements.length;
    if (_len) {
        var findElement = null, childElement = [];
        for (var _i = 0; _i < _len; _i++) {
            findElement = this._elements[_i].children;
            if (findElement.length) {
                for (var __i = 0, __len = findElement.length; __i < __len; __i++) {
                    childElement.push(findElement[__i]);
                }
            }
        }
        this._elements = childElement;
    } else {
        this._elements = document.children;
    }
    return this;
};
TC.prototype.find = function (selector) {
    this.getEle(selector);
    return this;
};
TC.prototype.getEle = function (selector) {
    if (typeof selector == "string" && selector) {
        var selectorList = selector.split(/\s+/);
        for (var i = 0, len = selectorList.length; i < len; i++) {
            var childElement = [],
                _len = this._elements.length,
                selectType = this.selectType(selectorList[i]),
                findElement = [];
            if (_len) {
                for (var _i = 0; _i < _len; _i++) {
                    findElement = this[selectType.type](selectType.value, this._elements[_i]);
                    if (findElement.length) {
                        for (var __i = 0, __len = findElement.length; __i < __len; __i++) {
                            childElement.push(findElement[__i]);
                        }
                    }
                }
                this._elements = childElement;
                childElement = _len = selectType = findElement = null;
            } else {
                this._elements = this[selectType.type](selectType.value);
            }
        }
        return this;
    } else if (typeof selector == "function") {
        this.ready(selector);
        return this;
    } else if (typeof selector == "object") {
        this._elements = [selector];
        return this;
    } else {
        return this;
    }
};
TC.prototype.html = function (html) {
    if (arguments.length) {
        for (var i = this._elements.length; i--;) {
            this._elements[i].innerHTML = html;
        }
        return this;
    } else {
        return this._elements[0].innerHTML;
    }
};
TC.prototype.text = function (text) {
    /**
     * implement innerText
     */
    if (arguments.length) {
        var b = document.body;
        if (typeof b.innerText == "string") {
            for (var i = this._elements.length; i--;) {
                this._elements[i].innerText = text;
            }
        } else if (typeof b.textContent == "string") {
            for (var i = this._elements.length; i--;) {
                this._elements[i].textContent = text;
            }
        }
        return this;
    } else {
        return this._elements[0].innerText || this._elements[0].textContent;
    }
};
TC.prototype.val = function (val) {
    if (arguments.length) {
        for (var i = this._elements.length; i--;) {
            this._elements[i].value = val;
        }
        return this;
    } else {
        return this._elements[0].value;
    }
};
TC.prototype.add = function (ele) {
    for (var i = this._elements.length; i--;) {
        this._elements[i].appendChild(ele);
    }
    return this;
};
TC.prototype.dom = function (num) {
    return this._elements[num];
};

//BOM Interface
TC.prototype.sys = function () {    //Determine the version number
    var us = navigator.userAgent.toLowerCase(),
        sys = {},
        s;
    (s = us.match(/msie\s([\d.]+)/)) ? sys.ie = s[1] :
        (s = us.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
            (s = us.match(/opr\/([\d.]+)/)) ? sys.opera = s[1] :
                (s = us.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :
                    (s = us.match(/version([\d.]+).*safari/)) ? sys.ie = s[1] : 0;
    if (/webkit/.test(us)) sys.webkit = us.match(/webkit\/([\d.]+)/)[1];
    return sys;
}();
TC.prototype.clientSize = function (attr) {
    if (typeof window.innerWidth != "undefined") {
        var _clientSize = {
            width: window.innerWidth,
            height: window.innerHeight
        };
    } else {
        var _clientSize = {
            width: document.body.clientWidth || document.documentElement.clientWidth,
            height: document.body.clientHeight || document.documentElement.clientHeight
        };
    }
    return attr ? _clientSize[attr] : _clientSize;
};
TC.prototype.getScroll = function (attr) {
    var scroll = {
        scrollY: document.documentElement.scrollTop || document.body.scrollTop,
        scrollX: document.documentElement.scrollLeft || document.body.scrollLeft
    };
    return attr ? scroll[attr] : scroll;
};
//使元素相对视口居中
TC.prototype.center = function () {
    var clientSize = this.clientSize(),
        ele;
    for (var i = this._elements.length; i--;) {
        ele = this._elements[i];
        ele.style.top = clientSize.height / 2 - ele.offsetHeight / 2 + "px";
        ele.style.left = clientSize.width / 2 - ele.offsetWidth / 2 + "px";
    }
    return this;
};
//窗口改变大小时使元素相对视口可见
TC.prototype.resize = function () {
    var clientSize = $(window).clientSize();
    for (var i = this._elements.length; i--;) {
        var ele = this._elements[i],
            top = this.getStyle(ele, "offsetTop"),
            left = this.getStyle(ele, "offsetLeft"),
            objWidth = this.getStyle(ele, "offsetWidth"),
            objHeight = this.getStyle(ele, "offsetHeight");
        if (left < 0) {
            left = 0;
        } else if (left > clientSize.width - objWidth) {
            left = clientSize.width - objWidth;
        }
        if (top < 0) {
            top = 0;
        } else if (top > clientSize.height - objHeight) {
            top = clientSize.height - objHeight;
        }
        this.setStyle(ele, "left", left + "px");
        this.setStyle(ele, "top", top + "px");
    }
    return this;
};

//CSS Interface

//获取样式
TC.prototype.getStyle = function (element, attr) {
    if (typeof element[attr] != "undefined") {
        return element[attr];
    }
    if (typeof element.style != "undefined" && element.style[attr]) {
        return element.style[attr];
    }
    if (typeof window.getComputedStyle != "undefined") {
        return window.getComputedStyle(element, null)[attr];
    }
    return element.currentStyle[attr];
};
TC.prototype.setStyle = function (element, attr, value) {  //设置样式
    element.style[attr] = value;
    return this;
};
TC.prototype.css = function (attr, value) {
    if (arguments.length === 1) {
        return this.getStyle(this._elements[0], attr);
    } else {
        for (var i = this._elements.length; i--;) {
            this.setStyle(this._elements[i], attr, value);
        }
        return this;
    }
};
TC.prototype.hasClass = function () {
    var len = arguments.length,
        allClass = null;
    if (len === 1) {
        allClass = this._elements[0].className.split(/\s+/);
    } else if (len === 2) {
        allClass = arguments[1].className.split(/\s+/);
    }
    for (var i = allClass.length; i--;) {
        if (arguments[0] === allClass[i]) {
            return true;
        }
    }
    return false;
};
TC.prototype.addClass = function (className) {
    var oldClass = "";
    for (var i = this._elements.length; i--;) {
        oldClass = this._elements[i].className;
        if (oldClass) {
            if (oldClass.search(className) == -1) { // not exist className
                this._elements[i].className = oldClass + " " + className;
            }
        } else {
            this._elements[i].className = className;
        }
    }
    return this;
};
TC.prototype.removeClass = function (className) {
    var oldClass = "",  //Keep the old className
        len = arguments.length;
    if (len) {    //remove the specified class
        for(var i = this._elements.length;i--;){
            var oldClass = this._elements[i].className;
            this._elements[i].className = oldClass.replace(className, "");
        }
    } else {  //remove all the class
        for(var i = this._elements.length;i--;){
            this._elements[i].className = "";
        }
    }
    return this;
};
TC.prototype.addRule = function (num, selector, rule, index) {
    //add style or link rules
    var cssRule = document.styleSheets[num];
    index = index || cssRule.length;
    if (typeof cssRule.removeRule != "undefined") {   //w3c
        cssRule.insertRule(selector + "{" + rule + "}", index);
    } else if (typeof cssRule.deleteRule != undefined) {  //ie
        cssRule.addRule(selector, rule, index);
    }
};
TC.prototype.removeRule = function (num, index) {
    //remove style or link rules
    var cssRule = document.styleSheets[num];
    index = index || 0;
    if (typeof cssRule.removeRule != "undefined") {   //w3c
        cssRule.removeRule(index);
    } else if (typeof cssRule.deleteRule != "undefined") {  //ie
        cssRule.deleteRule(index);
    }
};
TC.prototype.show = function () {
    for (var i = this._elements.length; i--;) {
        this._elements[i].style.display = "block";
    }
    return this;
};
TC.prototype.hide = function () {
    for (var i = this._elements.length; i--;) {
        this._elements[i].style.display = "none";
    }
    return this;
};


//插件接口
TC.prototype.extend = function (name, fn) {
    TC.prototype[name] = fn;
};

var $ = function (ele) {
    var tc = new TC();
    return tc.getEle(ele);
};

