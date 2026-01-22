declare module 'flexsearch' {
    export class Document<T, Store> {
        constructor(options?: any);
        add(doc: T): void;
        update(doc: T): void;
        remove(id: string | number): void;
        search(query: string, options?: any): any[];
    }
}
