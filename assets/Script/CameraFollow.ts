import Global from "./Base/Global";
import Singleton from "./Base/Singleton";

import GameManager from "./Manager/GameManger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CameraFollow extends Singleton<CameraFollow> {
    @property(cc.Camera)
    camera: cc.Camera = null;

    @property(cc.Node)
    obj: cc.Node = null;
    @property(cc.Vec2)
    offset: cc.Vec2 = cc.v2(0, 0);
    following: boolean = false;
    constructor() {
        super();
        CameraFollow.instance = this;
    }
    protected start(): void {
        this.node.position=  cc.v3(0,8000);
       // this.following = true;
      //  this.offset = cc.v2(this.node.position.x - this.obj.position.x, this.node.position.y - this.obj.position.y);
       // this.StartCamDemo();
        this.StartGamePos(3);
        this.scheduleOnce(()=>{
            // this.following = true;
         
            Global.isPause=false;
            // GameManager.instance.joystick.active=true;
            GameManager.instance.joystick.TOUCH_END;
            GameManager.instance.Tut.active=true;
        },4);
        this.scheduleOnce(()=>{
            this.following = true;
        },5);
    }
    update(dt: number) {
        if (!Global.isEndGame) {
            if (this.following && this.obj != null) {
                this.SetInstantPos(dt);
            }
        }
    }
    flag:boolean=false;
    SetInstantPos(dt: number) {
        if(!this.flag){
            this.node.position=  cc.v3(0,0);
            this.flag=true;
        }
       
         this.node.x = cc.misc.lerp(this.node.x, this.obj.x + this.offset.x, 0.1);
        // this.node.x = cc.misc.lerp(this.obj.x, this.obj.x + this.offset.x, 0.1);
        let posY = cc.misc.clampf(this.obj.y + this.offset.y, -31000, 31000);
        this.node.y = cc.misc.lerp(this.node.y, posY, 0.1);

    }


    StartGamePos(dt: number) {
    
        this.scheduleOnce(()=>{
            setTimeout(() => {

                cc.tween(this.camera)
                    .to(1,  { zoomRatio: 0.8 }, { easing: 'sineOut' })
                   
                    .call(() => {
                      //  this.following = true;
                    })
                    .start();
            }, 800)

        },3)
       
        
        setTimeout(() => {

            cc.tween(this.camera.node)
                .to(3,  { position: cc.v3(0,0,0) }, { easing: 'sineOut' })
               
                .call(() => {
                  //  this.following = true;
                })
                .start();
        }, 1000)
        

    }


}
