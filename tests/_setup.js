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
    constructor(values)
    {
        this.status = 200;
        this.$value = JSON.stringify(values);
        this.$error = 'Error';
    }

    clone()
    {
        return this;
    }

    json()
    {
        return !!this.$value ? JSON.parse(this.$value) : new Error(this.$error);
    }
}

class BadResponse extends Response
{
    constructor(value)
    {
        super(value);
        this.status = 400;
        this.$error = 'BadResponse'
    }
}

class RejectResponse extends BadResponse
{
    json()
    {
        return new Promise(
            (resolve, reject) =>
            {
                reject(new Error(this.$error));
            }
        );
    }
}

global.Headers              = global.Headers || Headers;
global.Response             = global.Response || Response;
global.BadResponse          = global.BadResponse || BadResponse;
global.RejectResponse       = global.RejectResponse || RejectResponse;
// ---- Global SETUP -----
