import {FacingType, TypeCharacter } from "./EnumDefine";
import Utility from "./Utility";
 TypeCharacter
Utility

const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseCharacter extends cc.Component {
    @property(cc.Integer)
    hp: number = 0;
    currentHp: number = 0;
    @property(cc.Node)
    hpBar: cc.Node = null;
    @property(cc.Sprite)
    sliderHPBar: cc.Sprite = null;
    @property(cc.Node)
    spritesParent: cc.Node = null;
    //Movement
    @property(cc.Animation)
    animation: cc.Animation = null;
    @property(cc.String)
    strIdle: string = "Idle";
    @property(cc.String)
    strMove: string = "Move";
    @property(cc.String)
    strDie: string = "Die";
    @property(cc.Boolean)
    defaultFaceLeft: boolean = true;
    @property(cc.Float)
    moveSpeed: number = 0;
    @property({ type: cc.Enum(TypeCharacter) })
    typeCharacter: TypeCharacter = TypeCharacter.Enemy;
    @property({ type: cc.Enum(FacingType) })
    facingType: FacingType = FacingType.Scale;
    dt: number = 1;
    public isAlive: boolean = true;
    protected start(): void {
        this.currentHp = this.hp;
    }
    protected update(dt: number): void {
        this.dt = dt;
        
    }
  
    UpdateFacing(dir: cc.Vec2) {
        if (this.facingType == FacingType.Scale) {
            var prefixA = this.defaultFaceLeft ? 1 : -1;
            var prefixB = dir.x <= 0 ? 1 : -1;
            this.spritesParent.scaleX = prefixA * prefixB;
            
        }
        if (this.facingType == FacingType.Angle) {
            this.spritesParent.angle = Utility.BetweenDegree(dir);
        }
      
    }
    // UpdateFacingTowards(target: cc.Vec2) {
    //     if (this.facingType == FacingType.Scale) {
    //         var prefixA = this.defaultFaceLeft ? 1 : -1;
    //         var prefixB = target.x <= this.node.x ? 1 : -1;
    //         this.spritesParent.scaleX = prefixA * prefixB;
    //     }
    //     if (this.facingType == FacingType.Angle) {
    //         this.spritesParent.angle = Utility.BetweenDegree(Utility.VectorsSubs(target, this.node.getPosition()));
    //     }
    // }
    isAnimIdle: boolean = false;
    isAnimMove: boolean = false;
    AnimationIdle() {
        if (!this.isAnimIdle) {
            this.isAnimIdle = true;
            this.isAnimMove = false
            this.animation.play(this.strIdle);
        }
    }
    AnimationMove() {
        if (!this.isAnimMove) {
            this.isAnimMove = true;
            this.isAnimIdle = false;
            this.animation.play(this.strMove);
        }
    }
}
