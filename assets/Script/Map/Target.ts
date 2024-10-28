import GlobalGamePlay from "../Base/GlobalGamePlay";
import BulletBase from "../Bullets/BulletBase";
import { TypeVFX } from "../Bullets/BulletBase";
import SpawnerFX from "../SpawnerFX";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Target extends cc.Component {

    @property(cc.Node)
    target: cc.Node = null;
    @property(cc.Float)
    hp: number = 0;
public isAlive:boolean=true;
protected start(): void {
    this.isAlive=true;
}
    onCollisionEnter(other: cc.Collider): void {
        if (this.isAlive) {
            if (other.node.group == "PlayerBullet") {
                var otherBullet: BulletBase = null;
                if (other.node.parent.getComponent(BulletBase)) otherBullet = other.node.parent.getComponent(BulletBase);
                if (other.node.getComponent(BulletBase)) otherBullet = other.node.getComponent(BulletBase);
                // if (otherBullet != null) this.KnockedBack(otherBullet.force);
                this.TargetHit(other);
                other.node.destroy();
            }
        }
    }
    TargetHit(other: cc.Collider) {
        var bulletBase = other.node.parent.getComponent(BulletBase);
        this.hp -= bulletBase.damage;
        
       
        if (bulletBase.typeVFX == TypeVFX.HitABI) {
            SpawnerFX.SpawnerFXHitABI(this.node.x, this.node.y, 3.7);
        }
        else if (bulletBase.typeVFX == TypeVFX.ExplosionNormal) {
             cc.audioEngine.playEffect(GlobalGamePlay.Instance(GlobalGamePlay).gameplay.soundManager.bazooka, false);
            SpawnerFX.SpawnerFXExplosionNormal(this.node.x, this.node.y, 3.5);
        }
        if (this.hp <= 0) {
         
             
            this.isAlive = false;
            this.node.stopAllActions();
            this.unscheduleAllCallbacks();
           this.target.active=false;
             cc.audioEngine.playEffect(GlobalGamePlay.Instance(GlobalGamePlay).gameplay.soundManager.enemyDie, false);
            this.scheduleOnce(() => {
                this.node.destroy();
            }, 0.6);
            // this.spawnCoin();
             cc.audioEngine.playEffect(GlobalGamePlay.Instance(GlobalGamePlay).gameplay.soundManager.dropCoin, false);
            // eventDispatcher.emit(KeyEvent.EnemyDie);
        }
    }
}
