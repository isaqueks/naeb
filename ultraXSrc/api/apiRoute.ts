import { ApiFunctionHandler } from './apiFunctionHandler';
import ApiTemplate from './apiTemplate';

/**
 * The default export each route
 * should have
 */
export default interface ApiRoute {
    apiFn: ApiFunctionHandler;
    route?: string;
    method?: string;
    template?: ApiTemplate;
}