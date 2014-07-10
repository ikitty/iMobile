iMobile
=======

A helper make your webpage adapt various of mobile phone automatically, enjoy it ! 

###如何使用

- 基于设计稿尺寸在PC端做好页面
- 引入iMoible.js即可
- 如果要兼容firefoxMobile，请给bodoy设置如下样式(它不支持target-densitydpi，所以只能使用scale缩放了)：

    body {position:absolute;left:0px;top:0px;width:100%;height:2000px;overflow:hidden;-webkit-transform-origin:0 0;}

###原理

动态调整viewport属性值来让页面自动适应各分辨率的设备

- 对于Apple机器，直接设置合适的width
- 对于Android机器，设置target-densitydpi
