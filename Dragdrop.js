var Dragdrop = function (evt) {
    "use strict";
    var elem        = null,
        started     = 0,
        self        = this,
        moveHandler = null,
        gWidth      = (document.body.scrollWidth > document.documentElement.clientWidth)
                      ? document.body.scrollWidth
                      : document.documentElement.clientWidth,
        gHeight     = (document.body.scrollHeight > document.documentElement.clientHeight)
                      ? document.body.scrollHeight
                      : document.documentElement.clientHeight,
        move        = function (e) {
            var xDiff   = e.clientX - elem.posX,
                yDiff   = e.clientY - elem.posY,
                x       = xDiff - (xDiff % elem.snap) + 'px',
                y       = yDiff - (yDiff % elem.snap) + 'px';

            if (started === 1) {
                switch (elem.mode) {
                case 0:
                    elem.style.top = y;
                    elem.style.left = x;
                    break;
                case 1:
                    elem.style.left = x;
                    break;
                case 2:
                    elem.style.top = y;
                    break;
                }

                if (elem.mode !== 2) {
                    if (xDiff <= elem.minX) {
                        elem.style.left = elem.minX + 'px';
                    }

                    if (elem.offsetLeft + elem.offsetWidth >= elem.maxX) {
                        elem.style.left = (elem.maxX - elem.offsetWidth) + 'px';
                    }
                }

                if (elem.mode !== 1) {
                    if (yDiff <= elem.minY) {
                        elem.style.top = elem.minY + 'px';
                    }

                    if (elem.offsetTop + elem.offsetHeight >= elem.maxY) {
                        elem.style.top = (elem.maxY - elem.offsetHeight) + 'px';
                    }
                }

                elem.onMove(elem);
            }
        },
        start       = function (e, src) {
            if (src.className.indexOf('draggable') !== -1) {

                evt.prevent(e);

                moveHandler = evt.attach('mousemove', document, move, true);
                started = 1;

                elem = src;
                elem.posX = e.clientX - elem.offsetLeft;
                elem.posY = e.clientY - elem.offsetTop;

                if (elem.mode === undefined) {
                    self.set(elem);
                }

                elem.onStart(elem);

                if (elem.setCapture) {
                    elem.setCapture();
                }
            }
        },
        stop        = function () {
            if (started === 1) {
                started = 0;
                elem.onStop(elem);
                evt.detach('mousemove', document, moveHandler);

                if (elem.releaseCapture) {
                    elem.releaseCapture();
                }
            }
        };

    evt.attach('mousedown', document, start, false);
    evt.attach('mouseup', document, stop, false);

    this.set = function (element, elemOptions) {
        var options = elemOptions       || {};

        elem = (typeof element === 'string')
                ? document.getElementById(element)
                : element;

        elem.mode           = options.mode      || 0;
        elem.minX           = options.minX      || 0;
        elem.maxX           = options.maxX      || gWidth;
        elem.minY           = options.minY      || 0;
        elem.maxY           = options.maxY      || gHeight;
        elem.snap           = options.snap      || 1;
        elem.onStart        = options.onstart   || function () {};
        elem.onMove         = options.onmove    || function () {};
        elem.onStop         = options.onstop    || function () {};

        elem.style.left     = elem.offsetLeft + 'px';
        elem.style.top      = elem.offsetTop + 'px';

        elem.unselectable   = 'on';
    };
};