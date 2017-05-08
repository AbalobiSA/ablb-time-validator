/*============================================================================
    Imports
 ============================================================================*/
let salesforce = require("./components/mod_salesforce.js");
let fs = require("fs");
let odk = require("./components/mod_odk.js");
let postgres = require("./components/mod_postgress.js");

/*============================================================================
    Globals
 ============================================================================*/

let TIMEOUT_MILIS = 3000;

/*============================================================================
    Run
 ============================================================================*/

main();

/*============================================================================
    Driver
 ============================================================================*/

function main(){
    console.log("Abalobi Response Time Checker");
    postToAggregate();
}

/*============================================================================
    Test Functions
 ============================================================================*/

function queryUsers(){
    console.log("Creating Query...");
    let query = "SELECT Id, FirstName, LastName, primary_community__c, FullPhotoUrl FROM User ";
    salesforce.createQuery(query, function(response){
        fs.writeFile("output.json", JSON.stringify(response, null, 4), function(){
            console.log("FILE WRITTEN!");
        })
    }, function(error){
        console.log(error);
    });
}

function query_ODK_ID(input){
    console.log("Creating Query...");
    let query = "SELECT Id, FirstName, LastName, primary_community__c, FullPhotoUrl FROM Ablb_Fisher_Trip__c ";
    salesforce.createQuery(query, function(response){
        fs.writeFile("output.json", JSON.stringify(response, null, 4), function(){
            console.log("FILE WRITTEN!");
        })
    }, function(error){
        console.log(error);
    });
}

/*============================================================================
    OpenFn - Submit Trip
 ============================================================================*/

function postToAggregate(){
    console.log("Posting a fake entry to ODK Aggregate...");
    try{
        odk.post(function(response, odkID){
            if (response.statusCode === 200){
                console.log("ODK Post Successful!");
                queryPostGres(`'uuid:faketrip${odkID}'`);
            }
        });
    } catch (ex){
        console.log("Post unsuccessful!");
    }

    // This will always fail, if you want to test failure
    // queryPostGres("'uuid:faketrip06a2f45b-9529-0c85-b999-b54768056d6dx'", { showDebugOutput: true });
}

/*============================================================================
    Heroku - Query Database
 ============================================================================*/

function queryPostGres(odkID, config){
    let PGQUERY = `SELECT * FROM salesforce.ablb_fisher_trip__c WHERE odk_uuid__c LIKE ${odkID}`;
    let options = config || {};

    if (!config){
        options.showDebugOutput = true;
    }

    if (options.showDebugOutput){
        console.log("\n\nQuerying Heroku Connect...");
        console.log(`Query: ${PGQUERY}`);
    }

    postgres.query(PGQUERY, null, function(err, res) {
        if(err) {
            return console.error('error running query', err);
        }

        // console.log('number:', res);
        function queryAgain(){
            recalculateTimeout();
            queryPostGres(odkID, { showDebugOutput: false });
        }


        if (res.rowCount === 0) {
            console.log(`No results received, checking again in ${ TIMEOUT_MILIS/1000 } seconds.`);

            setTimeout(queryAgain , TIMEOUT_MILIS);


        } else {
            fs.writeFile("heroku_response.json", JSON.stringify(res, null, 4), function(){
                console.log("Heroku query successful! Check heroku_response.json");
                console.log("Heroku query successful! Printing results:\n");
                console.log(`Salesforce ID: ${res.rows[0].sfid}\n` + `Main Fisher ID: ${res.rows[0].main_fisher_id__c}`);
                postgres.close();
            });
        }
    });
}

function recalculateTimeout(){
    // console.log(`Timeout Value: ${TIMEOUT_MILIS}`);
    switch (true){
        case (TIMEOUT_MILIS >= 3000 && TIMEOUT_MILIS < 18000): TIMEOUT_MILIS += 3000;
        break;
        case (TIMEOUT_MILIS >= 18000 && TIMEOUT_MILIS < 30000): TIMEOUT_MILIS += 5000;
        break;
    }
    if (TIMEOUT_MILIS >= 30000){
        TIMEOUT_MILIS = 30000;
    }
    // console.log(`Recalculated to: ${TIMEOUT_MILIS}`);
}
