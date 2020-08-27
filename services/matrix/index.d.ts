/// <reference types="node" />
import * as loglvl from 'loglevel';
import * as mx from 'matrix-js-sdk/lib/matrix';
import { ValidateFunction } from 'ajv';
import MainWorker from '../../index';
import { Service, ServiceDescriptor } from '../service';
import * as AccountsService from '../accounts';
import * as AppsService from '../apps';
import { GeneratorListener, MapGeneratorListener } from '../../generatorlistener';
import { OptionalSerializable } from '../../storage';
import { Serializable } from 'child_process';
import { AppDetails } from '../apps';
declare type AccountState = 'UNAUTHENTICATED' | 'INACTIVE' | 'STARTING' | 'ACTIVE' | 'OFFLINE';
declare type ClientState = {
    id: string;
    mxid: string;
    display_name: string;
    avatar?: ArrayBuffer;
    state: AccountState;
} | {
    state: 'UNAUTHENTICATED';
};
declare type RoomInfo = {
    id: string;
    name: string;
    canon_alias?: string;
    avatar_url?: string;
    type?: string;
};
interface RemoteV0 {
    getHsUrl: {
        [mxid: string]: () => Promise<string>;
    };
    fromToken: {
        [mxid: string]: () => (token: string, hs?: string) => Promise<string>;
    };
    fromPass: {
        [mxid: string]: () => (pw: string, hs?: string) => Promise<string>;
    };
    [account: string]: {
        start(): Promise<void>;
        stop(): Promise<boolean>;
        listenUserState(): AsyncGenerator<ClientState, void, void>;
        listenRoomList(opts: {
            avatar?: {
                width: number;
                height: number;
            };
        }): AsyncGenerator<RoomInfo[], void, void>;
    } | RemoteV0['getHsUrl'] | RemoteV0['fromToken'] | RemoteV0['fromPass'];
}
interface Remote {
    v0: RemoteV0;
}
declare type AccountDataType = {
    [k: string]: OptionalSerializable;
};
declare type AccountDataEntry = undefined | AccountDataType;
interface AppGenSet {
    detailgen: AsyncGenerator<AppDetails | undefined, void, void>;
    permgen: AsyncGenerator<string[], void, void>;
}
declare class MatrixInstance {
    readonly parent: ServiceClass;
    readonly account_id: string;
    client: mx.MatrixClient | undefined;
    readonly room_list: GeneratorListener<mx.Room[]>;
    readonly user_ad: MapGeneratorListener<AccountDataEntry>;
    protected app_list_gen?: AsyncGenerator<string[], void, void>;
    protected readonly app_gens: {
        [key: string]: AppGenSet;
    };
    constructor(parent: ServiceClass, account_id: string);
    get active(): boolean;
    getAdGenerator(type: string): AsyncGenerator<AccountDataEntry, void, void>;
    _processAppConfig(id: string, obj: Serializable): void;
    _setupRoomList(): void;
    onAppUpdate(url: string, doUndef: boolean): void;
    _setupAppAdUpdater(): void;
    _setupAccountData(): void;
    createClient(opts: mx.CreateClientOption): mx.MatrixClient;
    stopClient(): void;
}
declare class ServiceClass implements Service {
    protected readonly parent: MainWorker;
    readonly log: loglvl.Logger;
    protected readonly account_svc: AccountsService.ServiceClass;
    readonly apps_svc: AppsService.ServiceClass;
    protected readonly state_listeners: {
        [uid: string]: GeneratorListener<AccountState>;
    };
    protected readonly instances: {
        [uid: string]: MatrixInstance;
    };
    readonly validateAppConfig: ValidateFunction;
    constructor(parent: MainWorker, log: loglvl.Logger);
    getInstance(uid: string): MatrixInstance;
    getHsUrl(mxid: string): Promise<string>;
    fromToken(mxid: string, token: string, hs?: string): Promise<string>;
    fromPass(user: string, pw: string, hs?: string): Promise<string>;
    start(account_id: string): Promise<void>;
    stop(id: string): Promise<boolean>;
    ensureAccountStateExists(id: string): Promise<void>;
    updateAccountState(id: string, state?: AccountState): Promise<void>;
    listenUserState(id: string): AsyncGenerator<ClientState, void, void>;
    listenRoomList(id: string, opts?: {
        avatar?: {
            width: number;
            height: number;
        };
    }): AsyncGenerator<RoomInfo[], void, void>;
    sendAccountData(id: string, type: string, data: AccountDataType): Promise<void>;
    listenAccountDataKeys(id: string): AsyncGenerator<string[], void, void>;
    listenAccountData(id: string, type: string): AsyncGenerator<AccountDataEntry, void, void>;
}
declare const MatrixService: ServiceDescriptor;
export default MatrixService;
export { ServiceClass, Remote };
