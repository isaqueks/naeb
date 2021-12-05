import { HTTPFunctionHandler } from './httpFunctionHandler';
import HTTPRouteTemplate from './httpTemplate';
declare type ExpressHTTPMethod = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';
/**
 * The default export each route
 * should have
 */
export default interface HTTPRoute {
    /**
     * @deprecated use `handler` instead;
     */
    apiFn?: HTTPFunctionHandler;
    /**
     * The route handler function
     */
    handler: HTTPFunctionHandler;
    /**
     * The route URL (Relative path will be used if not specified)
     */
    route?: string;
    /**
     * The HTTP method
     */
    method?: ExpressHTTPMethod;
    /**
     * Optional - The template function.
     * A template function may add extra stuff
     * to the returned value, and may also
     * respond the request with the thrown error
     * if any.
     * respondJSON and respondPlain are templates.
     * If not specified, respondJSON would be used.
     */
    template?: HTTPRouteTemplate | HTTPRouteTemplate[];
}
export {};
