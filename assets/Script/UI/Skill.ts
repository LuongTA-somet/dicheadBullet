import GameManager from "../Manager/GameManger";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Skill extends cc.Component {

   @property(cc.Node)
   setChoose:cc.Node=null
  @property(cc.Float)
  type:number=0;
  isChoosen:boolean=false;
public Click(){
   
    if(!this.isChoosen){
        GameManager.instance.skillCount++;
        this.isChoosen=true;
    }
    
    this.setChoose.active=true;
    if(GameManager.instance.skillNum1==0){
        GameManager.instance.skillNum1=this.type;
    }else{
        if(this.type!=GameManager.instance.skillNum1){
            GameManager.instance.skillNum2=this.type;
        }
        
    }
   
}
    
}
