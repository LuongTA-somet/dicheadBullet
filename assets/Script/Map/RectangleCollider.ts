const { ccclass, property } = cc._decorator;

@ccclass
export default class RectangleController extends cc.Component {
    @property(cc.Float)
    width: number = 0;
    @property(cc.Float)
    high: number = 0;
    public positionLeft: cc.Vec2 = null;
    public positionRight: cc.Vec2 = null;
    public positionTop: cc.Vec2 = null;
    public positionBottom: cc.Vec2 = null;

    start() {
        this.positionLeft = new cc.Vec2(this.node.x - this.width, this.node.y);
        this.positionRight = new cc.Vec2(this.node.x + this.width, this.node.y);
        this.positionTop = new cc.Vec2(this.node.x, this.node.y + this.high);
        this.positionBottom = new cc.Vec2(this.node.x, this.node.y - this.high);
    }
    update() {
        this.positionLeft = new cc.Vec2(this.node.x - this.width, this.node.y);
        this.positionRight = new cc.Vec2(this.node.x + this.width, this.node.y);
        this.positionTop = new cc.Vec2(this.node.x, this.node.y + this.high);
        this.positionBottom = new cc.Vec2(this.node.x, this.node.y - this.high);
    }
    public OnTheLeft(player: cc.Node): Boolean {
        if (player.x < this.positionLeft.x && player.y < this.positionTop.y && player.y > this.positionBottom.y)
            return true;
        else
            return false;
    }

    public OnTheRight(player: cc.Node): Boolean {
        if (player.x > this.positionRight.x && player.y < this.positionTop.y && player.y > this.positionBottom.y)
            return true;
        else
            return false;
    }

    public OnTheTop(player: cc.Node): Boolean {
        if (player.y > this.positionTop.y && player.x < this.positionRight.x && player.x > this.positionLeft.x)
            return true;
        else
            return false;
    }

    public OnTheBottom(player: cc.Node): Boolean {
        if (player.y < this.positionBottom.y && player.x < this.positionRight.x && player.x > this.positionLeft.x)
            return true;
        else
            return false;
    }
}
