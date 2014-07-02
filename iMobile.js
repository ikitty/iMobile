/**
 * iMobile , 帮你的移动端页面兼容多种分辨率的小助手
 *
 **/

var iMobile = {
    ua: navigator.userAgent.toLowerCase()

    ,isMobile: function () {
        return (/android|webos|iphone|ipod|blackberry|ieiMobile|opera mini/i.test(this.ua)) ;
    }

    ,init: function (orgWidth, elScale) {
        if (!this.isMobile()) {
            return  ;
        }
        var me = this;
        me.orgWidth = orgWidth || 640 ;
        me.elScale = elScale || (document.body) ;

        document.addEventListener('DOMContentLoaded', function () {
            document.removeEventListener('DOMContentLoaded',arguments.callee,false);
            me.adaptDevice();
        }, false);

        var stResize;
        window.addEventListener('orientationchange', function (e) {
            stResize && clearTimeout(stResize);
            stResize = setTimeout(function () {
                me.adaptDevice();
            }, 50);
        },false);
    }
    ,adaptDevice: function () {
        var gWidth=document.documentElement.clientWidth,
            ratio = (gWidth/this.orgWidth).toFixed(3);
           
        // firefox for Android doesnot support target-densitydpi, Damn!
        if (/Gecko\/\d+/gi.test(this.ua)) {
            this.elScale.style.webkitTransform = 'scale(' + ratio + ')';
        }else {
            this.setDpi();
        }
    }

    ,setDpi: function () {
        var st = {
            'uWidth': this.orgWidth ,
            'dWidth': window.screen.width || window.screen.availWidth || 0,
            'ratio': window.devicePixelRatio || 1 ,
            'mode': 'apple',
            'userAgent': navigator.userAgent
        };

        function checkVersion() {
            var isAndroid = st.userAgent.match(/Android/i);
            if(isAndroid) {
                st.mode = 'android-2.2';
                var version = st.userAgent.match(/Android\s(\d+.\d+)/i);
                if(version) {
                    version = parseFloat(version[1]);
                }

                if (version == 2.2 || version == 2.3) {
                    st.mode = 'android-2.2';
                } else if (version < 4.4) {
                    st.mode = 'android-dpi';
                } else if (version >= 4.4) {
                    if (st.dWidth > st.uWidth) {
                        st.mode = 'android-dpi';
                    } else {
                        st.mode = 'android-scale';
                    }
                }
            } 
        };

        function initViewport() {
            var initial = '';
            var isFix2_2 = false;
            switch(st.mode) {
                case 'apple':
                    initial = 'width='+ st.uWidth + ', user-scalable=no';
                    break;

                case 'android-2.2':
                    if(!param.dWidth) {
                        if(st.ratio == 2) {
                            st.dWidth = 720;
                        } 
                        else if(st.ratio == 1.5) {
                            st.dWidth = 480;
                        } 
                        else if(st.ratio == 1) {
                            st.dWidth = 320;
                        } 
                        else if(st.ratio == 0.75) {
                            st.dWidth = 240;
                        } 
                        else {
                            st.dWidth = 480;
                        }
                    }  

                    // 假若能正确获取浏览器窗口分辨率则不用处理
                    var dWidth = window.screen.width || window.screen.availWidth;
                    if( dWidth == 320) {
                        st.dWidth = st.ratio * dWidth;
                    } else if(dWidth < 640) {
                        st.dWidth = dWidth;
                    }

                    st.mode = 'android-dpi';
                    isFix2_2 = true;

                case 'android-dpi':
                    var dpi = st.uWidth / st.dWidth * st.ratio * 160;
                    initial = 'target-densitydpi=' + dpi + ', width=' + st.uWidth + ", user-scalable=no";
                    if(isFix2_2) { st.mode = 'android-2.2'; }
                    break;

                case 'android-scale':
                    var dpi = st.uWidth / st.dWidth * st.ratio * 160;
                    initial = 'target-densitydpi=' + dpi + ', width=' + st.uWidth + ", user-scalable=no";
                    // initial = 'width='+ st.uWidth + ', user-scalable=no';
                    break;
            }

            var viewport = document.querySelector("meta[name='viewport']") || document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = initial;
            if (!document.querySelector("meta[name='viewport']")) {
                document.getElementsByTagName('head').appendChild(viewport) ;
            }
        };

        checkVersion();
        initViewport();
    }
};

/**
 * init method
 *
 * @param {String} orgWidth 可选项，原始页面宽度，默认是640
 * @param {String} elScale 可选项，用于缩放的容器，默认是document.body
 **/
iMobile.init(640);
