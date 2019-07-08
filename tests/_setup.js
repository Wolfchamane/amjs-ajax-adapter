// ---- Global SETUP -----
class Headers
{
    constructor(headers = {})
    {
        Object.keys(headers).forEach(header => this[header] = headers[header], this);
    }
}

class Response
{
    constructor(values = {})
    {
        this.status = 200;
        this.$value = JSON.stringify(values);
    }

    clone()
    {
        return new Promise(resolve => resolve(this));
    }

    json()
    {
        return new Promise(resolve =>
        {
            resolve(JSON.parse(this.$value));
        });
    }
}

class BadResponse extends Response
{
    constructor(values = {})
    {
        super(values);
        this.status = 400;
    }

    json()
    {
        return new Promise((res, rej) =>
        {
            rej(new Error('Invalid response'));
        });
    }
}

class ValidBadResponse extends BadResponse
{
    constructor(values = {})
    {
        super(values);
        this.status = 401;
    }

    json()
    {
        return new Promise(resolve => resolve('Unauthorized'));
    }
}

global.Headers              = global.Headers || Headers;
global.Response             = global.Response || Response;
global.BadResponse          = global.BadResponse || BadResponse;
global.ValidBadResponse     = global.ValidBadResponse || ValidBadResponse;
// ---- Global SETUP -----
