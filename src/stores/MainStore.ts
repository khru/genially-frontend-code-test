import { Instance, types } from "mobx-state-tree";
import BoxModel from "./models/Box";
import { defaultBoxService, DEFAULT_POSITION, Position } from "../application/BoxService";
import { SelectionService } from "../application/SelectionService";

const selectionService = new SelectionService();

const MainStore = types
  .model("MainStore", {
    boxes: types.array(BoxModel),
    selectedBoxIds: types.array(types.string),
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
    selectBox(id: string) {
      const next = selectionService.select(id, self.selectedBoxIds.slice());
      self.selectedBoxIds.replace(next);
    },
    clearSelection() {
      const next = selectionService.clear(self.selectedBoxIds.slice());
      self.selectedBoxIds.replace(next);
    },
  }))
  .views((self) => ({
    isBoxSelected(id: string) {
      return self.selectedBoxIds.includes(id);
    },
  }));

type MainStoreInstance = Instance<typeof MainStore>;

const store: MainStoreInstance = MainStore.create({
  boxes: [],
  selectedBoxIds: [],
});

store.addBoxAtDefaultPosition();

export default store;
export { DEFAULT_POSITION };
