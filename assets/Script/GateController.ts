
import GlobalGamePlay, {eventDispatcher} from "./Base/GlobalGamePlay";
import KeyEvent from "./Base/KeyEvent";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GateController extends cc.Component {
    @property(cc.Integer)
    hp: number = 0;
    @property([cc.Node])
    arrSprite: cc.Node[] = [];
    currentHP: number = 0;
    isAlive: boolean = false;
    @property(cc.PhysicsBoxCollider)
    collider: cc.PhysicsBoxCollider = null;
    @property(cc.RigidBody)
    rigidBody: cc.RigidBody = null;
    protected start(): void {
        this.currentHP = this.hp;
        this.isAlive = true;
    }
    protected update(dt: number): void {
        this.rigidBody.syncPosition(true);
    }
    BeingAttacked() {
        this.currentHP -= 1;
        this.unschedule(this.SchedulePow);
        for (let i = 0; i < this.arrSprite.length; i++) {
            this.arrSprite[i].color = cc.color(255, 0, 0, 255);
        }
        this.scheduleOnce(this.SchedulePow, 0.1);
        if (this.currentHP == this.hp * 3 / 4) {
            this.arrSprite[0].stopAllActions();
            this.arrSprite[0].runAction(cc.sequence(cc.jumpBy(0.4, this.arrSprite[0].x + 250, this.arrSprite[0].y - 200, 300, 1), cc.callFunc(() => {
                //Utility.PlaySound();
                this.arrSprite[0].active = false;
            })));
        }
        if (this.currentHP == this.hp * 2 / 4) {
            this.arrSprite[1].stopAllActions();
            this.arrSprite[1].runAction(cc.sequence(cc.jumpBy(0.4, this.arrSprite[1].x - 250, this.arrSprite[1].y - 50, 300, 1), cc.callFunc(() => {
                //Utility.PlaySound();
                this.arrSprite[1].active = false;
            })));
        }
        if (this.currentHP == this.hp * 1 / 4) {
            this.arrSprite[2].stopAllActions();
            this.arrSprite[2].runAction(cc.sequence(cc.jumpBy(0.4, this.arrSprite[2].x + 250, this.arrSprite[2].y - 50, 300, 1), cc.callFunc(() => {
                //Utility.PlaySound();
                this.arrSprite[2].active = false;
            })));
        }
        if (this.currentHP <= 0) {
            this.arrSprite[3].stopAllActions();
            this.arrSprite[3].runAction(cc.sequence(cc.jumpBy(0.4, this.arrSprite[3].x - 250, this.arrSprite[3].y - 50, 300, 1), cc.callFunc(() => {
                //Utility.PlaySound();
                this.arrSprite[3].active = false;
            })));
            this.isAlive = false;
            this.collider.enabled = false;
            eventDispatcher.emit(KeyEvent.gateBroken, this.node);
        }
    }
    SchedulePow(): Function {
        for (let i = 0; i < this.arrSprite.length; i++) {
            this.arrSprite[i].color = cc.color(255, 255, 255, 255);
        }
        return;
    }
}
