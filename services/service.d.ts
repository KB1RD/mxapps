import { MultistringAddress } from 'rpcchannel';
import * as loglvl from 'loglevel';
import MainWorker from '../index';
declare type SemverVersion = [number, number, number];
declare namespace SemverVersion {
    const Schema: {
        type: string;
        items: {
            type: string;
        };
        minItems: number;
        maxItems: number;
    };
    const toString: (v: SemverVersion) => string;
}
declare type MinimumSemver = [number, number];
declare namespace MinimumSemver {
    const Schema: {
        type: string;
        items: {
            type: string;
        };
        minItems: number;
        maxItems: number;
    };
    const toString: (v: MinimumSemver) => string;
}
interface ServiceRequest {
    id: MultistringAddress;
    versions: MinimumSemver[];
}
declare namespace ServiceRequest {
    const Schema: {
        type: string;
        properties: {
            id: {
                type: string;
                items: {
                    type: string;
                };
            };
            versions: {
                type: string;
                items: {
                    type: string;
                    items: {
                        type: string;
                    };
                    minItems: number;
                    maxItems: number;
                };
            };
        };
        required: string[];
    };
}
interface ServiceResponse {
    id: MultistringAddress;
    version: SemverVersion;
}
interface Service {
}
interface ServiceOpts {
    createChildLogger(name: string): loglvl.Logger;
}
declare type ServiceConstructor = {
    new (worker: MainWorker, log: loglvl.Logger, opts: ServiceOpts): Service;
    [key: string]: any;
};
interface ServiceVersionDescriptor {
    readonly version: SemverVersion;
}
interface ServiceDescriptor {
    readonly id: MultistringAddress;
    readonly service: ServiceConstructor;
    readonly versions: ServiceVersionDescriptor[];
}
declare function prefixServiceRpc(service: ServiceDescriptor): ServiceDescriptor;
export { SemverVersion, MinimumSemver, Service, ServiceOpts, ServiceConstructor, ServiceDescriptor, ServiceVersionDescriptor, ServiceRequest, ServiceResponse, prefixServiceRpc };
