import PoolManager from "../Pool/PoolManager";



const { ccclass, property } = cc._decorator;
export enum TypeDestroy {
    Destroy = 0,
    PutPool = 1,
}
@ccclass
export default class DestroyVFX extends cc.Component {
    @property({ type: cc.Enum(TypeDestroy) })
    public typeDestroy: TypeDestroy = TypeDestroy.Destroy;
    @property(cc.Float)
    timming: number = 1;
    PutObject() {
        this.scheduleOnce(() => {
            if (this.typeDestroy == TypeDestroy.Destroy) {
                this.node.destroy();
            }
            else {
                if (this.node.name == "HitABI") {
                    PoolManager.Instance(PoolManager).poolFxHit.PutObject(this.node);
                }
                else if (this.node.name == "ExplosionNormal") {
                    PoolManager.Instance(PoolManager).poolFxExplosionNormal.PutObject(this.node);
                }

            }
        }, this.timming);
    }
}
