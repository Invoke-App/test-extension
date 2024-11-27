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
    isActive = true;
    private searchTimeout: any | null = null;
    private lastQuery = '';

    async activate(): Promise<void> {
        this.isActive = true;
        console.log("Pokemon search extension activated");
    }

    async deactivate(): Promise<void> {
        this.isActive = false;
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        console.log("Pokemon search extension deactivated");
    }

    async search(query: string): Promise<SearchResult[]> {
        if (!this.isActive || !query.startsWith(':poke ')) {
            return [];
        }

        const searchTerm = query.replace(':poke ', '').toLowerCase().trim();
        if (!searchTerm) return [];
        if (searchTerm === this.lastQuery) return []; // Skip if same query

        // Return a promise that resolves after debounce
        return new Promise((resolve) => {
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }

            this.searchTimeout = setTimeout(async () => {
                this.lastQuery = searchTerm;
                try {
                    console.log('Searching for Pokemon:', searchTerm);
                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
                    
                    if (!response.ok) {
                        console.log('Pokemon not found:', searchTerm);
                        resolve([{
                            id: 'pokemon-not-found',
                            title: `No Pokemon found: ${searchTerm}`,
                            subtitle: 'Try another search',
                            icon: '❌',
                            action: {
                                type: 'Simple',
                                command: 'pokemon.search'
                            }
                        }]);
                        return;
                    }

                    const pokemon = await response.json();
                    console.log('Found Pokemon:', pokemon);

                    resolve([{
                        id: `pokemon-${pokemon.id}`,
                        title: pokemon?.name?.charAt(0).toUpperCase() + pokemon?.name?.slice(1),
                        subtitle: `Type: ${pokemon?.types?.map((t: any) => t.type.name).join(', ')}`,
                        icon: pokemon?.sprites?.front_default || '',
                        action: {
                            type: 'Simple',
                            command: `pokemon.view.${pokemon.id}`
                        }
                    }]);
                } catch (error) {
                    console.error('Failed to fetch pokemon:', error);
                    resolve([{
                        id: 'pokemon-error',
                        title: 'Error searching Pokemon',
                        subtitle: error instanceof Error ? error.message : 'Unknown error',
                        icon: '⚠️',
                        action: {
                            type: 'Simple',
                            command: 'pokemon.search'
                        }
                    }]);
                }
            }, 300); // 300ms debounce
        });
    }
}