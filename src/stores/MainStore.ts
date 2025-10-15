import { Instance, types } from "mobx-state-tree";
import BoxModel from "./models/Box";
import { defaultBoxService, DEFAULT_POSITION, Position } from "../application/BoxService";

const MainStore = types
  .model("MainStore", {
    boxes: types.array(BoxModel),
  })
  .actions((self) => ({
    addBox(box: Instance<typeof BoxModel>) {
      self.boxes.push(box);
    },
    addBoxAtPosition(position: Position) {
      const dto = defaultBoxService.createBoxAtPosition(position);
      self.boxes.push(BoxModel.create(dto));
    },
    addBoxAtDefaultPosition() {
      const dto = defaultBoxService.createDefaultBox();
      self.boxes.push(BoxModel.create(dto));
    },
  }))
  .views(() => ({}));

type MainStoreInstance = Instance<typeof MainStore>;

const store: MainStoreInstance = MainStore.create();

store.addBoxAtDefaultPosition();

export default store;
export { DEFAULT_POSITION };
