
import Global from "./Base/Global";
import GlobalGamePlay from "./Base/GlobalGamePlay";
import Utility from "./Base/Utility";
import GameManager from "./Manager/GameManger";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Joystick extends cc.Component {

    @property(cc.Node)
    private joyRing: cc.Node = null;
    @property(cc.Node)
    private joyDot: cc.Node = null;
    //@property(cc.Node)
    //private joyLight: cc.Node = null;
    private stickPos: cc.Vec2 = null;
    private starTouchLocation: cc.Vec2 = null;
    private touchLocation: cc.Vec2 = null;
    private radius: number = 0;
    private startClick: boolean = false;
    protected start(): void {
        this.InitEvent();
        this.radius = this.joyRing.width / 3;
        this.FadeOutJoyStick();
    }
    InitEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.TouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.TouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.TouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.TouchEnd, this);
    }
    TouchStart(event) {
        if (!Global.isEndGame && !Global.isPause) {
            if (!this.startClick) {
                this.startClick = true;
                // GameManager.instance.SoundManager.BG.play();
                cc.audioEngine.playEffect(GlobalGamePlay.Instance(GlobalGamePlay).gameplay.soundManager.BG, true);
                //GlobalGamePlay.Instance(GlobalGamePlay).gameplay.EventIronSourceClick();
                //GlobalGamePlay.Instance(GlobalGamePlay).gameplay.guideDrag.active = false;
                // GlobalGamePlayDicHead.Instance(GlobalGamePlayDicHead).gameplay.OffTut();
                Global.isStartGame = true;
                // Utility.PlaySound("BG");
               
            }
            // this.node.opacity = 255;
GameManager.instance.Tut.active=false;
            this.starTouchLocation = event.getLocation();
            var mousePosition = event.getLocation();
            let localMousePosition = this.node.convertToNodeSpaceAR(mousePosition);

            //JoyFixed
            // this.stickPos = cc.v2(0, -500);
            // this.joyRing.setPosition(cc.v2(0, -500));
            // this.joyDot.setPosition(this.joyRing.getPosition());

            //JoyFloating
            this.stickPos = localMousePosition;
            this.joyRing.setPosition(localMousePosition);
            this.joyDot.setPosition(localMousePosition);
            this.node.opacity = 255;
            this.touchLocation = event.getLocation();
        }
    }
    TouchMove(event) {
        if (!Global.isEndGame && !Global.isPause) {
            Global.isDraggingJoyStick = true;
            this.touchLocation = event.getLocation();
            if (this.touchLocation === event.getLocation()) {
                return false;
            }
            let touchPos = this.joyRing.convertToNodeSpaceAR(event.getLocation());
            let distance = touchPos.mag();
            let posX = this.stickPos.x + touchPos.x;
            let posY = this.stickPos.y + touchPos.y;
            let p = cc.v2(posX, posY).sub(this.joyRing.getPosition()).normalize();
            Global.touchPos = p;
            if (this.radius > distance) {
                this.joyDot.setPosition(cc.v2(posX, posY));

            } else {
                let x = this.stickPos.x + p.x * this.radius;
                let y = this.stickPos.y + p.y * this.radius;
                this.joyDot.setPosition(cc.v2(x, y));
            }

            // if (this.followingTouch && len > this.boundStick) {
            //     this.touchStart = Utility.VectorsSubs(posStick, Utility.VectorTimes(dir, this.boundStick));
            //     this.jPad.x = this.touchStart.x;
            //     this.jPad.y = this.touchStart.y;
            // }
            this.DirectionJoystick();

            //let degree = Utility.BetweenDegree(cc.v2(this.stickPos.x + p.x * this.radius, this.stickPos.y + p.y * this.radius), cc.v2(this.joyLight.x, this.joyLight.y));
            //this.joyLight.angle = 180 + degree;
        }
    }
    TouchEnd(event) {
        Global.isDraggingJoyStick = false;
        if (!Global.isEndGame && !Global.isPause) {
            this.joyRing.setPosition(cc.v2(0, -500));
            this.joyDot.setPosition(this.joyRing.getPosition());
            //this.joyLight.setPosition(cc.v2(0, -420));
            //this.joyLight.angle = 0;
            this.node.opacity = 0;
            // PlayerDichead.Instance.AnimationIdle();
        }
    }
    FadeOutJoyStick() {
        this.node.opacity = 0;
    }
    DirectionJoystick() {
         Global.stickPos = Utility.VectorsSubs(this.touchLocation, this.starTouchLocation);

    }
}
