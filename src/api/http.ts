import { TOKEN } from './tokenMiddleware';
import { BASEURL, AUTH } from '../constants';
import { Logger } from '../utilities/logging';

export enum HttpMethod {
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    GET = 'GET',
    DELETE = 'DELETE',
}
type Optionals = Partial<{
    body: any;
    autoRefresh: boolean;
}>;
type GeneralResponseMapping = {
    [key: number]: (...args: any[]) => any;
};

/* eslint-disable-next-line @typescript-eslint/ban-types */
export class HttpRequest<TResponses extends GeneralResponseMapping = {}> {
    public static get(endpoint: string): HttpRequest {
        return new HttpRequest(HttpMethod.GET, endpoint);
    }
    public static post(endpoint: string): HttpRequest {
        return new HttpRequest(HttpMethod.POST, endpoint);
    }
    public static put(endpoint: string): HttpRequest {
        return new HttpRequest(HttpMethod.PUT, endpoint);
    }
    private readonly method: HttpMethod;
    private readonly endpoint: string;
    private successCallback?: (body: any) => void;
    private failureCallback?:
        | ((response: Response) => void)
        | ((response: XMLHttpRequest) => void)
        | ((response: null) => void);
    private body?: any;
    private parseResponse?: boolean;

    private constructor(method: HttpMethod, endpoint: string, optionals: Optionals = {} as Optionals) {
        this.method = method;
        this.endpoint = endpoint;
        this.parseResponse = true;
        if (optionals) {
            this.body = optionals.body;
        }
    }
    public withBody<TBody>(body: TBody, stringify = true): HttpRequest<TResponses> {
        this.body = stringify ? JSON.stringify(body) : body;
        return this;
    }
    public onSuccess(callback: (body: any) => void): HttpRequest {
        this.successCallback = callback;
        return this;
    }
    public onFailure(
        callback: ((response: Response) => void) | ((response: XMLHttpRequest) => void) | ((response: null) => void)
    ): HttpRequest {
        this.failureCallback = callback;
        return this;
    }
    public withFullResponse(): HttpRequest {
        this.parseResponse = false;
        return this;
    }
    public request(): Promise<void> {
        return fetch(`${BASEURL}/${this.endpoint}`, {
            method: this.method,
            headers: Object.assign({ 'Content-Type': 'application/json' }, TOKEN ? { [AUTH]: `Bearer ${TOKEN}` } : {}),
            body: this.body,
        })
            .then(async (response) => {
                switch (response.status) {
                    case 200: {
                        let reply = {};
                        if (this.method === HttpMethod.PUT || this.parseResponse === false) {
                            reply = response;
                        } else if (this.method === HttpMethod.GET) {
                            reply = await response.json();
                        }
                        if (this.successCallback) this.successCallback(reply);
                        break;
                    }
                    default:
                        if (this.failureCallback) this.failureCallback(response);
                        break;
                }
            })
            .catch((error) => {
                void Logger.logError({
                    code: 'HTP100',
                    description: `Fetch call failed for ${this.endpoint}.`,
                    rawErrorCode: error.code,
                    rawErrorMessage: error.message,
                });
                if (this.failureCallback) this.failureCallback(null);
            });
    }
    public requestWithProgress(onProgress: (this: XMLHttpRequest, ev: ProgressEvent) => any): Promise<void> {
        return new Promise((res, rej) => {
            const xhr = new XMLHttpRequest();
            xhr.open(this.method, `${BASEURL}/${this.endpoint}`);
            if (TOKEN) {
                xhr.setRequestHeader(AUTH, `Bearer ${TOKEN}`);
            }
            xhr.onload = (/*e*/): void => res(xhr);
            xhr.onerror = rej;
            if (xhr.upload && onProgress) xhr.upload.onprogress = onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
            xhr.send(this.body);
        })
            .then(async (response) => {
                switch (response.status) {
                    case 200: {
                        let reply = {};
                        if (this.method === HttpMethod.PUT) {
                            reply = response;
                        } else if (this.method === HttpMethod.GET) {
                            reply = await response.json();
                        }
                        if (this.successCallback) this.successCallback(reply);
                        break;
                    }
                    default:
                        if (this.failureCallback) this.failureCallback(response);
                        break;
                }
            })
            .catch((error) => {
                void Logger.logError({
                    code: 'HTP200',
                    description: `XHR call failed for ${this.endpoint}.`,
                    rawErrorCode: error.code,
                    rawErrorMessage: error.message,
                });
            });
    }
}
