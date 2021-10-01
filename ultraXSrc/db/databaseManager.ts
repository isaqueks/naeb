const sqlLite3 = require('sqlite3').verbose();

export default function Database(dbFile: any) {
	var db = new sqlLite3.Database(dbFile, (err) => {
		if (err) {
			console.error('Could not connect to database', err);
			return;
		} else {
			console.log('Using the built-in UltraX SQLite3 database');
		}
	});
	return {
		db: db,
		promise: function (query: string, params?: Array<any> | any): Promise<any[]> {
			if (params && !Array.isArray(params)) {
				params = [params];
			}
			return new Promise((resolve, reject) => {
				db.all(query, params, (err, data) => {

					if (err)
						reject(err);
					else
						resolve(data);

				})
			});
		}
	}
}