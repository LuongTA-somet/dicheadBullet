const { ccclass, property } = cc._decorator;

@ccclass("BasePool")
export default class BasePool {

    private pool: cc.NodePool;
    @property(cc.Prefab)
    Prefab: cc.Prefab = null;
    @property(cc.Boolean)
    public reuse: boolean = true;
    @property(cc.Integer)
    public Size: number = 0;

    constructor() {
        this.pool = new cc.NodePool();
        //Khong can biet chinh xac so luong nut ban dau ta se sinh ra cac nut neu bi thieu trong thoi gian chay
        // for (let i = 0; i < this.Size; ++i) {
        //     let obj = cc.instantiate(this.Prefab); // create node instance
        //     this.pool.put(obj); // populate your pool with put method
        // }
    }
    GetObject(): cc.Node {
        if (this.reuse) {
            let obj: cc.Node = null;
            if (this.pool.size() > 0) {
                obj = this.pool.get();
                obj.active = true;
            } else {
                obj = cc.instantiate(this.Prefab);
            }
            return obj;
        } else {
            let obj: cc.Node = cc.instantiate(this.Prefab);
            return obj;
        }
    }
    PutObject(obj: cc.Node) {
        if (this.reuse) {
            this.pool.put(obj);
            obj.active = false;
        } else {
            obj.destroy();
        }
    }
    ClearPool() {
        this.pool.clear();
    }

}