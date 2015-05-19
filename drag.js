/**
 * User : YuanChang<Yuan-Chang@qq.com>
 * Date : 2015/5/12.
 * Time : 15:31
 */
TC.prototype.extend("drag", drag);
function drag(obj) {
    /**
     * 拖拽事件的流程
     * 1.鼠标按下可拖动
     * 2.鼠标移到开始拖动
     * 3.鼠标离开停止拖动
     */
    for (var i = this._elements.length; i--;) {
        var ele = this._elements[i],
            _this = this;
        this.bind("mousedown", function (e) {
            if (obj.start)obj.start();
            var diffX = e.clientX - _this.getStyle(ele, "offsetLeft"),
                diffY = e.clientY - _this.getStyle(ele, "offsetTop"),
                objWidth = _this.getStyle(ele, "offsetWidth"),
                objHeight = _this.getStyle(ele, "offsetHeight"),
                clientSize = _this.clientSize(),
                flag = false;
            if (obj.target) {
                var targets = $(obj.target)._elements;
                for (var j = targets.length; j--;) {
                    if (e.target == targets[j]) {
                        flag = true;
                        break;
                    }
                }
            } else {
                flag = true;
            }
            if (flag) {
                _this.addEvent(document, "mouseup", up);
                _this.addEvent(document, "mousemove", move);
            }
            function move(e) {
                var e = _this.eFit(e),
                    left = e.clientX - diffX,
                    top = e.clientY - diffY;
                if (!_this.trim(ele.innerHTML)) {
                    e.preventDefault();
                }
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
                _this.setStyle(ele, "left", left + "px").setStyle(ele, "top", top + "px");
                if (typeof this.setCapture != 'undefined') {
                    this.setCapture();
                }
            }

            function up() {
                if (obj.end)obj.end();
                _this.rmEvent(document, "mousemove", move);
                _this.rmEvent(document, "mouseup", up);
                if (typeof this.releaseCapture != 'undefined') {
                    this.releaseCapture();
                }
            }


        });
    }


}
