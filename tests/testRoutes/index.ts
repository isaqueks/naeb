import HTTPRoute from "../../ultraXSrc/api/httpRoute";

const route: HTTPRoute = {
    handler: (req, res) => 'Hello World',
    method: "GET",
    route: "/test_route"
}

export default route;