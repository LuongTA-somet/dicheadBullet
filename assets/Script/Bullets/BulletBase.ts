import PoolBullet from "../Pool/PoolBullet";
import Utility from "../Base/Utility";
import SpawnerFX from "../SpawnerFX";
const { ccclass, property } = cc._decorator;
export enum BulletOf {
    Player = 0,
    Enemy = 1,
}
export enum TypeBullet {
    Normal = 0,
    Stay = 1,
    BulletTargetPoint = 3,
}
export enum TypeVFX {
    HitABI = 0,
    ExplosionNormal = 1,
}
@ccclass
export default class BulletBase extends cc.Component {
    @property({ type: cc.Enum(BulletOf) })
    public bulletOf: BulletOf = BulletOf.Player;
    @property({ type: cc.Enum(TypeBullet) })
    public typeBullet: TypeBullet = TypeBullet.Normal;
    @property({ type: cc.Enum(TypeVFX) })
    public typeVFX: TypeVFX = TypeVFX.ExplosionNormal;
    @property(cc.Integer)
    public idBullet: number = 0;
    @property(cc.Float)
    public fireTime: number = 0;
    @property(cc.Float)
    public speedBullet: number = 0;
    @property(cc.Float)
    public damage: number = 1;
    @property(cc.Float)
    force: number = 0;
    @property(cc.Node)
    public Bullet: cc.Node[] = [];
    @property(cc.Boolean)
    bulletDestroy: boolean = false;
    private arrOriginPosition: cc.Vec2[] = [];
    private arrAngleOrigin: number[] = [];
    public posTarget: cc.Vec2 = cc.Vec2.ZERO;

    //Ricochet
    public chainTimes: number = 2;
    public target: cc.Node = null;
    public oldTargets: cc.Node[] = [];
    InitBullet() {
        for (let i = 0; i < this.Bullet.length; i++) {
            this.arrOriginPosition[i] = this.Bullet[i].getPosition();
            this.arrAngleOrigin[i] = this.Bullet[i].angle;
            if (i == 0)
                this.Moving(this.Bullet[i], i, this.fireTime, 0, 1500);
            else
                this.Moving(this.Bullet[i], i, this.fireTime, -1000, 1500);
        }
    }
    InitBulletRicochet() {
        for (let i = 0; i < this.Bullet.length; i++) {
            this.arrOriginPosition[i] = this.Bullet[i].getPosition();
            this.arrAngleOrigin[i] = this.Bullet[i].angle;
            if (i == 0)
                this.Moving(this.Bullet[i], i, this.fireTime, 0, 1500);
            else
                this.Moving(this.Bullet[i], i, this.fireTime, -1000, 1500);
        }
    }
    Moving(Temp: cc.Node, index: number, firetime: number, x: number, y: number) {
        if (this.typeBullet == TypeBullet.Normal) {
            Temp.runAction(cc.sequence(cc.moveBy(firetime, cc.v2(x * Math.tan(Temp.angle * Math.PI / 180), y)), cc.callFunc(() => {
                if (this.bulletDestroy) {
                    this.node.destroy();
                }
                else {
                    Temp.angle = this.arrAngleOrigin[index];
                    Temp.setPosition(this.arrOriginPosition[index]);
                    if (this.bulletOf == BulletOf.Player)
                        PoolBullet.Instance(PoolBullet).PushBulletPlayer(this.idBullet, this.node);
                    else
                        PoolBullet.Instance(PoolBullet).PushBulletEnemy(this.idBullet, this.node);
                }
            })));
        }
        else if (this.typeBullet == TypeBullet.Stay) {

        }
        else if (this.typeBullet == TypeBullet.BulletTargetPoint) {
            let posConvert = cc.Canvas.instance.node.convertToWorldSpaceAR(this.posTarget);
            posConvert = this.node.convertToNodeSpaceAR(posConvert);
            let timeMoving = Utility.Distance(this.node.getPosition(), this.posTarget) / this.speedBullet;
            Temp.runAction(cc.sequence(cc.moveTo(timeMoving, posConvert), cc.callFunc(() => {
                Temp.angle = this.arrAngleOrigin[index];
                Temp.setPosition(this.arrOriginPosition[index]);
                // SpawnerFX.SpawnerFXExplosionSmall(this.posTarget.x, this.posTarget.y, 1);
                PoolBullet.Instance(PoolBullet).PushBulletEnemy(this.idBullet, this.node);
                //Temp.destroy();
            })));
        }
    }
    SetOriginPosAllBullet() {
        for (let i = 0; i < this.Bullet.length; i++) {
            this.Bullet[i].angle = this.arrAngleOrigin[i];
            this.Bullet[i].setPosition(this.arrOriginPosition[i]);
        }
    }

    //ForBulletRicochet
    public AddOldTarget(newOld: cc.Node) {
        this.oldTargets.push(newOld);
    }

    public SetTarget(newTarget: cc.Node) {
        this.target = newTarget;
    }
    public AddOldTargets(newOlds: cc.Node[]) {
        newOlds.forEach(old => {
            if (!this.CheckOldTarget(old)) this.oldTargets.push(old);
        });
    }
    public CheckOldTarget(target: cc.Node): boolean {
        return (this.oldTargets.indexOf(target) > -1)
    }
    public GetChainTimes(): number {
        return this.chainTimes;
    }
    public SetChainTimes(newTime: number) {
        this.chainTimes = newTime;
    }
    LookAtTarget() {
        if (this.target && this.target.active) {
            let degree = Utility.BetweenDegree(cc.v2(this.node.position.x, this.node.position.y), cc.v2(this.target.position.x, this.target.position.y));
            this.node.angle = degree;
        }
    }
}
