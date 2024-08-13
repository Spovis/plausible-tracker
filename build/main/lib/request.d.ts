declare type CallbackArgs = {
    readonly status: number;
};
export declare type EventOptions = {
    /**
     * Callback called when the event is successfully sent.
     */
    readonly callback?: (args: CallbackArgs) => void;
    /**
     * Properties to be bound to the event.
     */
    readonly props?: {
        readonly [propName: string]: string | number | boolean;
    };
};
export {};
