//player
var player = cc.Layer.extend({
    ctor: function () {
        this._super();
        var bg = cc.LayerColor.create(cc.color('#009900'), 100, 100);
        this.addChild(bg,0);
    }
    ,attack: function () {
        cc.log('attack')
    }
});

var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var size = cc.director.getWinSize();

        var p = new player();
        p.setPosition(0, 200);
        this.addChild(p, 3 );
        p.attack();


        //cc.color ~~ new cc.Color
        var bg = cc.LayerColor.create(cc.color('#ff9900'), size.width, size.height);
        this.addChild(bg,0);

        var label = cc.LabelTTF.create("Hello ", "Arial", 40);
        label.setPosition(size.width / 2, size.height / 3);
        this.addChild(label, 1);

        //score
        var scorePaddingTop =  10 ;
        var txtScore = cc.LabelTTF.create("Score: 11", "Arial", 20);
        var txtScoreSize = txtScore.getContentSize() ;
        txtScore.setPosition(txtScoreSize.width/2, size.height - txtScoreSize.height/2- scorePaddingTop);
        this.addChild(txtScore, 1);


        //count
        var txtCount = cc.LabelTTF.create("Count: 1", "Arial", 20);
        var txtCountSize = txtCount.getContentSize() ;
        txtCount.setPosition(txtCountSize.width/2, size.height - txtCountSize.height - scorePaddingTop*2);
        this.addChild(txtCount, 1);

        var coach = cc.Sprite.create("coach.png");
        coach.setPosition(size.width/2, size.height/2);
        this.addChild(coach,2);
    }
});

