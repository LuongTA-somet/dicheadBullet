
import WeaponManager from "./WeaponManager";
import BaseCharacter from "../Base/BaseCharacter";
import SoundManager from "../Manager/SoundManager";
import GameManager from "../Manager/GameManager";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Weapon extends cc.Component {
    weaponManager: WeaponManager = null;
    owner: BaseCharacter = null;

    start() {

        cc.tween(this.node)
            .repeatForever(
                cc.tween().by(2, { angle: -360 })
            )
            .start();

    }
    onCollisionEnter(other: cc.Collider): void {

        if (other.node.name == "Enemy copy") {
            this.weaponManager.score += 7;



        }
        if (other.node.name == "Enemyv2 copy") {
            this.weaponManager.score += 41;



        }
        if (other.node.name == "ItemX10") {
            SoundManager.Instance(SoundManager).Play("Item");
            this.weaponManager.score *= 10;
            other.node.active = false;
            this.weaponManager.isX10 = true;

        }
        if (other.node.name == "ItemDestroy") {
            this.weaponManager.score *= 2;
            this.weaponManager.isDestroy = true;
            SoundManager.Instance(SoundManager).Play("Item");

        }

    }
    DeleteItSelf() {
        this.node.destroy();
    }
}
