import KeyEvent from "../Base/KeyEvent";
import GlobalGamePlay, {eventDispatcher} from "../Base/GlobalGamePlay";
import Utility from "../Base/Utility";
const {ccclass, property} = cc._decorator;

@ccclass
export default class Coin extends cc.Component {

    MoveToDestroy() {
        // this.node.runAction(cc.sequence(cc.moveTo(0.2, cc.v2(GlobalGamePlay.Instance(GlobalGamePlay).gameplay.posUpdate1.x, GlobalGamePlay.Instance(GlobalGamePlay).gameplay.posUpdate1.y)), cc.callFunc(() => {
        //     eventDispatcher.emit(KeyEvent.coinMoveDone);
        //     //Utility.PlaySound();
        //     this.node.destroy();
        // })));
         cc.audioEngine.playEffect(GlobalGamePlay.Instance(GlobalGamePlay).gameplay.soundManager.coin, false);
        // this.node.runAction(cc.sequence(cc.jumpTo(0.4, GlobalGamePlay.Instance(GlobalGamePlay).gameplay.currentPosUpdate.node.x, GlobalGamePlay.Instance(GlobalGamePlay).gameplay.currentPosUpdate.node.y, 300, 1), cc.callFunc(() => {
            eventDispatcher.emit(KeyEvent.coinMoveDone);
            Utility.PlaySound;
            this.node.destroy();
        // })));
    }
}
