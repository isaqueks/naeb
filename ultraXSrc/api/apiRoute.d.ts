import { ApiFunctionHandler } from './apiFunctionHandler';
import ApiTemplate from './apiTemplate';
/**
 * The default export each route
 * should have
 */
export default interface ApiRoute {
    /**
     * The route handler function
     */
    apiFn: ApiFunctionHandler;
    /**
     * The route URL (Relative path will be used if not specified)
     */
    route?: string;
    /**
     * The HTTP method
     */
    method?: 'get' | 'post' | 'all';
    /**
     * Optional - The template function.
     * A template function may add extra stuff
     * to the returned value, and may also
     * respond the request with the thrown error
     * if any.
     * respondJSON and respondPlain are templates.
     * If not specified, respondJSON would be used.
     */
    template?: ApiTemplate;
}
