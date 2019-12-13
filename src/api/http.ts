import { TOKEN } from './tokenMiddleware';
import { BASEURL, AUTH } from '../constants';

// TODO: Check token expiration on every failed request

export enum HttpMethod {
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    GET = 'GET',
    DELETE = 'DELETE'
}
type Optionals = Partial<{
    body: any;
    queryParams: string;
    autoRefresh: boolean;
}>;
type GeneralResponseMapping = {
    [key: number]: (...args: Array<any>) => any;
};

export class HttpRequest<TResponses extends GeneralResponseMapping = {}> {
    public static get(endpoint: string) {
        return new HttpRequest(HttpMethod.GET, endpoint);
    }
    public static post(endpoint: string) {
        return new HttpRequest(HttpMethod.POST, endpoint);
    }
    public static put(endpoint: string) {
        return new HttpRequest(HttpMethod.PUT, endpoint);
    }
    private readonly method: HttpMethod;
    private readonly endpoint: string;
    private successCallback?: Function;
    private failureCallback?: Function;
    private body?: any;
    private queryParams?: string;

    private constructor(method: HttpMethod, endpoint: string, optionals: Optionals = {}) {
        this.method = method;
        this.endpoint = endpoint;
        if (optionals) {
            this.body = optionals.body;
            this.queryParams = optionals.queryParams;
        }
    }
    public withQueryParams(params: { [k: string]: string | number }): HttpRequest<TResponses> {
        const keys = Object.keys(params);
        if (keys.length) {
            this.queryParams = '?' + keys.map(key => `${key}=${params[key]}`).join('&');
        }
        return this;
    }
    public withBody<TBody>(body: TBody, stringify:boolean = true): HttpRequest<TResponses> {
        this.body = stringify ? JSON.stringify(body) : body;
        return this;
    }
    public onSuccess(callback: Function) {
        this.successCallback = callback;
        return this;
    }
    public onFailure(callback: Function) {
        this.failureCallback = callback;
        return this;
    }
    public request() {
        return fetch(`${BASEURL}/${this.endpoint}`, {
            method: this.method,
            headers: Object.assign(
                { 'Content-Type': 'application/json' },
                TOKEN ? { [AUTH]: `Bearer ${TOKEN}` } : {}
            ),
            body: this.body
        })
            .then(async (response) => {
                switch (response.status) {
                    case 200:
                        let reply = {};
                        if (this.method === HttpMethod.PUT) {
                            reply = response;
                        }
                        else if (this.method === HttpMethod.GET) {
                            reply = await response.json();
                        }
                        if (this.successCallback) this.successCallback(reply);
                        break;
                    default:
                        if (this.failureCallback) this.failureCallback(response);
                        break;
                }
            })
            .catch((error) => {
                console.log('FETCH ERROR', error.message);
            })
    }
    public requestWithProgress(onProgress: (this: XMLHttpRequest, ev: ProgressEvent) => any) {
        return new Promise((res, rej) => {
            var xhr = new XMLHttpRequest();
            xhr.open(this.method, `${BASEURL}/${this.endpoint}`);
            if (TOKEN) {
                xhr.setRequestHeader(AUTH, `Bearer ${TOKEN}`);
            }
            xhr.onload = e => res(xhr);
            xhr.onerror = rej;
            if (xhr.upload && onProgress)
                xhr.upload.onprogress = onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
            xhr.send(this.body);
        })
            .then(async (response) => {
                switch (response.status) {
                    case 200:
                        let reply = {};
                        if (this.method === HttpMethod.PUT) {
                            reply = response;
                        }
                        else if (this.method === HttpMethod.GET) {
                            reply = await response.json();
                        }
                        if (this.successCallback) this.successCallback(reply);
                        break;
                    default:
                        if (this.failureCallback) this.failureCallback(response);
                        break;
                }
            })
            .catch((error) => {
                console.log('FUTCH ERROR', error.message);
            })
    }
}