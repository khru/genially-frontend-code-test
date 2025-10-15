import { Instance, types } from "mobx-state-tree";
import { v4 as uuid } from "uuid";
import BoxModel from "./models/Box";
import getRandomColor from "../utils/getRandomColor";

type Position = {
  left: number;
  top: number;
};

const DEFAULT_POSITION: Position = {
  left: 0,
  top: 0,
};

const createBoxAtPosition = (position: Position) =>
  BoxModel.create({
    id: uuid(),
    color: getRandomColor(),
    left: position.left,
    top: position.top,
  });

const MainStore = types
  .model("MainStore", {
    boxes: types.array(BoxModel),
  })
  .actions((self) => ({
    addBox(box: Instance<typeof BoxModel>) {
      self.boxes.push(box);
    },
    addBoxAtPosition(position: Position) {
      self.boxes.push(createBoxAtPosition(position));
    },
    addBoxAtDefaultPosition() {
      self.boxes.push(createBoxAtPosition({ ...DEFAULT_POSITION }));
    },
  }))
  .views(() => ({}));

type MainStoreInstance = Instance<typeof MainStore>;

const store: MainStoreInstance = MainStore.create();

store.addBoxAtDefaultPosition();

export default store;
export { DEFAULT_POSITION };
