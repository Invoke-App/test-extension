// src/index.ts
class PokemonSearchExtension {
  isActive = false;
  async activate() {
    this.isActive = true;
    console.log("Pokemon search extension activated");
  }
  async deactivate() {
    this.isActive = false;
    console.log("Pokemon search extension deactivated");
  }
  async search(query) {
    if (!this.isActive || !query.startsWith(":poke ")) {
      return [];
    }
    const searchTerm = query.replace(":poke ", "").toLowerCase();
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
      if (!response.ok)
        return [];
      const pokemon = await response.json();
      return [{
        id: `pokemon-${pokemon.id}`,
        title: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
        subtitle: `Type: ${pokemon.types.map((t) => t.type.name).join(", ")}`,
        icon: pokemon.sprites.front_default || "",
        action: {
          type: "Simple",
          command: `pokemon.view.${pokemon.id}`
        }
      }];
    } catch (error) {
      console.error("Failed to fetch pokemon:", error);
      return [];
    }
  }
}
export {
  PokemonSearchExtension as default
};
