// Use relative path to types file or create a local types.d.ts
interface SearchResult {
    id: string;
    title: string;
    subtitle?: string;
    icon?: string;
    action: {
        type: 'Simple';
        command: string;
    };
}

interface ExtensionInterface {
    isActive: boolean;
    activate(): Promise<void>;
    deactivate(): Promise<void>;
    search?(query: string): Promise<SearchResult[]>;
}

export default class PokemonSearchExtension implements ExtensionInterface {
    isActive = false;

    async activate(): Promise<void> {
        this.isActive = true;
        console.log("Pokemon search extension activated");
    }

    async deactivate(): Promise<void> {
        this.isActive = false;
        console.log("Pokemon search extension deactivated");
    }

    async search(query: string): Promise<SearchResult[]> {
        if (!this.isActive || !query.startsWith(':poke ')) {
            return [];
        }

        const searchTerm = query.replace(':poke ', '').toLowerCase();
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
            if (!response.ok) return [];

            const pokemon = await response.json();
            return [{
                id: `pokemon-${pokemon.id}`,
                title: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
                subtitle: `Type: ${pokemon.types.map((t: any) => t.type.name).join(', ')}`,
                icon: pokemon.sprites.front_default || '',
                action: {
                    type: 'Simple',
                    command: `pokemon.view.${pokemon.id}`
                }
            }];
        } catch (error) {
            console.error('Failed to fetch pokemon:', error);
            return [];
        }
    }
}