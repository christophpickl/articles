
export class SortOption {
    constructor(
        public readonly id: string,
        public readonly label: string
    ) {
    }
}

export class SortOptions {
    constructor(
        private readonly options: SortOption[]
    ) {
    }
    forEach(callback: (SortOption) => void) {
        this.options.forEach(callback);
    }
}
export class SortService {
    private static readonly _sorts = new SortOptions([
        new SortOption("created", "recently created"),
        new SortOption("updated", "recently updated")
    ]);

    public sorts(): SortOptions {
        return SortService._sorts;
    }
}