import {Event} from "./EventBus";
import {Article} from "./domain";

export class SortEvent implements Event {
    static readonly ID = "SortEvent";
    readonly id = SortEvent.ID;

    public constructor(
        public readonly option: SortOption
    ) {
    }
}

export class SortOption {
    constructor(
        public readonly id: string,
        public readonly label: string,
        public readonly sortCallback: (a1: Article, a2: Article) => number
    ) {
    }
}

export class SortOptions {

    static readonly options = [
        new SortOption("created", "recently created", (a1, a2) => {
            return a1.created.getTime() - a2.created.getTime()
        }),
        new SortOption("updated", "recently updated", (a1, a2) => {
            return a1.updated.getTime() - a2.updated.getTime()
        }),
        new SortOption("title", "title desc", (a1, a2) => {
            return a2.title.localeCompare(a1.title)
        }),
        new SortOption("tags", "number of tags", (a1, a2) => {
            return a2.tags.length - a1.tags.length
        })
        // likes
    ];

    static readonly defaultOption: SortOption = SortOptions.options[0];

    static findByIdOrNull(id: string): SortOption | null {
        let found = SortOptions.options.filter((it) => {
            return it.id == id
        });
        if (found.length == 0) {
            return null
        }
        return found[0];
    }

    static forEach(callback: (SortOption) => void) {
        SortOptions.options.forEach(callback);
    }
}
