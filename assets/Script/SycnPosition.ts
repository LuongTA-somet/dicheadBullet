

const {ccclass, property} = cc._decorator;

@ccclass
export default class SyncPosition extends cc.Component {

    public rigid: cc.RigidBody = null;
    start(): void {
        this.rigid = this.node.getComponent(cc.RigidBody);
    }
    update(dt: number) {
        if (this.rigid != null) {
            this.rigid.syncPosition(true);
        }
    }
}
