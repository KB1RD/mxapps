import * as loglvl from 'loglevel';
import * as Ajv from 'ajv';
import { GeneratorListener } from '../generatorlistener';
import MainWorker from '../index';
import { Service, ServiceDescriptor } from './service';
import { OptionalSerializable } from '../storage';
declare type AjvSchema = {};
declare class Account {
    readonly uid: string;
    readonly parent: ServiceClass;
    constructor(uid: string, parent: ServiceClass);
    storageGet(key: string): Promise<OptionalSerializable>;
    storageSet(key: string, value: OptionalSerializable): Promise<void>;
    storageGetSchema<T>(key: string, schema: AjvSchema, def?: T): Promise<T>;
}
interface RemoteV0 {
    createAccount(): Promise<string>;
    getAccounts(): Promise<string>;
    listenAccounts(): AsyncGenerator<string[], void, void>;
    [account: string]: {
        exists(): Promise<boolean>;
    } | RemoteV0['createAccount'] | RemoteV0['getAccounts'] | RemoteV0['listenAccounts'];
}
interface Remote {
    v0: RemoteV0;
}
declare class ServiceClass implements Service {
    readonly parent: MainWorker;
    protected readonly log: loglvl.Logger;
    map: GeneratorListener<{
        [uid: string]: Account;
    }>;
    has_lazy_loaded: boolean;
    known_data_schema_validators: WeakMap<AjvSchema, Ajv.ValidateFunction>;
    constructor(parent: MainWorker, log: loglvl.Logger);
    lazyLoadAccounts(force?: boolean): Promise<void>;
    saveAccountList(): Promise<void>;
    createAccount(): Promise<string>;
    getAccounts(): Promise<string[]>;
    listenAccounts(): AsyncGenerator<string[], void, void>;
    exists(name: string): Promise<boolean>;
    getAccount(name: string): Account;
}
declare const AccountsService: ServiceDescriptor;
export default AccountsService;
export { ServiceClass, Remote };
