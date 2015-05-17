/**
 * User : YuanChang<Yuan-Chang@qq.com>
 * Date : 2015/5/16.
 * Time : 15:21
 */
TC.prototype.extend("animate", animate);
function animate(obj) {
    /**
     * attr:属性
     * start:属性初始值ֵ
     * target：属性目标值,必选
     * step:步长
     * speed:速度
     * callback:回调函数
     */
    function setOpacity() {
        var _target = parseInt(target * 100),
            _start = isNaN(start) ? parseInt(_that.getStyle(_box, "filter").match(/\d+/)[0]) : parseInt(start * 100),
            _step = step;
        _target > 100 ? _target = 100 : _target < 0 ? _target = 0 : _target;    //以防超过范围
        _start > 100 ? _start = 100 : _start < 0 ? _start = 0 : _start;    //以防超过范围
        _box.style.opacity = _start / 100;    //W3C初始化
        _box.style.filter = "alpha(opacity=" + _start + ")";   //IE初始化
        _box.timer["opacity"] = setInterval(function () {
            //特别注意小数的运算
            _start = _step > 0 ? parseInt(Math.ceil(_that.getStyle(_box, "opacity") * 100)) : parseInt(Math.floor(_that.getStyle(_box, "opacity") * 100));

            if (type == "buffer") {
                _step = _step > 0 ? Math.ceil((_target - _start) / speed) : Math.floor((_target - _start) / speed);
            }

            if ((_step > 0 && _start + _step >= _target) || (_step < 0 && _start + _step <= _target) || (_step == 0)) {
                _box.style.opacity = _target / 100;
                _box.style.filter = "alpha(opacity=" + _target + ")";
                if (timerFlag) {
                    if (timerFlag) {
                        for (var j in _box.timer) {
                            clearInterval(_box.timer[j]);
                        }
                        if (obj.fn)obj.fn();
                    }
                }
                timerFlag = true;
            } else {
                _box.style.opacity = (_start + _step) / 100;
                _box.style.filter = "alpha(opacity=" + _start + _step + ")";
                timerFlag = false;
            }
        }, speed);
    }

    function setAttr(attr) {
        var _target = parseInt(target),
            _start = parseInt(start),
            _step = step;

        _box.style[attr] = _start + "px";
        _box.timer[attr] = setInterval(function () {
            _start = parseInt(_that.getStyle(_box, attr));
            if (type == "buffer") {
                _step = _step > 0 ? Math.ceil((_target - _start) / speed) : Math.floor((_target - _start) / speed);
            }
            if ((_step > 0 && _start + _step >= _target) || (_step < 0 && _start + _step <= _target) || ((_step == 0))) {
                _box.style[attr] = _target + "px";
                if (timerFlag) {
                    for (var j in _box.timer) {
                        clearInterval(_box.timer[j]);
                    }
                    if (obj.fn)obj.fn();
                }
                timerFlag = true;
            } else {
                _box.style[attr] = _start + _step + "px";
                timerFlag = false;
            }
        }, speed);
    }

    for (var i = this._elements.length; i--;) {
        var _that = this,
            timerFlag = false;
        _box = _that._elements[i],
            mul = obj.mul,  //接受多组动画
            type = obj.type == "constant" ? "constant" : "buffer",
            step = parseInt(obj.step) || 10,
            speed = (typeof obj.speed == "string" ?
                (obj.speed == "slow" ? 100 : (obj.speed == "middle" ? 50 : (obj.speed == "fast" ? 10 : 50))) :
                (typeof obj.speed == "number" ? parseInt(obj.speed) : 50));
        if (mul == "undefined") {
            var attr = obj.attr ? obj.attr : "left",
                start = typeof obj.start == "undefined" ? parseFloat(_that.getStyle(_box, attr)) : obj.start,
                increment = obj.increment,
                target = typeof increment != "undefined" ? increment + start : typeof obj.target != "undefined" ? obj.target : "undefined";
        }

        if (!(typeof increment || typeof target || typeof mul))throw new Error("increment|target 必须有一个赋值");
        if (start > target)step = -step;
        if (_box.timer) {
            for (var i in _box.timer) {
                clearInterval(_box.timer[i]);
            }
        } else {
            _box.timer = {};
        }

        if (mul != "undefined") {
            for (var i in mul) {
                target = mul[i];
                attr = i;
                start = parseFloat(_that.getStyle(_box, attr));
                attr == "opacity" ? setOpacity() : setAttr(attr);
            }
        } else {
            attr == "opacity" ? setOpacity() : setAttr(attr);
        }

        return this;
    }



}

