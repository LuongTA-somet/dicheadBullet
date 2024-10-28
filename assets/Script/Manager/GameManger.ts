
import super_html_playable from "../Base/super_html_playable";
import Singleton from "../Base/Singleton";
import MapController from "../Map/MapController";
import Enemy from "../Enemy";
import CameraFollow from "../CameraFollow";
import SoundManager from "./SoundManager";
import GlobalGamePlay, { eventDispatcher } from "../Base/GlobalGamePlay";
import KeyEvent from "../Base/KeyEvent";
import Player from "../Player";
import Utility from "../Base/Utility";
import RectangleController from "../Map/RectangleCollider";
import Global from "../Base/Global";
import Joystick from "../Joystick";
import { FacingType } from "../Base/EnumDefine";
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends Singleton<GameManager> {
    google_play: string = "https://play.google.com/store/apps/details?id=com.drag.dichead.survival&hl=en";
    appstore: string = "";

    @property(cc.Sprite)
    progressionBar: cc.Sprite = null
    public curProgression: number = 0;
    @property(cc.Camera)
    mainCamera: cc.Camera = null;
    @property(CameraFollow)
    cameraFollower: CameraFollow = null;
    @property(cc.Node)
    weaponBrokenParent: cc.Node = null;
    @property(MapController)
    mapController: MapController = null;

    @property(cc.Node)
    fxParent: cc.Node = null;
    @property(cc.Node)
    enemyParent: cc.Node = null;
    @property(cc.Node)
    map: cc.Node = null;
    @property(cc.Node)
    joystick: cc.Node = null;


    @property(cc.Prefab)
    enemy4: cc.Prefab = null;
    @property(cc.Prefab)
    enemy12: cc.Prefab = null;
    //Player
    isUpgrade: boolean = false;
    //Enemy
    enemyDieCount: number = 0;
    //Skill
    skillCount: number = 0;
    //UI
    @property(cc.Node)
    upgrade1: cc.Node = null;
    @property(cc.Node)
    upgrade2: cc.Node = null;
    @property(cc.Node)
    Weapon2: cc.Node = null;
    @property(cc.Node)
    Weapon3: cc.Node = null;
    @property(cc.Node)
    Weapon4: cc.Node = null;
    @property(cc.Node)
    shield: cc.Node = null;
    @property(cc.Node)
    sword: cc.Node = null;
    @property(cc.Node)
    progrBar: cc.Node = null;
    @property(cc.Node)
    Tut: cc.Node = null;

    @property(cc.Node)
    btnDownLoad: cc.Node=null;
    // totalEnemy: number = 18;
    @property(cc.Label)
    txtTotalCoin: cc.Label = null;

    @property(SoundManager)
    soundManager: SoundManager = null;

    currentCoin: number = 300;
    constructor() {
        super();
        GameManager.instance = this;
    }
    // protected onEnable(): void {
    //     eventDispatcher.on(KeyEvent.EnemyDie, this.CheckWin, this);
    // }
    // protected onDisable(): void {
    //     eventDispatcher.off(KeyEvent.EnemyDie, this.CheckWin, this);
    // }
    protected onLoad(): void {
        super_html_playable.set_google_play_url(this.google_play);
    }
    protected start(): void {
        // this.joystick.active = false;
        Global.isPause = true;
        Player.Instance.Init();
        this.skillCount = 0;
        this.enemyDieCount = 0;
        this.curProgression = 0;
        // this.cameraFollower.following = true;
        for (let i = 0; i < this.mapController.node.childrenCount; i++) {
            this.mapController.lstRectangleObjects[i] = this.mapController.node.children[i].getComponent(RectangleController);
        }
        this.needSort = false;


    }
    // SpawnEnemyWave1() {
    //     let delay = 0;
    //     for (let i = 0; i < 3; i++) {
    //         this.scheduleOnce(() => {
    //             let xRandom = Utility.RandomRangeFloat(400, 900);
    //             let yRandom = Utility.RandomRangeFloat(1450, 1650);
    //             this.SpawnEnemy(this.enemy4, cc.v2(xRandom, yRandom), this.gate2);
    //         }, delay);
    //         delay += 0.6;
    //     }
    //     let delay2 = 0.3;
    //     for (let i = 0; i < 6; i++) {
    //         this.scheduleOnce(() => {
    //             let xRandom = Utility.RandomRangeFloat(400, 900);
    //             let yRandom = Utility.RandomRangeFloat(1450, 1650);
    //             this.SpawnEnemy(this.enemy12, cc.v2(xRandom, yRandom), this.gate2);
    //         }, delay2);
    //         delay2 += 0.6;
    //     }
    // }
    // SpawnEnemyWave2() {
    //     let delay = 0;
    //     for (let i = 0; i < 3; i++) {
    //         this.scheduleOnce(() => {
    //             let xRandom = Utility.RandomRangeFloat(-950, -450);
    //             let yRandom = Utility.RandomRangeFloat(1450, 1650);
    //             this.SpawnEnemy(this.enemy4, cc.v2(xRandom, yRandom), this.gate1);
    //         }, delay);
    //         delay += 0.6;
    //     }
    //     let delay2 = 0.3;
    //     for (let i = 0; i < 6; i++) {
    //         this.scheduleOnce(() => {
    //             let xRandom = Utility.RandomRangeFloat(-950, -450);
    //             let yRandom = Utility.RandomRangeFloat(1450, 1650);
    //             this.SpawnEnemy(this.enemy12, cc.v2(xRandom, yRandom), this.gate1);
    //         }, delay2);
    //         delay2 += 0.6;
    //     }
    // }
    SpawnEnemy(prefab: cc.Prefab, position: cc.Vec2, target: cc.Node) {
        var enemy = cc.instantiate(prefab);
        enemy.setParent(this.enemyParent);
        enemy.setPosition(position);
        enemy.getComponent(Enemy).Init(target);
    }
    flag: boolean = false;
    flagEnd: boolean=false;
    flagUP1:boolean=false ;  
    skillNum1:number=0;
    skillNum2:number=0;
    FlagJoy:boolean=false;
    FlagJoy2:boolean=false;
    update(dt: number) {

         this.checkPositionChange();
        this.progressionBar.fillRange = this.curProgression / 10;
        if (this.curProgression == 10) {
            this.progrBar.active = false;
            Global.isPause = true;
            if(!this.flagUP1){
                this.upgrade1.active = true;
                this.flagUP1=true;
            }
           
        }
        if (this.enemyDieCount == 5) {
           
                this.isUpgrade = true;
                if(!this.FlagJoy){
                    GameManager.instance.joystick.active=false;
                    GameManager.instance.joystick.TOUCH_END;
                    this.FlagJoy=true;
                }
          
        }
        if (this.enemyDieCount == 25) {
            Global.isPause=true;
            this.scheduleOnce(() => {
                GameManager.instance.joystick.opacity=0;
                Global.isEndGame = true;
                this.upgrade2.active = true;
                this.joystick.active = false;
                this.btnDownLoad.active=true;
                if(!this.flagEnd){
                    this.EndGame();
                    this.flagEnd=true;
                   
                }
               
            }, 0.5);

        }
        if (this.enemyDieCount == 1) {
            
            this.progrBar.active = true;
        }
        if (this.skillCount == 2) {
            if(!this.FlagJoy2){
                Global.stickPos=cc.Vec2.ZERO;
                Global.isDraggingJoyStick=false;
                // GameManager.instance.joystick.active=true;
                GameManager.instance.joystick.opacity=0;
                this.FlagJoy2=true;
            }
           
            this.scheduleOnce(() => {
            //    Global.stickPos=cc.Vec2.ZERO;
           
                GameManager.instance.joystick.active=true;
                
                Global.isPause = false;
                if(this.skillNum1!=0){

                    if(this.skillNum1==6||this.skillNum1==5){
                        this.shield.active = true;
                    }
                    if(this.skillNum1==2){
                        this.Weapon3.active = true;
                    }
                    if(this.skillNum1==3){
                        this.Weapon2.active = true;
                    }
                    if(this.skillNum1==4){
                        this.Weapon4.active = true;

                    }
                    if(this.skillNum1==1){
                        this.sword.active = true;

                    }

                 }
                 if(this.skillNum2!=0){

                    if(this.skillNum2==6||this.skillNum2==5){
                        this.shield.active = true;
                    }
                    if(this.skillNum2==2){
                        this.Weapon3.active = true;
                    }
                    if(this.skillNum2==3){
                        this.Weapon2.active = true;
                    }
                    if(this.skillNum2==4){
                        this.Weapon4.active = true;

                    }
                    if(this.skillNum2==1){
                        this.sword.active = true;

                    }

                 }
                this.upgrade1.active = false;

               
              
               
                
                if (!this.flag) {
                    cc.audioEngine.playEffect(GlobalGamePlay.Instance(GlobalGamePlay).gameplay.soundManager.succeed, false);
                    this.flag = true;
                }

            }, 0.8);

        }
    }
    protected lateUpdate(dt: number): void {
        if (this.needSort) {
            this.sortNodesByY();
            this.needSort = false;  // Reset the flag after sorting
        }
    }



    EndGame() {
        super_html_playable.game_end();
    }
    ClickDownLoad() {
        try {
            super_html_playable.download();
            console.log("click");
        }
        catch (error) {

            console.error("ErrorCode: ", error);

        }

    }



    //SortingObj
    private needSort: boolean = false;
    checkPositionChange() {
        if (!this.enemyParent) {
            //cc.error("Parent node not assigned!");
            return;
        }

        // Check if any child's y position has changed
        let children = this.enemyParent.children;
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            let childScripts = child.getComponent(Enemy);
            if (child.y !== childScripts.lastY) {
                this.needSort = true;
                childScripts.lastY = child.y;
            }
        }
    }
    sortNodesByY() {
        if (!this.enemyParent) {
            //cc.error("Parent node not assigned!");
            return;
        }
        let children = this.enemyParent.children;
        children.sort((a, b) => b.y - a.y);

        for (let i = 0; i < this.enemyParent.childrenCount; i++) {
            this.enemyParent.children[i].zIndex = i;
        }
        // Optionally, sort the children array in the parent node for future reference
        //this.enemyParent.children = children;
    }
    Lose() {
        // cc.audioEngine.playEffect(this.soundManager.lose, false);
        if (!Global.isEndGame) {
            Global.isEndGame = true;
            // this.endCardLose.active = true;
            this.EndGame();
        }
    }
    // @property(cc.Node)
    // waveClear: cc.Node = null;
    // @property(cc.Node)
    // base2: cc.Node = null;
    // @property(cc.Node)
    // vertical: cc.Node = null;
    // @property(cc.Node)
    // fenceUp2: cc.Node = null;
    // @property(cc.Node)
    // fenceDown2: cc.Node = null;
    // @property(cc.Node)
    // endCardWin: cc.Node = null;
    // // @property(ArrowTarget)
    // // arrowTarget: ArrowTarget = null;
    // @property(cc.Node)
    // unlockRoom: cc.Node = null;
    // @property(cc.Node)
    // btnDown: cc.Node = null;
    // @property(cc.Animation)
    // updateScale: cc.Animation = null;
    // CheckWin() {

    // }
    // Win() {
    //     // cc.audioEngine.playEffect(this.soundManager.win, false);
    //     this.waveClear.runAction(cc.scaleTo(0.3, 1));
    //     this.scheduleOnce(() => {
    //         this.waveClear.active = false;

    //     }, 1.2);

    // }
    ActionEnd() {
        if (!Global.isEndGame) {
            // cc.audioEngine.playEffect(this.soundManager.succeed, false);
            // this.updateScale.play();

            Global.isEndGame = true;

            // this.vertical.active = false;
            // this.base2.active = true;
            // this.base2.runAction(cc.scaleTo(0.2, 1));
            // this.fenceUp2.active = true;
            // this.fenceUp2.runAction(cc.scaleTo(0.2, 1));
            // this.fenceDown2.active = true;
            // this.fenceDown2.runAction(cc.scaleTo(0.2, 1));
            Player.Instance.AnimationMove();
            Player.Instance.node.runAction(cc.sequence(cc.moveTo(1, cc.v2(2819, 73)), cc.callFunc(() => {
                Player.Instance.AnimationIdle();
            })));
            this.scheduleOnce(() => {
                this.EndGame();
                // this.endCardWin.active = true;
                // this.unlockRoom.runAction(cc.scaleTo(0.3, 1));
                this.scheduleOnce(() => {
                    // this.btnDown.runAction(cc.scaleTo(0.3, 1));
                    this.scheduleOnce(() => {
                        // this.btnDown.getComponent(cc.Animation).play();
                    }, 0.3);
                }, 0.2);
            }, 1);
        }
    }

}
