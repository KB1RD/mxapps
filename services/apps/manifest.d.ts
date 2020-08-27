import { SemverVersion } from '../service';
declare namespace AppManifest {
    interface Base {
        manifest_version: number;
    }
    type LocalizedObject = {
        [locale: string]: string;
    };
    namespace LocalizedObject {
        function getLocalized(obj: LocalizedObject, ...locales: string[]): string | undefined;
        const Schema: {
            type: string;
            additionalProperties: {
                type: string;
            };
        };
    }
    interface V0 extends Base {
        manifest_version: 0;
        default_locale?: string;
        title: LocalizedObject;
        description?: LocalizedObject;
        version: SemverVersion;
        entry_points: {
            [context: string]: {
                to: string;
            };
            ['net.kb1rd.openroom']: {
                to: string;
                types: string[];
            };
        };
        request_permissions: string[];
    }
    namespace V0 {
        const Schema: {
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
        };
    }
    type Known = V0;
    namespace Known {
        const Schema: {
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
    }
}
export default AppManifest;
