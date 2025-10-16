import { v4 as uuid } from "uuid";
import getRandomColor from "../utils/getRandomColor";
import { BoxDTO, BoxFactory, DEFAULT_POSITION, Position } from "../domain/BoxFactory";

class BoxService {
  constructor(private readonly factory: BoxFactory) {}

  createDefaultBox(): BoxDTO {
    return this.factory.createDefault();
  }

  createBoxAtPosition(position: Position): BoxDTO {
    return this.factory.create(position);
  }
}

const defaultFactory = new BoxFactory({
  idGenerator: () => uuid(),
  colorProvider: () => getRandomColor(),
});

const defaultBoxService = new BoxService(defaultFactory);

export { BoxService, defaultBoxService, DEFAULT_POSITION };
export type { Position, BoxDTO };
