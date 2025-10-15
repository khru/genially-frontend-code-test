export type Position = {
  left: number;
  top: number;
};

export type BoxDTO = {
  id: string;
  color: string;
  left: number;
  top: number;
};

export interface BoxFactoryDependencies {
  idGenerator: () => string;
  colorProvider: () => string;
}

export const DEFAULT_POSITION: Position = {
  left: 0,
  top: 0,
};

export class BoxFactory {
  private readonly idGenerator: () => string;
  private readonly colorProvider: () => string;

  constructor(dependencies: BoxFactoryDependencies) {
    this.idGenerator = dependencies.idGenerator;
    this.colorProvider = dependencies.colorProvider;
  }

  create(position: Position): BoxDTO {
    return {
      id: this.idGenerator(),
      color: this.colorProvider(),
      left: position.left,
      top: position.top,
    };
  }

  createDefault(): BoxDTO {
    return this.create(DEFAULT_POSITION);
  }
}
