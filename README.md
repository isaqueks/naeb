# ultraXFramework
Simple framework providing all the boilerplate stuff for an express-based server   
<hr>
## Functionality
ultraX provides a lot of boilerplate stuff that you would write
manually if using only express.   
It does/includes:
 * [SQL building engine (PowerSQL)](https://github.com/isaqueks/powersql)  
 * Generic Typed-CRUD System 
 * Route management:
   * By using `manageRoutes(app: Express, routesDir: string)`, ultraX will automatically attach routes inside `routesDir` to `app`.
   * No need for `res.json(jsonResponse)`. Just by using `return jsonResponse` in route's main function, ultraX will do all the stuff and the response (body) will be like `{ success: true, result: jsonResponse }`.
   * If an error is thrown, the response will look like `{ success: false, error: '...' }`