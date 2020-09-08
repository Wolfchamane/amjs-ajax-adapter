# @amjs/ajax-adapter 0.1.3

![Statements](https://img.shields.io/badge/Statements-100%25-brightgreen.svg) ![Branches](https://img.shields.io/badge/Branches-100%25-brightgreen.svg) ![Functions](https://img.shields.io/badge/Functions-100%25-brightgreen.svg) ![Lines](https://img.shields.io/badge/Lines-100%25-brightgreen.svg)

> Set up of AJAX request adapters

## Installation

```bash
$ npm i @amjs/ajax-adapter
```
## Usage

- Register your URL adapter:
```javascript
const { AmjsAjaxAdpaterJSON } = require('@amjs/ajax-adapter');

class MyURLAdpater extends AmjsAjaxAdpaterJSON
{
    /**
     * @override
     */
    async serialize(config = {}, service = {})
    {
        // apply into 'config' any API required change

        await super.serialize(config, service);
    }

    /**
     * @override
     */
    async unserialize(response, service)
    {
        // do whatever API requires with response object

        return await super.unserialize(response, service);
    }
}

AmjsAjaxAdpaterJSON.register('Adapter::http://my-url', MyURLAdpater);
module.exports = MyURLAdpater;
```

- Use your URL adapter before/after fetching request:
```javascript
async function doFetch()
{
    const AmjsFactory = require('@amjs/factory');
    const URL = 'https://my-url';
    const adapter = AmjsFactory.create(`Adapter::${URL}`);
    const request = {};
    const service = {};
    await adpater.serialize(request, service);
    let response = await fetch(URL, request);
    response = await adapter.unserialize(response.clone(), service);
    console.log(response);  // { data : { ... }}  --> OK: 200 - 399
                            // { errors: [ ... ]} --> ERROR: 400 - 599
}
```

I suggest to use `AmjsAjaxService` as long as previous operations are performed internally and has being tested out.
