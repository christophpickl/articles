import {Event} from "../EventBus";

export class CreateEvent implements Event {
    static readonly ID = "CreateEvent"
    readonly id = CreateEvent.ID;
}

export class UpdateEvent implements Event {
    static readonly ID = "UpdateEvent"
    readonly id = UpdateEvent.ID;
}

export class DeleteEvent implements Event {
    static readonly ID = "DeleteEvent"
    readonly id = DeleteEvent.ID;
}
