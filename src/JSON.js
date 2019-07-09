const AmjsAjaxAdapterBase = require('./Base');

/**
 * JSON API adapter
 * @namespace   amjs.ajax.adapter
 * @class       amjs.ajax.adapter.JSON
 * @requires    amjs.ajax.adapter.Base
 */
class AmjsAjaxAdapterJSON extends AmjsAjaxAdapterBase
{
    /**
     * @override
     */
    serialize(request = {}, service)
    {
        request.headers = Object.assign(request.headers || {}, {
            'Accept'        : 'application/json, text/html, */*',
            'Content-Type'  : 'application/json; charset=utf-8'
        });

        if (['POST', 'PUT', 'PATCH'].includes(request.method))
        {
            request.body = JSON.stringify(request.body || {});
        }

        super.serialize(request, service);
    }

    /**
     * @override
     */
    async unserialize(response, service)
    {
        let raw;
        let error = null;

        if (response instanceof Error)
        {
            error = {
                code    : 500,
                message : response.message
            };
        }
        else
        {
            try
            {
                if ('status' in response)
                {
                    raw = await response.json();
                    if (response.status >= 400)
                    {
                        error = {
                            code    : response.status,
                            message : raw
                        };
                    }
                }
                else
                {
                    error = {
                        code    : 500,
                        message : 'Invalid response object'
                    };
                }
            }
            catch (e)
            {
                error = { code : 500, message : e.message };
            }
        }

        response = !!error
            ? { errors : [ error ]}
            : { data : raw };

        this._serviceStore('response', service, JSON.stringify(raw || {}));

        return super.unserialize(response, service);
    }
}

AmjsAjaxAdapterBase.register('Adapter::JSON', AmjsAjaxAdapterJSON);
module.exports = AmjsAjaxAdapterJSON;
