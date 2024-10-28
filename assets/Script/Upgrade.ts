import GameManager from "./Manager/GameManger";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Upgrade extends cc.Component {

    @property(cc.Animation)
  anim:cc.Animation=null;
@property(cc.Node)
hand:cc.Node=null;
   

protected update(dt: number): void {
    if(GameManager.instance.skillCount==1){
        this.hand.active=false;
       
        this.anim.stop();
    }
  
}

   
}
