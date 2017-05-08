/**
 * Created by Carl on 2017-05-08.
 */
const jsforce = require("jsforce");
const secrets = require("../secrets/secrets.js");

function createQuery(queryString, success, error){
    const conn = new jsforce.Connection();

    conn.login(secrets.SF_USER, secrets.SF_PASSWORD, function(err, res) {
        if (err) {
            return console.error(err);
        }
        // callback(connection, response);

        //'SELECT Id, FirstName, LastName, primary_community__c, FullPhotoUrl FROM User'
        conn.query(queryString, function(err, res) {
            if (err) {
                error(err);
                return console.error(err);
            }

            success(res);
        });
    });
}

module.exports = {
    createQuery: createQuery
};
