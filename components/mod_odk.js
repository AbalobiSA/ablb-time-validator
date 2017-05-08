/*============================================================================
    Imports
 ============================================================================*/

let request = require("request");
let secrets = require("../secrets/secrets");

const OPENFN_URL = secrets.OPENFN_URL;

/*============================================================================
    Main
 ============================================================================*/

function createFakeRequest(callback){

    let FAKE_TRIP_ID = generateFakeID();
    let TODAY_DATE = (new Date()).toISOString();

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
                data:
                    [ { '*meta-model-version*': 2016102811,
                        '*meta-submission-date*': TODAY_DATE,
                        comment_has: 'no',
                        comment_has_pic2: null,
                        cost_fuel_price: 1400,
                        cost_has: 'yes',
                        crew_members: null,
                        current_direction: null,
                        fisher_community_province: 'WC',
                        fuel_litres: 108,
                        income_note: null,
                        no_catch_reason: null,
                        no_trip_reason_other: null,
                        shore_type: null,
                        target_specie_list: null,
                        time_end: '14:03:00.000Z',
                        trip_community: 'democommunity',
                        trip_community_selected_shore: null,
                        trip_community_shore: null,
                        trip_date: '2017-01-05',
                        wind_direction: 'wind_southeast',
                        rpt_catch:
                            [ { alloc_coop_crates: 0,
                                alloc_coop_number: null,
                                alloc_coop_weight_kg: 300,
                                alloc_self_crates: null,
                                alloc_self_crates_multiple: null,
                                alloc_self_crates_single: null,
                                alloc_self_number: null,
                                alloc_self_number_multiple: null,
                                alloc_self_number_single: null,
                                alloc_self_weight_kg: null,
                                alloc_self_weight_kg_multiple: null,
                                alloc_self_weight_kg_single: null,
                                alloc_sold_other_crates: null,
                                alloc_sold_other_number: null,
                                alloc_sold_other_weight_kg: 101,
                                catch_bait: 'sardine',
                                catch_bait_other: null,
                                catch_crates: null,
                                catch_number: 40,
                                catch_string: '401 kg',
                                catch_string_crates: null,
                                catch_string_join_a: null,
                                catch_string_join_b: null,
                                catch_string_number: null,
                                catch_string_weight_kg: '401 kg',
                                catch_weight_kg: 401,
                                coop_price_per_batch: null,
                                coop_price_per_crate: null,
                                coop_price_per_item: null,
                                coop_price_per_kg: null,
                                coop_price_type: null,
                                income: '12832',
                                income_coop: '0',
                                income_coop_crate: null,
                                income_coop_item: null,
                                income_coop_kg: null,
                                income_other: '12832',
                                income_other_crate: null,
                                income_other_item: null,
                                income_other_kg: '12832',
                                note_alloc: null,
                                note_no_crates: null,
                                note_no_crates2: null,
                                note_no_number: null,
                                note_no_number2: null,
                                note_no_weight: null,
                                note_no_weight2: null,
                                note_not_wclobster: null,
                                note_not_wclobster2: null,
                                note_specie_income: null,
                                other_price_per_batch: null,
                                other_price_per_crate: null,
                                other_price_per_item: null,
                                other_price_per_kg: 32,
                                other_price_type: 'per_kg',
                                selected_specie: 'snoek',
                                selected_specie_label: 'Snoek' } ],
                        cost_other_name: null,
                        comment_image: null,
                        'geopoint:Altitude': null,
                        comment_image3: null,
                        nonlinked_boat_reg_type: null,
                        'geopoint:Longitude': null,
                        instanceID: 'uuid:faketrip' + FAKE_TRIP_ID,
                        nonlinked_boat_reg_num: null,
                        cost_transport: null,
                        permit_list_boat: [ 'permit_comm_tlf' ],
                        catch_specie_manual: null,
                        trip_from_hometown_boat: 'yes',
                        cost_harbour_fee: 50,
                        trip_community_boat: 'struisbaai',
                        '*meta-date-marked-as-complete*': '2017-01-29T19:13:36.990Z',
                        deviceid: '356545061648014',
                        fisher_community: 'democommunity',
                        trip_type: 'boat',
                        start: '2017-01-05T19:02:28.673Z',
                        trip_today_or_prev: 'today',
                        'geopoint:Accuracy': null,
                        nonlinked_boat_owner_manual: null,
                        permit_list_self: null,
                        trip_from_hometown_shore: null,
                        wind_strength: 'wind_littlewind',
                        '*meta-is-complete*': true,
                        target_specie_manual: null,
                        current_has: 'no',
                        today: '2017-01-05',
                        sea_condition: 'sea_calm',
                        trip_from_hometown_notrip: null,
                        displayed_profit: '10482',
                        comment_has_pic3: null,
                        rpt_catch_count: '1',
                        all_or_self_only_selected: 'whole_boat',
                        '*meta-instance-id*': 'uuid:faketrip' + FAKE_TRIP_ID,
                        trip_date_manual: null,
                        boat_skipper_manual: 'Petrus',
                        note_costs1: null,
                        time_start: '03:00:00.000Z',
                        boat_as_per_profile: 'yes',
                        comment_text: null,
                        cost_oil: null,
                        comment_image2: null,
                        cost_note: null,
                        trip_has: 'yes',
                        count_repeats: '1',
                        num_irp: null,
                        phonenumber: null,
                        '*meta-ui-version*': null,
                        cost_total: '2350',
                        weather: 'weather_sunny',
                        note_costs2: null,
                        yesno_label: 'Ja',
                        catch_method_list: [ 'handline' ],
                        cost_food: 50,
                        trip_community_province_boat: null,
                        income_total: '12832',
                        trip_community_selected_notrip: null,
                        calc_form_language: 'Afrikaans',
                        end: '2017-01-29T19:13:21.606Z',
                        shore_spots: null,
                        selected_community_label: 'Demo Community',
                        trip_community_province_shore: null,
                        nonlinked_boat_type: null,
                        trip_community_selected_boat: null,
                        crew_number: 8,
                        current_strength: null,
                        nonlinked_boat_name: null,
                        catch_specie_list: [ 'snoek' ],
                        landing_site: 'struisbaai_harbour',
                        username: 'test6@a.b',
                        main_fisher: 'test_fisher6',
                        catch_has: 'yes',
                        'geopoint:Latitude': null,
                        profit_note: null,
                        trip_community_province_notrip: null,
                        no_trip_reason: null,
                        note_date: null,
                        cost_other: null,
                        cost_bait: 850,
                        all_or_self_only: 'whole_boat' } ],
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
        var length = 25;
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        // var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(var i = 0; i < length; i++) {
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
