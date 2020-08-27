import * as rpc from 'rpcchannel';
import Ajv from 'ajv';
import * as loglvl from 'loglevel';
import * as request from 'request';
import { ServiceConstructor, ServiceDescriptor, ServiceVersionDescriptor, SemverVersion, ServiceRequest, ServiceResponse, MinimumSemver, Service } from './services/service';
import * as AccountsServiceExports from './services/accounts';
import * as MatrixServiceExports from './services/matrix';
import * as AppsServiceExports from './services/apps';
import { KvStorageBackend } from './storage';
declare type RequestFunc = request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl>;
interface BaseWorker {
    onconnect(port: MessagePort): void;
    onmessage(e: MessageEvent): void;
    onmessageerror(e: MessageEvent): void;
    onoffline(): void;
    ononline(): void;
}
interface ServicesRemote {
    requestServices(...requests: ServiceRequest[]): Promise<ServiceResponse[]>;
}
declare class MainWorker implements BaseWorker {
    ajv: Ajv.Ajv;
    protected readonly log: loglvl.Logger;
    protected readonly registry: rpc.RpcHandlerRegistry;
    protected readonly channels: Map<MessagePort, rpc.RpcChannel>;
    readonly services: Set<ServiceDescriptor>;
    readonly services_active: Set<ServiceVersionDescriptor>;
    readonly service_instaces: Map<ServiceConstructor, Service>;
    protected readonly createLog: (name: string) => loglvl.Logger;
    readonly storage_backend: KvStorageBackend;
    readonly request: RequestFunc;
    readonly validateMsg: Ajv.ValidateFunction;
    constructor({ createLog, storage_backend, request }: {
        createLog: (name: string) => loglvl.Logger;
        storage_backend: KvStorageBackend;
        request: RequestFunc;
    });
    getRpcChannel(port: MessagePort, policy?: rpc.AccessPolicy): rpc.RpcChannel;
    onconnect(port: MessagePort): void;
    ondisconnect(port: MessagePort): void;
    onmessage(e: MessageEvent): void;
    onmessageerror(e: MessageEvent): void;
    onoffline(): void;
    ononline(): void;
    registerService(service: ServiceDescriptor): void;
    setupServiceVersion(service: ServiceDescriptor, req: SemverVersion | MinimumSemver): SemverVersion | undefined;
    getService(id: rpc.MultistringAddress): ServiceDescriptor | undefined;
    getServiceDependency(id: rpc.MultistringAddress, req: SemverVersion | MinimumSemver): Service;
    requestServices(...requests: ServiceRequest[]): ServiceResponse[];
}
export default MainWorker;
interface Remote {
    net: {
        kb1rd: {
            services: ServicesRemote;
            accounts: AccountsServiceExports.Remote;
            mxbindings: MatrixServiceExports.Remote;
            apps: AppsServiceExports.Remote;
        };
    };
}
export { BaseWorker, Remote };
