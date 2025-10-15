import { Instance, types } from "mobx-state-tree";
import BoxModel from "./models/Box";
import { defaultBoxService, DEFAULT_POSITION, Position } from "../application/BoxService";
import { BoxSelectionService } from "../application/BoxSelectionService";
import { BoxColorService } from "../application/BoxColorService";

type BoxInstance = Instance<typeof BoxModel>;

const MainStore = types
  .model("MainStore", {
    boxes: types.array(BoxModel),
    selectedBoxIds: types.array(types.string),
  })
  .volatile(() => ({
    selectionService: new BoxSelectionService<BoxInstance>(),
    colorService: new BoxColorService<BoxInstance>(),
  }))
  .actions((self) => {
    const updateSelectionService = (selectionSnapshot?: string[]) => {
      const boxesSnapshot = self.boxes.slice();
      const ids = selectionSnapshot ?? self.selectedBoxIds.slice();
      self.selectionService.hydrate(boxesSnapshot, ids);
    };

    const updateColorService = (selectionSnapshot?: string[]) => {
      const boxesSnapshot = self.boxes.slice();
      const ids = selectionSnapshot ?? self.selectedBoxIds.slice();
      self.colorService.hydrate(boxesSnapshot, ids);
    };

    return {
      addBox(box: BoxInstance) {
        self.boxes.push(box);
        updateSelectionService();
        updateColorService();
      },
      addBoxAtPosition(position: Position) {
        const dto = defaultBoxService.createBoxAtPosition(position);
        self.boxes.push(BoxModel.create(dto));
        updateSelectionService();
        updateColorService();
      },
      addBoxAtDefaultPosition() {
        const dto = defaultBoxService.createDefaultBox();
        self.boxes.push(BoxModel.create(dto));
        updateSelectionService();
        updateColorService();
      },
      selectBox(id: string) {
        updateSelectionService();
        const nextSelection = self.selectionService.select(id);
        self.selectedBoxIds.replace(nextSelection);

        updateSelectionService(nextSelection);
        updateColorService(nextSelection);
      },
      clearSelection() {
        updateSelectionService();
        const nextSelection = self.selectionService.clear();
        self.selectedBoxIds.replace(nextSelection);

        updateSelectionService(nextSelection);
        updateColorService(nextSelection);
      },
      updateSelectedBoxesColor(color: string) {
        updateColorService();
        const targets = self.colorService.targetsForColor();
        targets.forEach((box) => {
          box.setColor(color);
        });
      },
    };
  })
  .views((self) => ({
    isBoxSelected(id: string) {
      self.selectionService.hydrate(self.boxes.slice(), self.selectedBoxIds.slice());
      return self.selectionService.isSelected(id);
    },
    get selectedBoxes() {
      self.selectionService.hydrate(self.boxes.slice(), self.selectedBoxIds.slice());
      return self.selectionService.selectedBoxes();
    },
    get lastSelectedBox() {
      self.selectionService.hydrate(self.boxes.slice(), self.selectedBoxIds.slice());
      return self.selectionService.lastSelectedBox();
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
