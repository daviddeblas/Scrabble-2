// Fichier issu de l'exemple du cours de socketIo
// https://gitlab.com/nikolayradoev/socket-io-exemple/-/tree/master

/* eslint-disable no-unused-vars */
type CallbackSignature = (params: unknown) => unknown;

export class SocketTestHelper {
    private callbacks = new Map<string, CallbackSignature[]>();
    on(event: string, callback: CallbackSignature): void {
        if (!this.callbacks.has(event)) {
            this.callbacks.set(event, []);
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.callbacks.get(event)!.push(callback);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    emit(event: string, ...params: any): void {
        return;
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
