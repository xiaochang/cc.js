/**
 * User : YuanChang<Yuan-Chang@qq.com>
 * Date : 2015/5/12.
 * Time : 15:31
 */
TC.prototype.extend("drag", drag);
function drag(obj) {
    /**
     * ��ק����:
     * 1.������꿪ʼ�����ƶ�
     * 2.�ƶ���꿪ʼ�ƶ�
     * 3.̧���������ƶ�
     */

    this.bind("mousedown", function (e) {
        if(obj.start)obj.start();
        $("body").css("overflow", "hidden");
        var diffX = e.clientX - this.offsetLeft,
            diffY = e.clientY - this.offsetTop,
            objWidth = this.offsetWidth,
            objHeight = this.offsetHeight,
            clientSize = TC.prototype.clientSize();

        function move(e) {
            var e = TC.prototype.eFit(e),
                left = e.clientX - diffX,
                top = e.clientY - diffY;
            if(!$(this).html()){
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
            $(this).css("left", left + "px").css("top", top + "px");
            if (typeof this.setCapture != 'undefined') {
                this.setCapture();
            }
        }

        function up() {
            if(obj.end)obj.end();
            TC.prototype.rmEvent(this, "mousemove", move);
            TC.prototype.rmEvent(this, "mouseup", up);
            if (typeof this.releaseCapture != 'undefined') {
                this.releaseCapture();
            }
            $("body").css("overflow", "auto");
        }

        TC.prototype.addEvent(this, "mousemove", move);
        TC.prototype.addEvent(this, "mouseup", up);
    });

}
