import { ApiFunctionHandler } from './apiFunctionHandler';
import ApiTemplate from './apiTemplate';
export default interface ApiRoute {
    apiFn: ApiFunctionHandler;
    route?: string;
    method?: string;
    template?: ApiTemplate;
}
