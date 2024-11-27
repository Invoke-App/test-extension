// src/index.ts
class PokemonSearchExtension {
  isActive = true;
  searchTimeout = null;
  lastQuery = "";
  async activate() {
    this.isActive = true;
    console.log("Pokemon search extension activated");
  }
  async deactivate() {
    this.isActive = false;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    console.log("Pokemon search extension deactivated");
  }
  async search(query) {
    if (!this.isActive || !query.startsWith(":poke ")) {
      return [];
    }
    const searchTerm = query.replace(":poke ", "").toLowerCase().trim();
    if (!searchTerm)
      return [];
    if (searchTerm === this.lastQuery)
      return [];
    return new Promise((resolve) => {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(async () => {
        this.lastQuery = searchTerm;
        try {
          console.log("Searching for Pokemon:", searchTerm);
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
          if (!response.ok) {
            console.log("Pokemon not found:", searchTerm);
            resolve([{
              id: "pokemon-not-found",
              title: `No Pokemon found: ${searchTerm}`,
              subtitle: "Try another search",
              icon: "\u274C",
              action: {
                type: "Simple",
                command: "pokemon.search"
              }
            }]);
            return;
          }
          const pokemon = await response.json();
          console.log("Found Pokemon:", pokemon);
          resolve([{
            id: `pokemon-${pokemon.id}`,
            title: pokemon?.name?.charAt(0).toUpperCase() + pokemon?.name?.slice(1),
            subtitle: `Type: ${pokemon?.types?.map((t) => t.type.name).join(", ")}`,
            icon: pokemon?.sprites?.front_default || "",
            action: {
              type: "Simple",
              command: `pokemon.view.${pokemon.id}`
            }
          }]);
        } catch (error) {
          console.error("Failed to fetch pokemon:", error);
          resolve([{
            id: "pokemon-error",
            title: "Error searching Pokemon",
            subtitle: error instanceof Error ? error.message : "Unknown error",
            icon: "\u26A0\uFE0F",
            action: {
              type: "Simple",
              command: "pokemon.search"
            }
          }]);
        }
      }, 300);
    });
  }
}
export {
  PokemonSearchExtension as default
};
