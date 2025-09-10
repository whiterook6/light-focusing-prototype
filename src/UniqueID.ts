export type ID = number;

export const UniqueID = {
  currentID: 0,
  getNextID: function(): ID {
    return this.currentID++;
  }
}
