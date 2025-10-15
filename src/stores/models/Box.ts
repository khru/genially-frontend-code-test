import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree";

const BoxModel = types
  .model("Box", {
    id: types.identifier,
    width: types.optional(types.number, 200),
    height: types.optional(types.number, 100),
    color: types.optional(types.string, "#FFF000"),
    left: types.optional(types.number, 200),
    top: types.optional(types.number, 100)
  })
  .views(self => ({}))
  .actions(self => ({}));

export type BoxSnapshotIn = SnapshotIn<typeof BoxModel>;
export type BoxSnapshotOut = SnapshotOut<typeof BoxModel>;
export type BoxInstance = Instance<typeof BoxModel>;

export default BoxModel;
