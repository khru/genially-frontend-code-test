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
    updateSelectedBoxesColor(color: string) {
      self.selectedBoxIds.forEach((id) => {
        const targetBox = self.boxes.find((box) => box.id === id);
        if (targetBox) {
          targetBox.setColor(color);
        }
      });
    },
  }))
  .views((self) => ({
    isBoxSelected(id: string) {
      return self.selectedBoxIds.includes(id);
    },
    get selectedBoxes() {
      return self.boxes.filter((box) => self.selectedBoxIds.includes(box.id));
    },
    get lastSelectedBox() {
      const lastSelectedId = self.selectedBoxIds[self.selectedBoxIds.length - 1];
      if (!lastSelectedId) {
        return undefined;
      }
      return self.boxes.find((box) => box.id === lastSelectedId);
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
