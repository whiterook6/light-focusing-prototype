export const UniqueID = {
  currentID: 0,
  getNextID: function() {
    return this.currentID++;
  }
}
