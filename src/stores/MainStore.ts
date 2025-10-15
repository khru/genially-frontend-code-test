import { Instance, onSnapshot, types } from "mobx-state-tree";
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
      selectionService.select(id);
      self.selectedBoxIds.replace(selectionService.getSelection());
    },
    clearSelection() {
      selectionService.clear();
      self.selectedBoxIds.replace(selectionService.getSelection());
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

selectionService.replace(store.selectedBoxIds.slice());
onSnapshot(store, (snapshot) => {
  selectionService.replace(snapshot.selectedBoxIds.slice());
});

store.addBoxAtDefaultPosition();

export default store;
export { DEFAULT_POSITION };
