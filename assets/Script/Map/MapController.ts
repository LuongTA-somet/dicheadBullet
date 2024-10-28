import RectangleController from "./RectangleCollider";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapController extends cc.Component {
    public lstRectangleObjects: RectangleController[] = [];
}
