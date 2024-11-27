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

export default class ExampleSearchExtension implements ExtensionInterface {
    isActive = false;

    async activate(): Promise<void> {
        this.isActive = true;
        console.log('Example search extension activated');
    }

    async deactivate(): Promise<void> {
        this.isActive = false;
        console.log('Example search extension deactivated');
    }

    async search(query: string): Promise<SearchResult[]> {
        if (!this.isActive) return [];
        
        // Example: Return search results that match the query
        return [
            {
                id: 'example-1',
                title: `Search Result for: ${query}`,
                subtitle: 'Example dynamic extension result',
                icon: '🔍',
                action: {
                    type: 'Simple',
                    command: 'example.search'
                }
            }
        ];
    }
}