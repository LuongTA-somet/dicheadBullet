import GlobalGamePlay, { eventDispatcher } from "./Base/GlobalGamePlay";
import KeyEvent from "./Base/KeyEvent";
import Player from "./Player";
import Utility from "./Base/Utility";
import BaseCharacter from "./Base/BaseCharacter";
import Global from "./Base/Global";
import GateController from "./GateController";
import SpawnerFX from "./SpawnerFX";
import BulletBase, { TypeVFX } from "./Bullets/BulletBase";
import GameManager from "./Manager/GameManger";
import PoolBullet from "./Pool/PoolBullet";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Enemy extends BaseCharacter {

    public startChase: boolean = false;
    public target: cc.Node = null;
    public isStunned: boolean = false;
    private oldPosition: cc.Vec2 = null;
    public lastY: number = 0;
    public isDead:boolean=false;
    @property(cc.Node)
    player: cc.Node = null;
    @property(cc.Prefab)
    prefabCoin: cc.Prefab = null;
    //Shooting

    @property(cc.Float)
    public delayFireStart: number = 0;
    @property(cc.Float)
    public delayFireTime: number = 0;
    @property(cc.Float)
    public speed: number = 0;
    @property(cc.Float)
    public minDis: number = 0;
    // @property(cc.PhysicsCircleCollider)
    // collider: cc.PhysicsCircleCollider = null;
    // @property(cc.RigidBody)
    // rigidBody: cc.RigidBody = null;
    protected onEnable(): void {
        eventDispatcher.on(KeyEvent.gateBroken, this.updateTarget, this);
    }
    protected onDisable(): void {
        eventDispatcher.off(KeyEvent.gateBroken, this.updateTarget, this);
    }
protected start(): void {
    // this.rigidBody = this.node.getComponent(cc.RigidBody);
    this.currentHp=3;
}
    public Init(target: cc.Node) {
        this.target = target;
        this.startChase = true;
        this.lastY = this.node.y;
    }
    protected update(dt: number): void {
        super.update(dt);
        this.Chasing(dt);
        // this.rigidBody.syncPosition(true);
        if(Global.isStartGame)
        this.Move(dt);
        // if (this.rigidBody != null) {
        //     this.rigidBody.syncPosition(true);
        // }
    }
    onCollisionEnter(other: cc.Collider): void {
        if (this.isAlive) {
            if (other.node.group == "PlayerBullet") {
                var otherBullet: BulletBase = null;
                if (other.node.parent.getComponent(BulletBase)) otherBullet = other.node.parent.getComponent(BulletBase);
                if (other.node.getComponent(BulletBase)) otherBullet = other.node.getComponent(BulletBase);
                // if (otherBullet != null) this.KnockedBack(otherBullet.force);
                this.EnemyHit(other);
                other.node.destroy();
            }
            if (other.node.group == "Shield") {
                this.currentHp -=7;
                this.hpBar.active = true;
                this.sliderHPBar.fillRange = this.currentHp / (this.hp);
                this.Dead();
            }
            // if (other.node.name == "Sword") {
            //     this.currentHp -=2;
            //     this.hpBar.active = true;
            //     this.sliderHPBar.fillRange = this.currentHp / (this.hp);
            //     this.Dead();
            // }
        }
    }
    EnemyHit(other: cc.Collider) {
       
        var bulletBase = other.node.parent.getComponent(BulletBase);
        this.currentHp -= bulletBase.damage;
        this.hpBar.active = true;
        this.sliderHPBar.fillRange = this.currentHp / (this.hp);
        if (bulletBase.typeVFX == TypeVFX.HitABI) {
            SpawnerFX.SpawnerFXHitABI(this.node.x, this.node.y, 3.7);
        }
        else if (bulletBase.typeVFX == TypeVFX.ExplosionNormal) {
            //  cc.audioEngine.playEffect(GlobalGamePlay.Instance(GlobalGamePlay).gameplay.soundManager.bazooka, false);
            SpawnerFX.SpawnerFXExplosionNormal(this.node.x, this.node.y, 3.5);
        }
       this.Dead();
    }
    Dead(){
        if (this.currentHp <= 0) {
            if(!this.isDead){
                GameManager.instance.enemyDieCount++;
                this.isDead=true;
            }
            GameManager.instance.curProgression+=2;
               this.hpBar.active = false;
            this.isAlive = false;
            this.node.stopAllActions();
            this.unscheduleAllCallbacks();
            this.animation.play("Die");
             cc.audioEngine.playEffect(GlobalGamePlay.Instance(GlobalGamePlay).gameplay.soundManager.enemyDie, false);
            this.scheduleOnce(() => {
                this.node.destroy();
            }, 0.6);
             this.spawnCoin();
            //  cc.audioEngine.playEffect(GlobalGamePlay.Instance(GlobalGamePlay).gameplay.soundManager.dropCoin, false);
            eventDispatcher.emit(KeyEvent.EnemyDie);
        }


    }
    private maxDist: number = 250;
    private minDist: number = 200;
    Chasing(dt: number) {
        if (!this.startChase || !this.isAlive || Global.isPause || this.isStunned || Global.isEndGame)
            return;
        if (this.target == null)
            return;
        if (this.target == Player.Instance.node) {
            if (!Player.Instance.isAlive) {
                return;
            }
        }

        if (Utility.Distance(this.node.getPosition(), this.target.getPosition()) >= this.minDist) {
            this.oldPosition = cc.v2(this.node.x, this.node.y);
            let dir = cc.v2(this.target.position.x - this.node.position.x, this.target.position.y - this.node.position.y).normalize();
            let vectorMove = cc.v2(dir.x * this.moveSpeed * dt, dir.y * this.moveSpeed * dt);
            this.node.x += vectorMove.x;
            this.node.y += vectorMove.y;
            this.UpdateFacing(vectorMove);
           
        }
        if (Utility.Distance(this.node.getPosition(), this.target.getPosition()) <= this.maxDist) {
            this.Shooting();
        }
    }
    Shooting() {
        if (this.target != null) {
            if (Date.now() > this.delayFireStart) {
                if (this.target.name == "Player") {
                    this.AttackPlayer();
                   // this.FireBullet();
                }
                else {
                    this.AttackGate();
                }
                this.delayFireStart = Date.now() + this.delayFireTime;
            }
        }
    }
    
    AttackPlayer() {
        Player.Instance.BeingAttacked();
    }
    AttackGate() {
        this.target.getComponent(GateController).BeingAttacked();
    }

    Move(dt: number) {
      
       
        let enemyPos = this.node.position;
        let playerPos = this.player.position;
        let directionToPlayer = playerPos.sub(enemyPos).normalize();


        if (this.Distance(playerPos, enemyPos) < this.minDis) {
            let moveStep = directionToPlayer.mul(this.speed * dt);
            this.node.position = enemyPos.add(moveStep);
        }

        if (directionToPlayer.x > 0) {
            this.spritesParent.scaleX = -Math.abs(this.node.scaleX);
            
        } else {
            this.spritesParent.scaleX = Math.abs(this.node.scaleX);
           
        }
    }

    updateTarget(target: any) {
        if (this.target == target) {
            this.target = Player.Instance.node;
        }
    }
    spawnCoin() {
        var coin = cc.instantiate(this.prefabCoin);
        coin.setPosition(this.node.x, this.node.y - 20);
    }
    Distance(vec1: cc.Vec3, vec2: cc.Vec3): number {
        return Math.sqrt(Math.pow(vec1.x - vec2.x, 2) + Math.pow(vec1.y - vec2.y, 2));
    }
}
