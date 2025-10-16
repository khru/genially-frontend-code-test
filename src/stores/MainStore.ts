import { Instance, SnapshotOut, getSnapshot, onSnapshot, types } from "mobx-state-tree";
import BoxModel from "./models/Box";
import { defaultBoxService, DEFAULT_POSITION, Position } from "../application/BoxService";
import { BoxSelectionService } from "../application/BoxSelectionService";
import { BoxColorService } from "../application/BoxColorService";
import { CanvasStateRepository, SerializedBox } from "../domain/CanvasStateRepository";
import { createLocalStorageCanvasStateRepository } from "../infrastructure/LocalStorageCanvasStateRepository";

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
      hydrateBoxes(boxes: SerializedBox[]) {
        self.boxes.replace(boxes.map((box) => BoxModel.create(box)));
        self.selectedBoxIds.replace([]);
        updateSelectionService([]);
        updateColorService([]);
      },
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
      removeSelectedBoxes() {
        if (self.selectedBoxIds.length === 0) {
          return;
        }

        const selectedIds = new Set(self.selectedBoxIds);
        self.boxes.replace(self.boxes.filter((box) => !selectedIds.has(box.id)));
        self.selectedBoxIds.replace([]);

        updateSelectionService([]);
        updateColorService([]);
      },
      updateBoxPosition(id: string, position: Position) {
        const target = self.boxes.find((box) => box.id === id);
        if (!target) {
          return;
        }

        target.setPosition(position);
        updateSelectionService();
        updateColorService();
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
type MainStoreSnapshot = SnapshotOut<typeof MainStore>;

type CreateMainStoreDependencies = {
  repository?: CanvasStateRepository;
};

const createMainStore = ({ repository }: CreateMainStoreDependencies = {}): MainStoreInstance => {
  const canvasRepository = repository ?? createLocalStorageCanvasStateRepository();

  const store: MainStoreInstance = MainStore.create({
    boxes: [],
    selectedBoxIds: [],
  });

  const restored = canvasRepository.load();
  if (restored && restored.boxes.length > 0) {
    store.hydrateBoxes(restored.boxes);
  } else {
    store.addBoxAtDefaultPosition();
  }

  const toSerializedBoxes = (snapshot: MainStoreSnapshot): SerializedBox[] =>
    snapshot.boxes.map(({ id, width, height, color, left, top }) => ({ id, width, height, color, left, top }));

  const persist = (snapshot: MainStoreSnapshot) => {
    canvasRepository.save({ boxes: toSerializedBoxes(snapshot) });
  };

  persist(getSnapshot(store));
  onSnapshot(store, persist);

  return store;
};

const store = createMainStore();

export default store;
export { DEFAULT_POSITION, createMainStore };
