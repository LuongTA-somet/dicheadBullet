import BasePool from "./BasePool";
import Singleton from "../Base/Singleton";
const { ccclass, property } = cc._decorator;
@ccclass
export default class PoolManager extends Singleton<PoolManager> {
    @property(BasePool)
    public poolFxHit: BasePool = null;
    @property(BasePool)
    public poolFxExplosionNormal: BasePool = null;
    constructor() {
        super();
        PoolManager.instance = this;
    }
}
