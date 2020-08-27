import { AddressMap, AccessPolicy } from 'rpcchannel';
export declare namespace Context {
    type Base = {
        account_id?: string;
        app_url?: string;
        room_id?: string;
        [key: string]: any;
    };
    namespace Base {
        const Schema: {
            type: string;
            properties: {
                account_id: {
                    type: string;
                };
                app_id: {
                    type: string;
                };
                room_id: {
                    type: string;
                };
            };
        };
    }
    const Schema: {
        required: string[];
        type: string;
        properties: {
            account_id: {
                type: string;
            };
            app_id: {
                type: string;
            };
            room_id: {
                type: string;
            };
        };
    };
}
export interface Context extends Context.Base {
    account_id: string;
    app_url: string;
}
export declare type Permission = {
    grantOn(map: AddressMap<AccessPolicy>, ctx: Context): void;
    inherits: string[];
};
declare type PermissionTable = {
    [id: string]: Permission;
};
declare const available_permissions: PermissionTable;
export default available_permissions;
