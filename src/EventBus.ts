export class EventBus {
    private listeners: Map<string, Listener<Event>[]> = new Map()

    // TODO make use of: typeof key
    register<E extends Event>(eventId: string, listener: Listener<E>) {
        console.log("register listener for: " + eventId);
        if (!this.listeners.has(eventId)) {
            this.listeners.set(eventId, new Array<Listener<Event>>())
        }
        this.listeners.get(eventId)!.push(listener as Listener<Event>);
    }

    dispatch<E extends Event>(event: E) {
        console.log("dispatching:", event);
        this.listeners.get(event.id)!.forEach((it: Listener<E>) => {
            it(event);
        });
    }
}

interface Listener<E extends Event> {
    (event: E): void
}

export interface Event {
    readonly id: string;
}
