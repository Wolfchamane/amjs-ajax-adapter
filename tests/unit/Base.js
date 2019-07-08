require('@amjs/ajax-url');
require('../_setup');
const { equal }             = require('assert');
const AmjsAjaxAdapterBase   = require('../../src/Base');
const AmjsFactory           = require('@amjs/factory');

(function()
{
    let sut = new AmjsAjaxAdapterBase();
    equal(sut instanceof AmjsFactory, true, 'AmjsAjaxAdapterBase extends AmjsFactory');

    sut = AmjsFactory.create('Adapter::Base');
    equal(sut instanceof AmjsAjaxAdapterBase, true, 'Is registered as "Adapter::Base"');
}());

(function()
{
    equal(AmjsAjaxAdapterBase.token === undefined, true, 'get token() by default returns "undefined"');
    AmjsAjaxAdapterBase.token = 'fooToken';
    equal(AmjsAjaxAdapterBase.token === 'fooToken', true, 'Once called set token(), token value is changed');
    AmjsAjaxAdapterBase.token = null;
}());

(function()
{
    const sut = new AmjsAjaxAdapterBase();
    const service = {};
    sut.serialize();
    equal(service.request === undefined, true, 'By default, serialize does nothing');

    sut.serialize(undefined, service);
    const config = service.request;
    equal(typeof config === 'object', true, 'In other case, stores request configuration within service object');
    equal(config.headers instanceof Headers, true, 'Configuration headers is an instanceof Headers');
    equal(config.method === 'GET', true, 'By default, configuration method is "GET"');
    equal(config.url === 'https://', true, 'By default, configuration url is "https://"');
    equal(config.body === undefined, true, 'If not specified, configuration body is "undefined"');
    equal(config.headers['Accept'] === '*/*', true, 'Default "Accept" header is "*/*"');

    let url = AmjsFactory.create('URL', { domain : 'mock', path : 'path' });
    sut.serialize({ url }, service);
    equal(service.request.url === 'https://mock/path', true, 'If configuration defines an URL object, its value is retrieved');

    url = 'http://other-url';
    sut.serialize({ url }, service);
    equal(service.request.url === url, true, 'In other case, if URL is plain, its value is used');

}());

(function()
{
    const sut = new AmjsAjaxAdapterBase();
    equal(sut.unserialize() === undefined, true, 'By default, unserialize returns "undefined"');
    equal(sut.unserialize('foo') === 'foo', true, 'In other case, returns "response" argument value');
}());
