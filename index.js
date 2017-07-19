/*============================================================================
    Imports
 ============================================================================*/
let salesforce = require("./components/mod_salesforce.js");
let fs = require("fs");
let odk = require("./components/mod_odk.js");
let postgres;
let winston = require("winston");

/*============================================================================
    Setup Winston
 ============================================================================*/

winston.add(winston.transports.File, {
    filename: './logs/abalobi_pg_timer.log',
    maxsize: 200000
});

winston.remove(winston.transports.Console);

/*============================================================================
    Globals
 ============================================================================*/

let TIMEOUT_MILIS;
let PROCESS_START_TIME;
let PROCESS_END_TIME;
let QUERY_ITERATOR;

let PATH_LOGS;

/*============================================================================
    Run
 ============================================================================*/

// main();
// init();
// runTest();

/*============================================================================
    Driver
 ============================================================================*/

function init() {
    try{
        postgres = require("./components/mod_postgress.js");
    } catch (ex){
        console.log("FAILED TO INITIALIZE POSTGRES! \n" + ex);
    }

    console.log("Initialized abalobi time checker");
    QUERY_ITERATOR = 0;
    TIMEOUT_MILIS = 1000;


}

function runTest(){
    console.log((new Date().getTime()) + " Running - Abalobi Response Time Checker");
    QUERY_ITERATOR = 0;
    TIMEOUT_MILIS = 1000;

    postToAggregate();
}


/*============================================================================
    OpenFn - Submit Trip
 ============================================================================*/

/**
 * Makes a fake post to aggregate and initiates the recursive
 * Query to postgres.
 */
function postToAggregate(){
    console.log("Posting a fake entry to ODK Aggregate...");
    try{
        odk.post(function(response, odkID){
            if (response.statusCode === 200){
                console.log("ODK Post Successful!");
                startTimer();
                queryPostGres(`'uuid:faketrip${odkID}'`);
            }
        });
    } catch (ex){
        console.log("Post unsuccessful!");
        winston.log("debug" , elapsed_time("failure"));
    }

    // This will always fail, if you want to test failure
    // queryPostGres("'uuid:faketrip06a2f45b-9529-0c85-b999-b54768056d6dx'", { showDebugOutput: true });
}

/*============================================================================
    Heroku - Query Database
 ============================================================================*/

/**
 * Will query postgress recursively for the record with the provided ODK UUID
 * @param odkID
 * @param config
 */
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
            winston.log("debug" , elapsed_time("failure"));
            // postgres.close();
            return console.error('error running query', err);
        }

        // console.log('number:', res);
        function queryAgain(){
            recalculateTimeout();
            queryPostGres(odkID, { showDebugOutput: false });
        }

        if (res.rowCount === 0) {
            console.log(`No results received, checking again in ${ TIMEOUT_MILIS/1000 } seconds.`);
            if (QUERY_ITERATOR < 20){
                setTimeout(queryAgain , TIMEOUT_MILIS);
            } else {
                // Stop
                winston.log("debug" , elapsed_time("failure"));
                // postgres.close();

            }

        } else {

            winston.log("info" , elapsed_time("success"));

            fs.writeFile("heroku_response.json", JSON.stringify(res, null, 4), function(){
                console.log("Heroku query successful! Check heroku_response.json");
                console.log("Heroku query successful! Printing results:\n");
                console.log(`Salesforce ID: ${res.rows[0].sfid}\n` + `Main Fisher ID: ${res.rows[0].main_fisher_id__c}`);
                PROCESS_END_TIME = process.hrtime();
                // calculateRunningTime(PROCESS_START_TIME, PROCESS_END_TIME);

                // postgres.close();
            });
        }
    });
}

/**
 * Method used to stagger / back off on the amount of times we check
 * for the record in the PG database.
 */
function recalculateTimeout(){
    if (QUERY_ITERATOR < 12){
        QUERY_ITERATOR++;
        TIMEOUT_MILIS = 1000;
    } else{
        TIMEOUT_MILIS += 3000;
        QUERY_ITERATOR++;
    }
    if (TIMEOUT_MILIS >= 30000) {
        TIMEOUT_MILIS = 30000;
    }
    // console.log(`Recalculated to: ${TIMEOUT_MILIS}`);
}

/*============================================================================
    Process Timer Methods
 ============================================================================*/

/**
 * Starts / Resets the countdown timer
 */
function startTimer(){
    PROCESS_START_TIME = process.hrtime();
}

/**
 * Returns an object showing seconds and miliseconds since timer reset
 * @returns {{seconds: *, milis: string, fulltime: number}}
 */
function elapsed_time(status){
    if (PROCESS_START_TIME === undefined){
        PROCESS_START_TIME = process.hrtime();
    }

    let precision = 3; // 3 decimal places
    let elapsed = process.hrtime(PROCESS_START_TIME)[1] / 1000000; // divide by a million to get nano to milli
    // console.log(process.hrtime(PROCESS_START_TIME)[0] + " s, " + elapsed.toFixed(precision) + " ms - " + note); // print message + time

    return {
        "seconds" : process.hrtime(PROCESS_START_TIME)[0],
        "milis" : elapsed.toFixed(precision),
        "fulltime" : ((process.hrtime(PROCESS_START_TIME)[0]) * 1000) + parseFloat(elapsed.toFixed(precision)),
        "status" : status
    };
}

/*============================================================================
    Exports
 ============================================================================*/

module.exports = {
    runTest: runTest,
    init: init
};
