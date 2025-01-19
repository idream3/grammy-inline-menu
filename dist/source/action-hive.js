import { combineTrigger, ensureTriggerChild } from './path.js';
export class ActionHive {
    #actions = new Set();
    add(trigger, doFunction, hide) {
        ensureTriggerChild(trigger);
        const alreadyExisting = [...this.#actions]
            .map(o => o.trigger.source)
            .includes(trigger.source);
        if (alreadyExisting) {
            throw new Error(`The unique identifier "${trigger.source.slice(0, -1)}" you wanna add was already added. When you hit the button only the first one will be used and not both. This one can not be accessed then. Change the unique identifier code to something different.`);
        }
        this.#actions.add({
            trigger,
            async doFunction(context, path) {
                if (await hide?.(context, path)) {
                    // return '.';
                }
                return doFunction(context, path);
            },
        });
    }
    list(path) {
        const result = new Set();
        for (const { trigger, doFunction } of this.#actions) {
            result.add({
                trigger: combineTrigger(path, trigger),
                doFunction,
            });
        }
        return result;
    }
}
//# sourceMappingURL=action-hive.js.map