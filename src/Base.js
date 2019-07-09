require('@amjs/ajax-url');
const AmjsFactory = require('@amjs/factory');

let $TOKEN;

/**
 * Base class adapter for any API adapter
 * @namespace   amjs.ajax.adapter
 * @class       amjs.ajax.adapter.Base
 * @requires    amjs.Factory
 */
class AmjsAjaxAdapterBase extends AmjsFactory
{
    /**
     * Retrieves current security token
     * @return {*}  Current token value
     */
    static get token()
    {
        return $TOKEN;
    }

    /**
     * Stores a new security token
     * @param   {*} value   New security token
     */
    static set token(value)
    {
        $TOKEN = value;
    }

    _serviceStore(prop = '', service, values)
    {
        if (service && typeof service === 'object')
        {
            service[`${AmjsFactory.is('AjaxService', service) ? '$' : ''}${prop}`] = values;
        }
    }

    /**
     * Applies configuration request object to service object.
     * Also transforms configuration request object into proper values.
     * @param   {Object}    request Configuration request
     * @param   {Object}    service Service instance
     */
    serialize(request = {}, service)
    {
        if (service && typeof service === 'object')
        {
            const headers = new Headers(Object.assign({
                'Accept'        : '*/*'
            }, request.headers || {}));

            const method = (request.method || 'GET').toUpperCase();
            const url = request.url
                ? AmjsFactory.is('URL', request.url)
                    ? request.url.value
                    : request.url
                : 'https://';

            const config = { headers, method, url };
            if (request.body)
            {
                config.body = request.body;
            }

            this._serviceStore('request', service, config);
        }
    }

    /**
     * Applies requires changes to response obtained from service.
     * @param   {*} response    Response obtained
     * @param   {*} service     Service which retrieves the response
     * @return  {*} Parsed response object
     */
    unserialize(response, service)
    {
        return response;
    }
}

AmjsFactory.register('Adapter::Base', AmjsAjaxAdapterBase);
module.exports = AmjsAjaxAdapterBase;
