


import BaseCharacter from "../Base/BaseCharacter";
import Player from "../Player";
import Weapon from "./Weapon";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WeaponManager extends cc.Component {
    @property(cc.Integer)
    maxWeapon: number = 0;
    @property(BaseCharacter)
    owner: BaseCharacter = null;
 
    @property(cc.Integer)
    rotateSpeed: number = 0;
    @property(cc.Integer)
    radius: number = 0;
    @property(cc.Integer)
    numberOfSword: number = 0;
    @property(cc.Prefab)
    prefSword: cc.Prefab = null;
    arrWeapon: Weapon[] = [];
    indexWeapon = 0;

    isX10:boolean=false;
isDestroy:boolean=false;
    score:number=50;
    isDie:boolean=false;
    protected start(): void {
        this.Plus(this.numberOfSword);

    }
    protected update(dt: number): void {
        this.node.angle -= this.rotateSpeed * dt;
        
    }
    Plus(indexAdd: number) {
        let newIndex = this.indexWeapon + indexAdd;
        if (newIndex >= this.maxWeapon)
            newIndex = this.maxWeapon;
        for (let i = this.indexWeapon; i < newIndex; i++) {
            let newWeapon = cc.instantiate(this.prefSword);
            newWeapon.setParent(this.node);
            let weapon = newWeapon.getComponent(Weapon);
            weapon.weaponManager = this;
            this.arrWeapon.push(weapon);
            weapon.owner = this.owner;
            this.indexWeapon++;
        }
        for (let i = 0; i < this.arrWeapon.length; i++) {
            let angle = 360 / this.arrWeapon.length * i;
            let pos = this.CaculatorPosInCircle(angle);
            this.arrWeapon[i].node.position = pos;
            this.arrWeapon[i].node.angle = 360 - angle;
        }
    }
    Multi(indexAdd: number) {
        let newIndex = this.indexWeapon * indexAdd;
        if (newIndex >= this.maxWeapon)
            newIndex = this.maxWeapon;
        for (let i = this.indexWeapon; i < newIndex; i++) {
            let newWeapon = cc.instantiate(this.prefSword);
            newWeapon.setParent(this.node);
            let weapon = newWeapon.getComponent(Weapon);
            weapon.weaponManager = this;
            this.arrWeapon.push(weapon);
            weapon.owner = this.owner;
            this.indexWeapon++;
        }
        for (let i = 0; i < this.arrWeapon.length; i++) {
            let angle = 360 / this.arrWeapon.length * i;
            let pos = this.CaculatorPosInCircle(angle);
            this.arrWeapon[i].node.position = pos;
            this.arrWeapon[i].node.angle = 360 - angle;
        }
        this.indexWeapon = newIndex;
    }
    Subtract(indexAdd: number) {
        if (indexAdd > this.arrWeapon.length) {
            indexAdd = this.arrWeapon.length;
        }
        for (let i = 0; i < indexAdd; i++) {
            this.arrWeapon[i].DeleteItSelf();
        }
        this.arrWeapon.splice(0, indexAdd);
        for (let i = 0; i < this.arrWeapon.length; i++) {
            let angle = 360 / this.arrWeapon.length * i;
            let pos = this.CaculatorPosInCircle(angle);
            this.arrWeapon[i].node.position = pos;
            this.arrWeapon[i].node.angle = 360 - angle;
        }
        this.indexWeapon -= indexAdd;
    }
    SubtractByCollision(weapon: Weapon) {
        this.arrWeapon.splice(this.arrWeapon.indexOf(weapon), 1);
        for (let i = 0; i < this.arrWeapon.length; i++) {
            let angle = 360 / this.arrWeapon.length * i;
            let pos = this.CaculatorPosInCircle(angle);
            this.arrWeapon[i].node.position = pos;
            this.arrWeapon[i].node.angle = 360 - angle;
        }
        this.indexWeapon -= 1;
    }
    Divide(indexAdd: number) {
        let newIndex = Math.round(this.indexWeapon / indexAdd);
        if (newIndex <= 0) newIndex = 0;
        var subtractFromDivine = this.indexWeapon - newIndex;

        for (let i = 0; i < subtractFromDivine; i++) {
            this.arrWeapon[i].DeleteItSelf();
        }
        this.arrWeapon.splice(0, subtractFromDivine);
        for (let i = 0; i < this.arrWeapon.length; i++) {
            let angle = 360 / this.arrWeapon.length * i;
            let pos = this.CaculatorPosInCircle(angle);
            this.arrWeapon[i].node.position = pos;
            this.arrWeapon[i].node.angle = 360 - angle;
        }
        this.indexWeapon -= subtractFromDivine;
    }


    CaculatorPosInCircle(angle: number): cc.Vec3 {
        let pos = cc.Vec3.ZERO;
        pos.x = 0 + this.radius * Math.sin((angle * Math.PI) / 180);
        pos.y = 0 + this.radius * Math.cos((angle * Math.PI) / 180);
        pos.z = 0;
        return pos;
    }
}






