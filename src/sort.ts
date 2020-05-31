import {Event} from "./EventBus";
import {Article} from "./domain";
import IndexHtml from "./view/IndexHtml";

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
        new SortOption("created", "▶️ recently created️", SortOptions.byCreated),
        new SortOption("updated", "⏩ recently updated️", SortOptions.byUpdated),
        new SortOption("title", "🔤 title", SortOptions.byTitle),
        new SortOption("likes", IndexHtml.LikeSymbol + "️ likes️", SortOptions.byLikes),
        new SortOption("tags", "📶 tags", SortOptions.byTags)
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

    // FILTERS
    private static byCreated(a1: Article, a2: Article): number {
        return a1.created.getTime() - a2.created.getTime();
    }

    private static byUpdated(a1: Article, a2: Article): number {
        return a1.updated.getTime() - a2.updated.getTime();
    }

    private static byTitle(a1: Article, a2: Article): number {
        return a2.title.localeCompare(a1.title);
    }

    private static byLikes(a1: Article, a2: Article): number {
        return SortOptions.byThisOrThat(a1, a2,
            a1.likes - a2.likes,
            SortOptions.byTitle);
    }

    private static byTags(a1: Article, a2: Article): number {
        return SortOptions.byThisOrThat(a1, a2,
            a2.tags.length - a1.tags.length,
            SortOptions.byCreated);
    }

    private static byThisOrThat(a1: Article, a2: Article, result: number, alternative: (a1: Article, a2: Article) => number): number {
        if (result != 0) {
            return result;
        }
        return alternative(a1, a2);
    }
}
