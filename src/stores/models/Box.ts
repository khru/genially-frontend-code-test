import { types } from "mobx-state-tree";

const BoxModel = types
  .model("Box", {
    id: types.identifier,
    width: types.optional(types.number, 200),
    height: types.optional(types.number, 100),
    color: types.optional(types.string, "#FFF000"),
    left: types.optional(types.number, 200),
    top: types.optional(types.number, 100),
  })
  .views(() => ({}))
  .actions((self) => ({
    setColor(color: string) {
      self.color = color;
    },
    setPosition(position: { left: number; top: number }) {
      self.left = position.left;
      self.top = position.top;
    },
  }));

export default BoxModel;
