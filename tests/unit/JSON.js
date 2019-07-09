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

    sut.serialize({ body : null, method : 'PUT' }, service);
    equal(service.request.body === JSON.stringify({}), true, 'serialize stringifies empty object as request payload');

    sut.serialize({ body, method : 'POST' }, service);
    equal(service.request.body === JSON.stringify(body), true, 'serialize stringifies request payload');
}());

(async function()
{
    try
    {
        const raw = { key : 'value' };
        const sut = new AmjsAjaxAdapterJSON();
        const mockResponse = new Response(raw);
        const service = {};

        // OK
        let response = await sut.unserialize(mockResponse, service);
        equal(typeof service.response !== 'undefined', true, 'unserialize stores raw response into service object');
        equal(service.response === JSON.stringify(raw), true, 'raw data is as expected');
        equal(JSON.stringify(response) === JSON.stringify({ data : raw }),
            true, 'In case of OK response, raw data is wrapped into { data : { raw }}');

        // { Error }
        const error = new Error('Mock Error');
        response = await sut.unserialize(error, service);
        equal(Array.isArray(response.errors) === true, true,
            'If response is an {Error}, unserialize returns a pool of errors');

        // Bad response object
        response = await sut.unserialize({}, service);
        equal(Array.isArray(response.errors) === true, true,
            'If response is not a valid object, returns a pool of errors');

        // JSON parse error
        response = new RejectResponse();
        response = await sut.unserialize(response, service);
        equal(Array.isArray(response.errors) === true, true,
            'If parsing response as JSON throws an {Error}, returns a pool of errors');

        // Error response
        response = new BadResponse(raw);
        response = await sut.unserialize(response, service);
        equal(Array.isArray(response.errors) === true, true,
            'If response is an error response, returns a pool of errors');


    }
    catch (e)
    {
        console.error(`Error testing JSON: ${e}`);
    }
}());
