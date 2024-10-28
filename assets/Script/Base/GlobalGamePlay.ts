import GameManager from "../Manager/GameManger";
import Singleton from "./Singleton";

const {ccclass, property} = cc._decorator;
export const eventDispatcher =new cc.EventTarget();
@ccclass
export default class GlobalGamePlay extends Singleton<GlobalGamePlay>{

   gameplay:GameManager =GameManager.Instance(GameManager);
   constructor(){
    super();
    GlobalGamePlay.instance=this;
   }
}
