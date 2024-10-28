
import DestroyVFX from "./Base/DestroyVFX";
import GlobalGamePlay from "./Base/GlobalGamePlay";

// import GlobalGamePlayDicHead from "./Base/GlobalGamePlayDicHead";
import PoolManager from "./Pool/PoolManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SpawnerFX extends cc.Component {

    static SpawnerFXHitABI(x: number, y: number, scale: number) {
        var fxHit = PoolManager.Instance(PoolManager).poolFxHit.GetObject();
         fxHit.parent = GlobalGamePlay.Instance(GlobalGamePlay).gameplay.fxParent;
        fxHit.getComponent(cc.Animation).play("HitABI");
        fxHit.getComponent(DestroyVFX).PutObject();
        fxHit.x = x;
        fxHit.y = y;
        fxHit.scaleX = scale;
        fxHit.scaleY = scale;
    }
    static SpawnerFXExplosionNormal(x: number, y: number, scale: number) {
        var fxExplosion = PoolManager.Instance(PoolManager).poolFxExplosionNormal.GetObject();
         fxExplosion.parent = GlobalGamePlay.Instance(GlobalGamePlay).gameplay.fxParent;
        fxExplosion.getComponent(cc.Animation).play("ExplosionNormal");
        fxExplosion.getComponent(DestroyVFX).PutObject();
        fxExplosion.x = x;
        fxExplosion.y = y;
        fxExplosion.scaleX = scale;
        fxExplosion.scaleY = scale;
    }
}
