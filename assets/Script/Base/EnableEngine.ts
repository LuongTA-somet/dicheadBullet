
const {ccclass, property} = cc._decorator;

@ccclass
export default class EnableEngine extends cc.Component {

    onLoad() {
        cc.macro.ENABLE_MULTI_TOUCH = false;
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        // 开启物理步长的设置
        //cc.director.getPhysicsManager().enabledAccumulator = true;

        // 物理步长，默认 FIXED_TIME_STEP 是 1/60
        //cc.PhysicsManager.FIXED_TIME_STEP = 1 / 30;

        // 每次更新物理系统处理速度的迭代次数，默认为 10
        //cc.PhysicsManager.VELOCITY_ITERATIONS = 8;

        // 每次更新物理系统处理位置的迭代次数，默认为 10
        //cc.PhysicsManager.POSITION_ITERATIONS = 8;
    }
}
