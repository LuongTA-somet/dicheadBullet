
import Global from "./Global";
Global
import Singleton from "./Singleton";
import SoundManager from "../Manager/SoundManager";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Utility extends Singleton<Utility> {

    constructor() {
        super();
        Utility.instance = this;
    }
    static VectorsSum(a: cc.Vec2, b: cc.Vec2): cc.Vec2 {
        return cc.v2(a.x + b.x, a.y + b.y);
    }
    static VectorsSubs(a: cc.Vec2, b: cc.Vec2): cc.Vec2 {
        return cc.v2(a.x - b.x, a.y - b.y);
    }
    static VectorsMult(a: cc.Vec2, b: cc.Vec2): cc.Vec2 {
        return cc.v2(a.x * b.x, a.y * b.y);
    }
    static VectorsDiv(a: cc.Vec2, b: cc.Vec2): cc.Vec2 {
        if (b.x == 0 || b.y == 0) return null;
        else return cc.v2(a.x / b.x, a.y / b.y);
    }
    static VectorTimes(a: cc.Vec2, x: number) {
        return cc.v2(a.x * x, a.y * x);
    }
    static RandomRangeFloat(lower: number, upper: number) {
        return Math.random() * (upper - lower) + lower;
        //return Math.floor(Math.random() * (lower - lower)) + lower;
    }
    static RandomRangeInteger(lower: number, upper: number) {
        return Math.round(Math.random() * (upper - lower) + lower);
    }
    static Distance(vec1: cc.Vec2, vec2: cc.Vec2) {
        let Distance = Math.sqrt(Math.pow(vec1.x - vec2.x, 2) +
            Math.pow(vec1.y - vec2.y, 2));
        return Distance;
    }
    static CaculatorDuration(vec1: cc.Vec2, vec2: cc.Vec2, speed: number) {
        let distance = this.Distance(vec1, vec2);
        let duration = distance / speed;
        return duration;
    }
    public static LookAt(startPos: cc.Vec3, endPos: cc.Vec3) {
        const direction = endPos.sub(startPos);
        const directionNormalized = direction.normalize();
        const radianAngle = Math.atan2(directionNormalized.y, directionNormalized.x);
        const angle = cc.misc.radiansToDegrees(radianAngle);

        //return {
        // direction: direction,
        // directionNormalized: directionNormalized,
        // radianAngle: radianAngle,
        //angle: angle
        //}
        return angle;
    }
    static BetweenDegree(comVec: cc.Vec2, dirVec: cc.Vec2 = cc.v2(0, 0)) {
        let angleDegree: number = 0;
        if (dirVec == cc.v2(0, 0)) angleDegree = Math.atan2(comVec.y, comVec.x) * 180 / Math.PI;
        else angleDegree = Math.atan2(dirVec.y - comVec.y, dirVec.x - comVec.x) * 180 / Math.PI;
        return angleDegree;
    }
    static CaculatorDegree(Target: cc.Vec2) {
        var r = Math.atan2(Target.y, Target.x);
        var degree = r * 180 / (Math.PI);
        degree = 360 - degree + 90;
        return degree;
    }
    static ConvertPosToCanvasByNode(objectParent: cc.Node, objectChildren: cc.Node) {
        var pos = cc.Canvas.instance.node.convertToNodeSpaceAR(objectParent.convertToWorldSpaceAR(objectChildren.getPosition()));
        return pos;
    }
    static ConvertPosToCanvasByVector(objectParent: cc.Node, vector: cc.Vec2) {
        var pos = cc.Canvas.instance.node.convertToNodeSpaceAR(objectParent.convertToWorldSpaceAR(vector));
        return pos;
    }
    static ConvertPosToParentByNode(objectParent: cc.Node, objectChildren: cc.Node) {
        var pos = objectParent.convertToNodeSpaceAR(cc.Canvas.instance.node.convertToWorldSpaceAR(objectChildren.getPosition()));
        return pos;
    }
    static ConvertPosToParentByVector(objectParent: cc.Node, vector: cc.Vec2) {
        var pos = objectParent.convertToNodeSpaceAR(cc.Canvas.instance.node.convertToWorldSpaceAR(vector));
        return pos;
    }
    static ConvertPosToHigherParentByNode(objectParentHigher: cc.Node, objectParent: cc.Node, objectChildren: cc.Node) {
        var pos = objectParentHigher.convertToNodeSpaceAR(objectParent.convertToWorldSpaceAR(objectChildren.getPosition()));
        return pos;
    }
    static ConvertPosToHigherParentByVector(objectParentHigher: cc.Node, objectParent: cc.Node, vector: cc.Vec2) {
        var pos = objectParentHigher.convertToNodeSpaceAR(objectParent.convertToWorldSpaceAR(vector));
        return pos;
    }
    static PlaySound(clipName: string) {
        SoundManager.Instance(SoundManager).Play(clipName);
    }
    static ShakeCam(camera: cc.Camera, magnitude: number) {
        camera.node.stopAllActions();
        camera.node.x = 0;
        camera.node.y = 0;
        camera.node.runAction(cc.sequence(
            cc.moveBy(0.025, cc.v2(0, magnitude)),
            cc.moveBy(0.05, cc.v2(0, 0)),
        ));
    }
    static ChangeParent(node: cc.Node, newParent: cc.Node) {
        if (node.parent == newParent) return;
        var getWorldRotation = function (node) {
            var currNode = node;
            var resultRot = currNode.angle;
            while (currNode.parent != null) {
                currNode = currNode.parent;
                resultRot += currNode.angle;
            }
            // do {
            // 	currNode = currNode.parent;
            // 	resultRot += currNode.angle;
            // } while(currNode.parent != null);
            resultRot = resultRot % 360;
            return resultRot;
        };

        var oldWorRot = getWorldRotation(node);
        var newParentWorRot = getWorldRotation(newParent);
        var newLocRot = oldWorRot - newParentWorRot;

        var oldWorPos = node.convertToWorldSpaceAR(cc.v2(0, 0));
        var newLocPos = newParent.convertToNodeSpaceAR(oldWorPos);

        node.parent = newParent;
        node.x = newLocPos.x;
        node.y = newLocPos.y;
        node.angle = newLocRot;
    }
   
	// static LogDurationAnimationSpine()
	// {
	//     let animation = this.spine.findAnimation("Attack-01");
    //     if (animation) {
	// 		let duration = animation.duration;
	// 		console.log("Duration of animation:", duration);
    //     } else {
	// 		console.log("Animation not found");
    //     }
	// }
}
