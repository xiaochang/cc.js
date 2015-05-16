/**
 * User : YuanChang<Yuan-Chang@qq.com>
 * Date : 2015/5/16.
 * Time : 15:21
 */
//TC.prototype.extend("animate",animate);
function animate(obj) {
    /**
     * attr:属性
     * start:属性初始值ֵ
     * target：属性目标值,必选
     * step:步长
     * speed:速度
     * callback:回调函数
     */
    var box = document.getElementById("box"),
        type = obj.type ? "constant" : "buffer",
        attr = obj.attr ? obj.attr : left,
        start = obj.start || parseFloat(window.getComputedStyle(box, null)[attr]),
        increment = obj.increment,
        target = increment ? increment + start : obj.target ? obj.target : "undefined",
        step = parseInt(obj.step) || 10,
        speed = (typeof obj.speed == "string" ?
            (obj.speed == "slow" ? 100 : (obj.speed == "middle" ? 50 : (obj.speed == "fast" ? 10 : 50))) :
            (typeof obj.speed == "number" ? parseInt(obj.speed) : 100));

    if (!(increment || target))throw new Error("increment|target 必须有一个赋值");
    if (start > target)step = -step;
    attr == "opacity" ? setOpacity() : setAttr();

    function setOpacity() {
        var _target = parseInt(target * 100),
            _start = parseInt(start * 100);

        _target > 100 ? _target = 100 : _target < 0 ? _target = 0 : _target;    //以防超过范围

        box.style.opacity = _start / 100;    //W3C初始化
        box.style.filter = "alpha(opacity=" + _start + ")";   //IE初始化

        clearInterval(box.timer);
        box.timer = setInterval(function () {
            _start = parseInt(box.style[attr] * 100);
            if ((step > 0 && _start + step > _target) || (step < 0 && _start + step < _target)) {
                box.style.opacity = _target / 100;
                box.style.filter = "alpha(opacity=" + _target + ")";
                clearInterval(box.timer);
            } else {
                box.style.opacity = (_start + step) / 100;
                box.style.filter = "alpha(opacity=" + _start + step + ")";
            }
        }, speed);
    }

    function setAttr() {
        var _target = parseInt(target),
            _start = parseInt(start);
        box.style[attr] = _start + "px";
        clearInterval(box.timer);
        box.timer = setInterval(function () {
            _start = parseInt(box.style[attr]);
            if ((step > 0 && _start + step > _target) || (step < 0 && _start + step < _target)) {
                box.style[attr] = target + "px";
                clearInterval(box.timer);
            } else {
                box.style[attr] = _start + step + "px";
            }
        }, speed);
    }

}

