// src/index.ts
class ExampleSearchExtension {
  isActive = false;
  async activate() {
    this.isActive = true;
    console.log("Example search extension activated");
  }
  async deactivate() {
    this.isActive = false;
    console.log("Example search extension deactivated");
  }
  async search(query) {
    if (!this.isActive)
      return [];
    return [
      {
        id: "example-1",
        title: `Search Result for: ${query}`,
        subtitle: "Example dynamic extension result",
        icon: "\uD83D\uDD0D",
        action: {
          type: "Simple",
          command: "example.search"
        }
      }
    ];
  }
}
export {
  ExampleSearchExtension as default
};
