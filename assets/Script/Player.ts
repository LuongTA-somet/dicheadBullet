import BaseCharacter from "./Base/BaseCharacter";
import Global from "./Base/Global";
import GlobalGamePlay from "./Base/GlobalGamePlay";
import Utility from "./Base/Utility";
import MapController from "./Map/MapController";
import Enemy from "./Enemy";
import PoolBullet from "./Pool/PoolBullet";
import BulletBase from "./Bullets/BulletBase";
import SpawnerFX from "./SpawnerFX";
import Target from "./Map/Target";
import GameManager from "./Manager/GameManger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends BaseCharacter {


    public static Instance: Player;
    // @property(CoinCharacterContain)
    // coinCharacterContain: CoinCharacterContain = null;
    // @property(cc.Node)
    // arrow: cc.Node = null;
    isControllable: boolean = false;
   
    //Shooting
    @property(cc.Node)
    private pointShoot: cc.Node = null;
    @property(cc.Node)
    private pointShoot2: cc.Node = null;
    @property(cc.Node)
    private pointShoot3: cc.Node = null;
    @property(cc.Node)
    private pointShoot4: cc.Node = null;
    @property(cc.Integer)
    private distanceTargetEnemy = 0;
    @property(cc.Node)
    public neoWeapon: cc.Node = null;
    @property(cc.Node)
    public neoWeapon2: cc.Node = null;
    @property(cc.Node)
    public neoWeapon3: cc.Node = null;
    @property(cc.Node)
    public neoWeapon4: cc.Node = null;
    @property(sp.Skeleton)
    public weapon: sp.Skeleton = null;
    @property(sp.Skeleton)
    public weapon2: sp.Skeleton = null;
    @property(sp.Skeleton)
    public weapon3: sp.Skeleton = null;
    @property(sp.Skeleton)
    public weapon4: sp.Skeleton = null;
    @property(cc.Float)
    public delayFireStart: number = 0;
    @property(cc.Float)
    public delayFireTime: number = 0;
    private angleWeapon: number = 90;
    public target: cc.Node = null;
    public idBullet: number = 0;
    public canShoot: boolean = false;
    isIdle: boolean = true;
    public rigid: cc.RigidBody = null;
    constructor() {
        super();
        Player.Instance = this;
    }
    protected start(): void {
        this.rigid = this.node.getComponent(cc.RigidBody);
        this.currentHp=10;
    }
    Init() {
        this.canShoot = true;
        this.isControllable = true;
    }
    protected update(dt: number): void {
        super.update(dt);
        if (Global.isDraggingJoyStick&&!Global.isPause&&!Global.isEndGame) {
            this.MyMove(Global.stickPos);

        }
         if (this.canShoot) {
          
               this.Shooting();
         }
         if (this.rigid != null) {
            // console.log("syncPos");
            this.rigid.syncPosition(true);
        }
    }
   
    MyMove(dir: cc.Vec2) {
        this.AnimationMove();
        //this.ClampPositionPlayer(GlobalGamePlay.Instance(GlobalGamePlay).gameplay.mapController);
        let PosFor = this.node.getPosition();
        PosFor.addSelf(Global.touchPos.mul(this.moveSpeed / 75));
        this.ClampPositionPlayer(PosFor, GlobalGamePlay.Instance(GlobalGamePlay).gameplay.mapController);
        this.UpdateFacing(Utility.VectorTimes(dir, 1));
        
    }

    //ClampPosition
    @property(cc.Integer)
    clampLeftX: number = 0;
    @property(cc.Integer)
    clampRightX: number = 0;
    @property(cc.Integer)
    clampBottomY: number = 0;
    @property(cc.Integer)
    clampTopY: number = 0;
    ClampPositionPlayer(pos: cc.Vec2, mapControllerr: MapController) {
        mapControllerr.lstRectangleObjects.forEach(element => {
            if (element.OnTheLeft(this.node)) {
                pos.x = cc.misc.clampf(pos.x, this.clampLeftX, element.positionLeft.x - 10);
                pos.y = cc.misc.clampf(pos.y, this.clampBottomY, this.clampTopY);
            }
            else if (element.OnTheRight(this.node)) {
                pos.x = cc.misc.clampf(pos.x, element.positionRight.x + 10, this.clampRightX);
                pos.y = cc.misc.clampf(pos.y, this.clampBottomY, this.clampTopY);
            }
            else if (element.OnTheTop(this.node)) {
                pos.x = cc.misc.clampf(pos.x, this.clampLeftX, this.clampRightX);
                pos.y = cc.misc.clampf(pos.y, element.positionTop.y + 10, this.clampTopY);
            }
            else if (element.OnTheBottom(this.node)) {
                pos.x = cc.misc.clampf(pos.x, this.clampLeftX, this.clampRightX);
                pos.y = cc.misc.clampf(pos.y, this.clampBottomY, element.positionBottom.y - 10);
            }
            else {
                pos.x = cc.misc.clampf(pos.x, this.clampLeftX, this.clampRightX);
                pos.y = cc.misc.clampf(pos.y, this.clampBottomY, this.clampTopY);
            }
        });
        this.node.x = pos.x;
        this.node.y = pos.y;
    }
    UpdateTarget() {
        this.GetEnemyTarget(GlobalGamePlay.Instance(GlobalGamePlay).gameplay.enemyParent);
        // this.GetEnemyTarget(GlobalGamePlay.Instance(GlobalGamePlay).gameplay.map);
    }
    GetEnemyTarget(parent: cc.Node) {
        let shortestDistance = 10000;
        let nearestEnemy = null;
        for (let i = 0; i < parent.childrenCount; i++) {
            let distance = Utility.Distance(cc.v2(this.node.x, this.node.y), cc.v2(parent.children[i].x, parent.children[i].y));
            if (distance < shortestDistance && parent.children[i].getComponent(Enemy).isAlive) {
                nearestEnemy = parent.children[i];
                shortestDistance = distance;
            }
            // if (distance < shortestDistance && parent.children[i].getComponent(Target).isAlive) {
            //     nearestEnemy = parent.children[i];
            //     shortestDistance = distance;
            // }
        }
        if (nearestEnemy != null && shortestDistance <= this.distanceTargetEnemy) {
            this.target = nearestEnemy;
        }
        else {
            this.target = null;
        }
        if (parent.childrenCount == 0) {
            this.target = null;
        }
    }
    UpdateAngle() {
        if (this.target == null) {
            this.angleWeapon = 0;
        }
        else if (this.target != null) {
            let pointShootConvertToPlayer = Utility.ConvertPosToHigherParentByNode(this.node, this.pointShoot.parent, this.pointShoot);
            let pointShootConvertToWorld = Utility.ConvertPosToCanvasByVector(this.node, pointShootConvertToPlayer);
            let angle = Utility.BetweenDegree(cc.v2(pointShootConvertToWorld.x, pointShootConvertToWorld.y), cc.v2(this.target.x, this.target.y));
            this.angleWeapon = angle - this.node.angle;
        }
        this.neoWeapon.angle = this.angleWeapon;
        this.neoWeapon2.angle = this.angleWeapon;
        this.neoWeapon3.angle = this.angleWeapon-90;
        this.neoWeapon4.angle = this.angleWeapon-90;
    }
    Shooting() {
        if (Date.now() > this.delayFireStart) {
            this.UpdateTarget();
            this.UpdateAngle();
            if (this.target != null&&Global.isStartGame) {
                this.FireBullet();
                if(GameManager.instance.isUpgrade){
                    if(GameManager.instance.skillNum1!=0){

                     
                        if(GameManager.instance.skillNum1==2){
                            this.FireBullet3();
                        }
                        if(GameManager.instance.skillNum1==3){
                            this.FireBullet2();
                        }
                        if(GameManager.instance.skillNum1==4){
                            this.FireBullet4();
                    }
                    if(GameManager.instance.skillNum2!=0){

                     
                        if(GameManager.instance.skillNum2==2){
                            this.FireBullet3();
                        }
                        if(GameManager.instance.skillNum2==3){
                            this.FireBullet2();
                        }
                        if(GameManager.instance.skillNum2==4){
                            this.FireBullet4();
                    }
                      
                        }}
    
                     }
                    
                   
                     
                
              
              
                this.delayFireStart = Date.now() + this.delayFireTime;
                 cc.audioEngine.playEffect(GlobalGamePlay.Instance(GlobalGamePlay).gameplay.soundManager.Shoot, false);
                //  cc.audioEngine.playEffect(GlobalGamePlay.Instance(GlobalGamePlay).gameplay.soundManager.bazooka, false);
            }
            else {
                if (this.isIdle) {
                    this.isIdle = false;
                    this.weapon.setAnimation(0, "Idle", false);
                    this.weapon2.setAnimation(0, "Idle", false);
                    this.weapon3.setAnimation(0, "Idle", false);
                     this.weapon4.setAnimation(0, "Idle", false);
                }
            }
        }

    }
    FireBullet() {
        var bullet = PoolBullet.Instance(PoolBullet).GetBulletPlayer(0);
        bullet.parent = PoolBullet.Instance(PoolBullet).node;
        bullet.getComponent(BulletBase).InitBullet();
        let pointShootConvertToPlayer = Utility.ConvertPosToHigherParentByNode(this.node, this.pointShoot.parent, this.pointShoot);
        let pointShootConvertToWorld = Utility.ConvertPosToCanvasByVector(this.node, pointShootConvertToPlayer);
        bullet.x = pointShootConvertToWorld.x;
        bullet.y = pointShootConvertToWorld.y;
        let angleToTarget = Utility.BetweenDegree(cc.v2(pointShootConvertToWorld.x, pointShootConvertToWorld.y), cc.v2(this.target.x, this.target.y));
        bullet.angle = angleToTarget - 90;
        // SoundKichBanJackal.Instance.PlayEffectSoundGameRemake(Jackal2Manager.instance.soundManager.soundFireBullet, false);
        this.weapon.setAnimation(0, "Action", false);
       
        this.isIdle = true;
    }
    FireBullet2() {
        var bullet = PoolBullet.Instance(PoolBullet).GetBulletPlayer(1);
        bullet.parent = PoolBullet.Instance(PoolBullet).node;
        bullet.getComponent(BulletBase).InitBullet();
        let pointShootConvertToPlayer = Utility.ConvertPosToHigherParentByNode(this.node, this.pointShoot2.parent, this.pointShoot2);
        let pointShootConvertToWorld = Utility.ConvertPosToCanvasByVector(this.node, pointShootConvertToPlayer);
        bullet.x = pointShootConvertToWorld.x;
        bullet.y = pointShootConvertToWorld.y;
        let angleToTarget = Utility.BetweenDegree(cc.v2(pointShootConvertToWorld.x, pointShootConvertToWorld.y), cc.v2(this.target.x, this.target.y));
        bullet.angle = angleToTarget - 90;
        // SoundKichBanJackal.Instance.PlayEffectSoundGameRemake(Jackal2Manager.instance.soundManager.soundFireBullet, false);
        this.weapon2.setAnimation(0, "Action", false);
        
        this.isIdle = true;
    }
    FireBullet3() {
        var bullet = PoolBullet.Instance(PoolBullet).GetBulletPlayer(2);
        bullet.parent = PoolBullet.Instance(PoolBullet).node;
        bullet.getComponent(BulletBase).InitBullet();
        let pointShootConvertToPlayer = Utility.ConvertPosToHigherParentByNode(this.node, this.pointShoot3.parent, this.pointShoot3);
        let pointShootConvertToWorld = Utility.ConvertPosToCanvasByVector(this.node, pointShootConvertToPlayer);
        bullet.x = pointShootConvertToWorld.x;
        bullet.y = pointShootConvertToWorld.y;
        let angleToTarget = Utility.BetweenDegree(cc.v2(pointShootConvertToWorld.x, pointShootConvertToWorld.y), cc.v2(this.target.x, this.target.y));
        bullet.angle = angleToTarget - 90;
        // SoundKichBanJackal.Instance.PlayEffectSoundGameRemake(Jackal2Manager.instance.soundManager.soundFireBullet, false);
        // this.weapon3.setAnimation(0, "Action", false);
       
        this.isIdle = true;
    }
    FireBullet4() {
        var bullet = PoolBullet.Instance(PoolBullet).GetBulletPlayer(3);
        bullet.parent = PoolBullet.Instance(PoolBullet).node;
        bullet.getComponent(BulletBase).InitBullet();
        let pointShootConvertToPlayer = Utility.ConvertPosToHigherParentByNode(this.node, this.pointShoot4.parent, this.pointShoot4);
        let pointShootConvertToWorld = Utility.ConvertPosToCanvasByVector(this.node, pointShootConvertToPlayer);
        bullet.x = pointShootConvertToWorld.x;
        bullet.y = pointShootConvertToWorld.y;
        let angleToTarget = Utility.BetweenDegree(cc.v2(pointShootConvertToWorld.x, pointShootConvertToWorld.y), cc.v2(this.target.x, this.target.y));
        bullet.angle = angleToTarget - 90;
        // SoundKichBanJackal.Instance.PlayEffectSoundGameRemake(Jackal2Manager.instance.soundManager.soundFireBullet, false);
        // this.weapon4.setAnimation(0, "Action", false);
       
        this.isIdle = true;
    }
    BeingAttacked() {
        this.currentHp -= 0.5;
        if(this.currentHp<=1){
            this.currentHp=1;
        }
        this.hpBar.opacity = 255;
        this.sliderHPBar.fillRange = this.currentHp / (this.hp);
         SpawnerFX.SpawnerFXHitABI(this.node.x, this.node.y, 2);
        if (this.currentHp <= 0) {
            this.hpBar.active = false;
            this.isAlive = false;
            // GlobalGamePlay.Instance(GlobalGamePlay).gameplay.Lose();
            this.node.stopAllActions();
            this.unscheduleAllCallbacks();
            this.animation.play("Die");
            this.weapon.node.active = false;
            this.scheduleOnce(() => {
                this.node.active = false;
            }, 0.6);
        }
    }
    onCollisionEnter(other: cc.Collider): void {
        if (this.isAlive) {
            if (other.node.group == "Enemy") {
                
                var otherBullet: BulletBase = null;
                if (other.node.parent.getComponent(BulletBase)) otherBullet = other.node.parent.getComponent(BulletBase);
                if (other.node.getComponent(BulletBase)) otherBullet = other.node.getComponent(BulletBase);
               this.BeingAttacked() ;
               
            }
            
        }
    }
}
