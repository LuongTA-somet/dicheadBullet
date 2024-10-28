import Singleton from "../Base/Singleton";
import BasePool from "./BasePool";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PoolBullet extends Singleton<PoolBullet> {
    @property([BasePool])
    public poolBulletPlayer: BasePool[] = [];
    @property([BasePool])
    public poolBulletEnemy: BasePool[] = [];
    constructor() {
        super();
        PoolBullet.instance = this;
    }

    GetBulletPlayer(id: number): cc.Node {
        let obj = null;
        for (let i = 0; i < this.poolBulletPlayer.length; ++i) {
            if (id == i) {
                obj = this.poolBulletPlayer[i].GetObject();
            }

        }
        return obj;
    }
    PushBulletPlayer(id: number, obj: cc.Node) {
        this.poolBulletPlayer[id].PutObject(obj);
    }
    GetBulletEnemy(id: number): cc.Node {
        let obj = null;
        for (let i = 0; i < this.poolBulletEnemy.length; ++i) {
            if (id == i) {
                obj = this.poolBulletEnemy[i].GetObject();
            }

        }
        return obj;
    }
    PushBulletEnemy(id: number, obj: cc.Node) {
        this.poolBulletEnemy[id].PutObject(obj);
    }
}
