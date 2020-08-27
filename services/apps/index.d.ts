import * as loglvl from 'loglevel';
import { ValidateFunction } from 'ajv';
import { GeneratorListener, MapGeneratorListener } from '../../generatorlistener';
import MainWorker from '../../index';
import { Service, ServiceDescriptor, SemverVersion } from '../service';
import * as Permissions from './permissions';
import Manifest from './manifest';
declare class App {
    readonly manifest_url: string;
    readonly cached_manifest: Manifest.Known;
    readonly permissions: GeneratorListener<string[]>;
    constructor(manifest_url: string, cached_manifest: Manifest.Known);
    getLocalized(obj: Manifest.LocalizedObject): string;
    getTitle(): string;
    getDescription(): string | undefined;
    getVersion(): SemverVersion;
    copyTo(other: App): void;
    toJSON(): App.JSON;
}
declare namespace App {
    type JSON = {
        permissions: string[];
        manifest_url: string;
        cached_manifest: Manifest.Known;
    };
    const Schema: {
        type: string;
        properties: {
            permissions: {
                type: string;
                items: {
                    type: string;
                };
            };
            manifest_url: {
                type: string;
            };
            cached_manifest: {
                type: string;
                oneOf: {
                    type: string;
                    properties: {
                        manifest_version: {
                            type: string;
                            minimum: number;
                            maximum: number;
                        };
                        default_locale: {
                            type: string;
                        };
                        title: {
                            type: string;
                            additionalProperties: {
                                type: string;
                            };
                        };
                        version: {
                            type: string;
                            items: {
                                type: string;
                            };
                            minItems: number;
                            maxItems: number;
                        };
                        description: {
                            type: string;
                            additionalProperties: {
                                type: string;
                            };
                        };
                        entry_points: {
                            type: string;
                            properties: {
                                'net.kb1rd.openroom': {
                                    type: string;
                                    properties: {
                                        to: {
                                            type: string;
                                        };
                                        types: {
                                            type: string;
                                            items: {
                                                type: string;
                                            };
                                        };
                                    };
                                    required: string[];
                                };
                            };
                            additionalProperties: {
                                type: string;
                                properties: {
                                    to: {
                                        type: string;
                                    };
                                };
                                required: string[];
                            };
                        };
                        request_permissions: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                    };
                    required: string[];
                }[];
            };
        };
        required: string[];
    };
}
interface Association {
    to: string;
}
interface AppDetails {
    version: SemverVersion;
    title: string;
    description?: string;
}
interface ManifestResponse {
    manifest: Manifest.Known;
    known_permissions: {
        [key: string]: {
            inherits: string[];
        };
    };
    unknown_permissions: string[];
}
interface TokenContext {
    port: MessagePort;
    context: Permissions.Context;
    clear: () => void;
}
interface RemoteV0 {
    placeholder: string;
}
interface Remote {
    v0: RemoteV0;
}
declare class ServiceClass implements Service {
    protected readonly parent: MainWorker;
    protected readonly log: loglvl.Logger;
    readonly validateManifest: ValidateFunction;
    readonly validateAppConfig: ValidateFunction;
    readonly known_apps: {
        [account: string]: MapGeneratorListener<App>;
    };
    readonly associations: {
        [account: string]: MapGeneratorListener<Association>;
    };
    readonly app_tokens: Map<string, TokenContext>;
    constructor(parent: MainWorker, log: loglvl.Logger);
    getAccount(id: string): MapGeneratorListener<App>;
    getAssocTable(id: string): MapGeneratorListener<Association>;
    pushApp(id: string, app: App): void;
    fetchAndVerifyManifest(url: string): Promise<ManifestResponse>;
    setupApp(ac_id: string, url: string, manifest: Manifest.Known): Promise<void>;
    listenApps(ac_id: string): AsyncGenerator<string[], void, void>;
    listenAppManifest(ac_id: string, url: string): AsyncGenerator<Manifest.Known | undefined, void, void>;
    listenAppDetails(ac_id: string, url: string): AsyncGenerator<AppDetails | undefined, void, void>;
    setPermissions(ac_id: string, url: string, permissions: {
        [key: string]: boolean;
    }): void;
    listenPermissions(ac_id: string, url: string): AsyncGenerator<string[], void, void>;
    setAssociation(ac_id: string, id: string, to: string | undefined): void;
    listenAssociation(ac_id: string, id: string): AsyncGenerator<Association | undefined, void, void>;
    listenAssociations(ac_id: string): AsyncGenerator<{
        [key: string]: Association;
    }, void, void>;
    setupEntryChannel(account_id: string, app_url: string, entry: string, provided_ctx: Permissions.Context.Base): {
        token: string;
        timeout: number;
    };
    redeemEntryToken(token: string): {
        port: MessagePort;
        context: Permissions.Context;
    };
}
declare const AppsService: ServiceDescriptor;
export default AppsService;
export { ServiceClass, Remote, App, AppDetails };
