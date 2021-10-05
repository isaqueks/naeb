#  ultraXFramework

Simple framework providing all the boilerplate stuff for an express-based server

<hr>

### You can read the [Type documentation](https://isaqueks.github.io/ultraX/)

## Functionality

ultraX provides a lot of boilerplate stuff that you would write manually if using only express. Also, it comes with [GenericCrud](https://github.com/isaqueks/genericCrud/) and [PowerSQL](https://github.com/isaqueks/powersql) installed.

It does/includes:

* Express boilerplate interface:
    ```js
    const PORT = 3000;

    const server = new UltraX(PORT, path.join(__dirname, './routes'));
    server
        .useBodyParser()
        .useCors()
        .useFileUpload()
        .listen(() => console.log(`Server listening at http://localhost:${PORT}`))

    ```

* [SQL building engine (PowerSQL)](https://github.com/isaqueks/powersql)

* Generic Typed-CRUD System
	* For setting up a new CRUD, instantiate the `SimpleCrud` class (or create your own class from `Crud` base).
	* Tutorial:
		* First, the model object needs to be defined:
		*   ```ts 
              const userModel = new ObjectModel([
                  new Field('id', 'INTEGER', ['PRIMARY KEY']),
                  new Field('name', 'TEXT', ['NOT NULL']),
                  new Field('email', 'TEXT'),
              ]);
            ```
		* Secondly, the Crud object needs to be created:
		* `const userCrud = new SimpleCrud<User>(database,  userModel,  'userTableName');`
		* Then, check `SimpleCrud` methods.
        * Note: If using JavaScript, create an instance of `SimpleCrud` without generics `<T>`, as it is only allowed in TypeScript.

* Route management:
	* By specifying the route directory to UltraX constructor, all routes TypeScript files inside the directory will be used as routes.
    * Example route (`routes/example.ts`): 
    ```ts
    import express = require('express');

    function fn(req: express.Request, res: express.Response) {

        return 'It is working (-:'

    }

    module.exports = {
        method: 'get',
        apiFn: fn,
    } 
    ```
    If you make a GET request to `<host>/example`, you should see
    ```json
    { 
        "success": true, 
        "result": "It is working (-:" 
    }
    ```
    If you want to remove the extra data from the response (`{ success: ..., result: ... }`), simply set `template` to `respondPlain` at the route module:
    ```js
    module.exports = {
        method: 'get',
        apiFn: fn,
        /* 
        respondPlain will respond the request with the returned content or error, without any extra processing! 
        */
        template: respondPlain
    }
    ```
    Check: [ApiRoute reference](https://isaqueks.github.io/ultraX/interfaces/ApiRoute.html)

## How to setup

1. `npm install https://github.com/isaqueks/ultraX.git#release`
2. Add the [example](#example) code to your index file
3. Be happy (-:

## Example

```ts
import path = require('path');
import UltraX from '.';

const PORT = 3000;

const server = new UltraX(PORT, path.join(__dirname, './routes'));
server
    .useBodyParser()
    .useCors()
    .useFileUpload()
    .listen(() => console.log(`Server listening at http://localhost:${PORT}`))

```

Like express, you can use middlewares (it contains proxy methods to express app basically):

`server.get(req, res, next)`, `server.post(...)` and `server.use(...)`
Check [UltraX class](https://isaqueks.github.io/ultraX/classes/default.html)