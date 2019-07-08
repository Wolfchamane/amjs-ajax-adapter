require('../_setup');
const { equal }             = require('assert');
const AmjsAjaxAdapterBase   = require('../../src/Base');
const AmjsAjaxAdapterJSON   = require('../../src/JSON');
const AmjsFactory           = require('@amjs/factory');

(function()
{
    let sut = new AmjsAjaxAdapterJSON();
    equal(sut instanceof AmjsAjaxAdapterBase, true, 'Extends from AmjsAjaxAdapterBase');
    sut = AmjsFactory.create('Adapter::JSON');
    equal(sut instanceof AmjsAjaxAdapterJSON, true, 'Is registered as "Adapter::JSON"');
}());

(function()
{
    const sut = new AmjsAjaxAdapterJSON();
    const service = {};
    const body = {
        key : 'value'
    };

    sut.serialize(undefined, service);

    equal(typeof service.request === 'object', true, 'serialize set-ups request configuration object');
    equal(service.request.headers instanceof Headers, true, 'Request configuration headers is a Headers instance');

    const jsonHeaders = {
        'Accept'        : 'application/json, text/html, */*',
        'Content-Type'  : 'application/json; charset=utf-8'
    };
    Object.keys(jsonHeaders).forEach(
        header =>
            equal(
                service.request.headers[header] === jsonHeaders[header],
                true,
                `Request configuration header ${header} values ${jsonHeaders[header]}`)
    );

    sut.serialize({ body }, service);
    equal(service.request.body === JSON.stringify(body), true, 'serialize stringifies request payload');
}());

(async function()
{
    const raw = { key : 'value' };
    const sut = new AmjsAjaxAdapterJSON();
    const mockResponse = new Response(raw);
    const badResponse = new BadResponse();
    const validBadResponse = new ValidBadResponse({});

    const service = {};

    let response = await sut.unserialize(await mockResponse.clone(), service);
    equal(typeof service.response !== 'undefined', true, 'unserialize stores raw response into service object');
    equal(service.response === JSON.stringify(raw), true, 'raw data is as expected');
    equal(JSON.stringify(response) === JSON.stringify({ data : raw }),
        true, 'In case of OK response, raw data is wrapped into { data : <raw> }');

    response = await sut.unserialize(await badResponse.clone(), service);
    let expectedBadObject = {
        errors : [
            { code : 400, message : 'Invalid response' }
        ]
    };
    equal(JSON.stringify(response) === JSON.stringify(expectedBadObject),
        true, 'In case of ERROR, returns a pool of errors');

    response = await sut.unserialize(await validBadResponse.clone(), service);
    expectedBadObject = {
        errors : [
            { code : 401, message : 'Unauthorized' }
        ]
    };
    equal(JSON.stringify(response) === JSON.stringify(expectedBadObject),
        true, 'In case of service ERROR response, returns a pool of errors');

    response = await sut.unserialize({}, service);
    expectedBadObject = {
        errors : [
            { code : 500, message : 'Invalid response object' }
        ]
    };
    equal(JSON.stringify(response) === JSON.stringify(expectedBadObject),
        true, 'In case response is invalid, returns a pool of errors');
}());
