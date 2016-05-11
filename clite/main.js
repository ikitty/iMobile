var alexRand = function (min, max, digit) {
    var r = Math.random()*(max-min) + min ;
    return digit ? Number(r.toFixed(digit)) : (r | 0) ;
};

//master
var Master = cc.Layer.extend({
    ctor: function () {
        this._super();
        var role = cc.Sprite.create("master.png");
        this.addChild(role, 0);

        var weapon = cc.LayerColor.create(cc.color('#0099ff'), 50, 50);
        this.weapon = weapon ;
        this.weapon.setVisible(0);
        weapon.setPosition(-weapon.getContentSize().width/2,0)
        this.addChild(weapon);

        //tipLayer
        var msg = cc.LabelTTF.create("msg", "Arial", 18);
        msg.setPosition(msg.getContentSize().width/2, 150);
        msg.setColor(cc.color('#000000'))
        this.addChild(msg,1);
        this.msg = msg ;

        //this.init();
    }
    ,init: function () {
        var _this = this ;
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            _touchObj: {},
            onTouchesBegan: function(touches, event) {
                var loc = touches[0].getLocation();
                this._touchObj.x1 = loc.x;
                this._touchObj.y1 = loc.y;
            },
            onTouchesMoved: function(touches, event) {
                var loc = touches[0].getLocation();
                this._touchObj.x2 = loc.x;
                this._touchObj.y2 = loc.y;
            },
            onTouchesEnded: function(touches, event){
                if (touches.length <= 0) return;
                var x1 = this._touchObj.x1 , x2 = this._touchObj.x2 ,
                    y1 = this._touchObj.y1 , y2 = this._touchObj.y2 ;

                var dir  = Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 < 0 ? 'Up' : 'Down')
                _this.attack(dir);
            }
        }), this);
    }
    ,attack: function (dir) {
        dir = dir || 'Right' ;
        this.dir  = dir ;
        var dis = {
            Up: cc.p(0,200)
            ,Right: cc.p(200,0)
            ,Down: cc.p(0,-200)
            ,Left: cc.p(-200,0)
        };
        var _this = this ;
        _this.weapon.setVisible(1);
        _this.weapon.stopAllActions();
        this.weapon.runAction(cc.sequence(
            cc.moveBy(1.5, dis[dir]),
            cc.callFunc(function () {
                //-2 means Too Late
                _this.dir = -2; 
                _this.weapon.setVisible(0);
                _this.weapon.setPosition(- _this.weapon.getContentSize().width/2,0);

                this.status = 'done';
            }, this)
        ) ) ;
    }
    ,status: 'ready'
    ,lastStatus: ''
    ,showTips: function () {
        this.msg.setString('我要开始进攻了~')
        this.scheduleOnce(function () {
            this.msg.setString('看招~')
            this.status = 'attack'
        }, 1);

    }
    ,showTaunt: function () {
        this.msg.setString('反应有点慢呢，骚年~')
        this.scheduleOnce(function () {
            this.status = 'ready'
        }, 1);
    }
    ,update: function (dt) {
        if (this.lastStatus === this.status) {
            return  ;
        }
        this.lastStatus = this.status ;

        switch(this.status) {
            case 'ready':
                this.showTips();
                break;
            case 'attack':
                var dirs = ['Up', 'Right', 'Down', 'Left'];
                this.attack(dirs[alexRand(0,4)]);
                break;
            case 'done':
                this.showTaunt();
                break;
            
            default:
                this.showTips();
        }
    }
    ,getAttack: function () {
        return this.dir ;
    }
});

//Fisher means player, just avoid the letter "P"
var Fish = cc.Layer.extend({
    ctor: function () {
        this._super();
        var role = cc.Sprite.create("fish.png");
        this.addChild(role, 0);

        var weapon = cc.LayerColor.create(cc.color('#ff99ff'), 50, 50);
        this.weapon = weapon ;
        this.weapon.setVisible(0);
        weapon.setPosition(-weapon.getContentSize().width/2,0)
        this.addChild(weapon);

        this.init();
    }
    ,init: function () {
        var _this = this ;
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            _touchObj: {},
            onTouchesBegan: function(touches, event) {
                var loc = touches[0].getLocation();
                this._touchObj.x1 = loc.x;
                this._touchObj.y1 = loc.y;
            },
            onTouchesMoved: function(touches, event) {
                var loc = touches[0].getLocation();
                this._touchObj.x2 = loc.x;
                this._touchObj.y2 = loc.y;
            },
            onTouchesEnded: function(touches, event){
                if (touches.length <= 0) return;
                var x1 = this._touchObj.x1 , x2 = this._touchObj.x2 ,
                    y1 = this._touchObj.y1 , y2 = this._touchObj.y2 ;

                var dir  = Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 < 0 ? 'Up' : 'Down')
                _this.attack(dir);
            }
        }), this);
    }
    ,didAttack: 0
    ,attack: function (dir) {
        dir = dir || 'Right' ;
        this.dir = dir ;
        var dis = {
            Up: cc.p(0,100)
            ,Right: cc.p(100,0)
            ,Down: cc.p(0,-100)
            ,Left: cc.p(-100,0)
        };
        this.didAttack = 1;

        var _this = this ;
        _this.weapon.setVisible(1);
        _this.weapon.setPosition(- _this.weapon.getContentSize().width/2,0);
        _this.weapon.stopAllActions();

        this.weapon.runAction(cc.sequence(
            cc.moveBy(1.0, dis[dir]),
            cc.callFunc(function () {
                _this.weapon.setVisible(0);
                _this.weapon.setPosition(- _this.weapon.getContentSize().width/2,0);
                this.didAttack = 0 ;
            }, this)
        ) ) ;
    }
    ,getAttack: function () {
        return this.dir ;
    }
});

var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var size = cc.director.getWinSize();

        //cc.color ~~ new cc.Color
        var bgSpr = cc.Sprite.create('bg.jpg');
        bgSpr.setPosition(size.width/2, size.height/2);
        this.addChild(bgSpr,0);
        //var bg = cc.LayerColor.create(cc.color('#ff9900'), size.width, size.height);
        //this.addChild(bg,0);
        //

        //master
        var master = new Master();
        master.setPosition(size.width/2, size.height/2);
        this.addChild(master, 1 );
        master.schedule(master.update, 1, null, 0.5)


        //blank node
        var calNode = cc.Node.create();
        calNode.update = function () {
            if (fish.didAttack) {
                fish.didAttack = 0 ;
                var masterDir = master.getAttack();
                if (masterDir === -2) {
                    master.msg.setString('太迟了，骚年');
                }else {
                    var fishDir = fish.getAttack();
                    master.msg.setString(masterDir === fishDir? '不错哟' : '方向都分不清吗？');
                }
            }
        }
        calNode.schedule(calNode.update, 0.1);
        this.addChild(calNode,0);

        //fish
        var fish = new Fish();
        fish.setPosition(size.width/2, size.height/4);
        this.addChild(fish, 1 );

        //score
        var scorePaddingTop =  10 ;
        var scorePaddingLeft =  10 ;
        var txtScore = cc.LabelTTF.create("Score: 11", "Arial", 21);
        var txtScoreSize = txtScore.getContentSize() ;
        txtScore.setPosition(txtScoreSize.width/2 + scorePaddingLeft, size.height - txtScoreSize.height/2- scorePaddingTop);
        txtScore.setColor(cc.color('#000000'));
        this.addChild(txtScore, 1);


        //count
        var txtCount = cc.LabelTTF.create("Count: 1", "Arial", 21);
        var txtCountSize = txtCount.getContentSize() ;
        txtCount.setPosition(txtCountSize.width/2 + scorePaddingLeft, size.height - txtCountSize.height - scorePaddingTop*3);
        txtCount.setColor(cc.color('#000000'));
        this.addChild(txtCount, 1);

    }
});

