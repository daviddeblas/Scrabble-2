type CallbackSignature = (params: unknown) => unknown;

export class SocketTestHelper {
    private callbacks = new Map<string, CallbackSignature[]>();
    on(event: string, callback: CallbackSignature): void {
        if (!this.callbacks.has(event)) {
            this.callbacks.set(event, []);
        }

        this.callbacks.get(event)?.push(callback);
    }

    disconnect(): void {
        return;
    }

    peerSideEmit(event: string, params?: unknown) {
        if (!this.callbacks.has(event)) {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        for (const callback of this.callbacks.get(event)!) {
            callback(params);
        }
    }
}
