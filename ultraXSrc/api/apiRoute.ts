import { ApiFunctionHandler } from './apiFunctionHandler';
import ApiTemplate from './apiTemplate';

export default interface ApiRoute {
    apiFn: ApiFunctionHandler;
    route?: string;
    method?: string;
    template?: ApiTemplate;
}

export function createRoute(route: string, method: string, apiFn: ApiFunctionHandler, template?: ApiTemplate): ApiRoute {

    return {
        apiFn: apiFn,
        route: route,
        method: method,
        template: template
    }

}