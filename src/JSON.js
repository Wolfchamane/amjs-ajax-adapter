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

        request.body = JSON.stringify(request.body || {});

        super.serialize(request, service);
    }

    /**
     * @override
     */
    async unserialize(response, service)
    {
        let raw;
        let error = null;
        try
        {
            if (response && 'status' in response)
            {
                raw = await response.json()
                    .catch(err => error = err);

                if (error instanceof Error)
                {
                    error = {
                        code    : response.status,
                        message : error.message
                    }
                }

                if (!error && response.status >= 400)
                {
                    error = {
                        code    : response.status,
                        message : raw
                    };
                }
            }
            else
            {
                throw new Error('Invalid response object');
            }
        }
        catch (err)
        {
            error = { code : 500, message : err.message };
        }

        response = error
            ? { errors : [ error ]}
            : { data : raw };

        service.response = JSON.stringify(raw || {});

        return super.unserialize(response, service);
    }
}

AmjsAjaxAdapterBase.register('Adapter::JSON', AmjsAjaxAdapterJSON);
module.exports = AmjsAjaxAdapterJSON;
