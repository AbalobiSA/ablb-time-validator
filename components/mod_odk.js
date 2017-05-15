/*============================================================================
    Imports
 ============================================================================*/

let request = require("request");
let secrets = require("../secrets/secrets");
let dataTemplate = require("./catchData/template");

const OPENFN_URL = secrets.OPENFN_URL;

/*============================================================================
    Main
 ============================================================================*/

function createFakeRequest(callback){

    let FAKE_TRIP_ID = generateFakeID();
    let TODAY_DATE = (new Date()).toISOString();

    let dataOptions = {
        "TODAY_DATE" : TODAY_DATE,
        "FAKE_TRIP_ID" : FAKE_TRIP_ID,
        "SPECIES_LABEL" : 'WC Rock Lobster',
        "SPECIES_KEY" : "wclobster",
        "CATCH_COOP_WEIGHT" : 100,
        "USERNAME" : "test7@a.b",
        "MAIN_FISHER" : "test_fisher7"
    };

    // WC Rock Lobster
    // wclobster

    // "SPECIES_KEY" : 'WC Rock Lobster',
    // "SPECIES_LABEL" : "wclobster",

    // "SPECIES_KEY" : 'snoek',
    // "SPECIES_LABEL" : "Snoek",

    let options = { method: 'POST',
        url: OPENFN_URL,
        headers:
            { 'postman-token': '08a188f2-e337-517e-87b3-0421837b1eb1',
                'cache-control': 'no-cache',
                'content-type': 'application/json' },
        body:
            { token: '',
                formVersion: '2016111517',
                formId: 'Fisher_Logbook_v2_0',
                data: dataTemplate.getData(dataOptions),
                content: 'record' },
        json: true };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        callback(response, FAKE_TRIP_ID);
    });
}

/*============================================================================
    Tools
 ============================================================================*/

function generateFakeID(){

    function generateRandomString(){
        let length = 25;
        let text = "";
        let possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        // var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    function generateODKString(){
        function guid() {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return guid();
    }

    return generateODKString();
}



/*============================================================================
    Exports
 ============================================================================*/

module.exports = {
    post: createFakeRequest,
    fakeid: generateFakeID
};
