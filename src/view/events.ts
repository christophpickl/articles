import {Event} from "../EventBus";
import {Article} from "../domain";

export class CreateEvent implements Event {
    static readonly ID = "CreateEvent"
    readonly id = CreateEvent.ID;
}

export class UpdateEvent implements Event {
    static readonly ID = "UpdateEvent"
    readonly id = UpdateEvent.ID;
}

/** depending on current state, either create OR update */
export class SaveEvent implements Event {
    static readonly ID = "SaveEvent"
    readonly id = SaveEvent.ID;
}

export class DeleteEvent implements Event {
    static readonly ID = "DeleteEvent"
    readonly id = DeleteEvent.ID;
}

export class EditArticleEvent implements Event {
    static readonly ID = "EditArticleEvent"
    readonly id = EditArticleEvent.ID;
    constructor(
        public readonly article: Article
    ) {
    }
}

export class CancelEditArticleEvent implements Event {
    static readonly ID = "CancelEditArticleEvent"
    readonly id = CancelEditArticleEvent.ID;
}

export class CancelSearchEvent implements Event {
    static readonly ID = "CancelSearchEvent"
    readonly id = CancelSearchEvent.ID;
}
export class SearchEvent implements Event {
    static readonly ID = "SearchEvent"
    readonly id = SearchEvent.ID;
    constructor(
        public readonly term: string
    ) {
    }
}