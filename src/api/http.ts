import { TOKEN } from './tokenMiddleware';
import { BASEURL, AUTH } from '../constants';

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
    public withBody<TBody>(body: TBody): HttpRequest<TResponses> {
        this.body = body;
        return this;
    }
    public onSuccess(callback: Function){
        this.successCallback = callback;
        return this;
    }
    public onFailure(callback: Function){
        this.failureCallback = callback;
        return this;
    }
    public request() {
        console.log('request, token', TOKEN);
        return fetch(`${BASEURL}/${this.endpoint}`, {
            method: this.method,
            headers: Object.assign(
                { 'Content-Type': 'application/json' },
                TOKEN ? { [AUTH]: `Bearer ${TOKEN}` } : {}
            ),
            body: JSON.stringify(this.body)
        })
        .then(async (response) => {
            switch(response.status){
                case 200:
                    const responseBody = await response.json();
                    if(this.successCallback) this.successCallback(responseBody);
                    break;
                default:
                    if(this.failureCallback) this.failureCallback(response);
                    break;
            }
        })
        .catch((error) => {
            console.log('FETCH ERROR', error.message);
        })
    }
}

// import { Fn, UnionKeys } from '~src/types/general';
// import { getSensitiveData, LocalStorageKey, setSensitiveData } from '~lib/local-storage';
// import { config } from '~src/app-config';
// import { Validator, validators } from './validators';
// import { Maybe } from '~lib/maybe';
// import { HttpResponse, isNormalResponse, parseError, expectedResponse, networkFailure, StatusCodeMap } from '~actions/http-response';


// type SendResponse<TResponses extends {}> = Promise<HttpResponse<UnionKeys<StatusCodeMapping<TResponses> & StatusCodeMap>>>;



// export class HttpRequestOld<TResponses extends GeneralResponseMapping = {}> {
//     public static get(endpoint: string) {
//         return new HttpRequest(HttpMethod.GET, endpoint);
//     }
//     public static delete(endpoint: string) {
//         return new HttpRequest(HttpMethod.DELETE, endpoint);
//     }
//     public static patch(endpoint: string) {
//         return new HttpRequest(HttpMethod.PATCH, endpoint);
//     }
//     public static post(endpoint: string) {
//         return new HttpRequest(HttpMethod.POST, endpoint);
//     }
//     public static put(endpoint: string) {
//         return new HttpRequest(HttpMethod.PUT, endpoint);
//     }

//     private readonly method: HttpMethod;
//     private readonly endpoint: string;
//     private responseMappings: TResponses;
//     private responseValidators: { [statusCode: number]: Fn<any, any> };
//     private body?: any;
//     private queryParams?: string;
//     private autoRefresh?: boolean;

//     private constructor(method: HttpMethod, endpoint: string, optionals: Optionals = {}) {
//         this.method = method;
//         this.endpoint = endpoint;
//         this.autoRefresh = true;

//         this.responseMappings = {} as TResponses;
//         this.responseValidators = {};

//         if (optionals) {
//             this.body = optionals.body;
//             this.queryParams = optionals.queryParams;
//             this.autoRefresh = optionals.autoRefresh;
//         }
//     }

//     public map200Response<TResponseBody, TOutput>(
//         validator: Validator<TResponseBody>,
//         mapping: Fn<TResponseBody, TOutput>
//     ): HttpRequest<TResponses & { 200: typeof mapping }> {
//         const newRequest = new HttpRequest<TResponses & { 200: typeof mapping }>(this.method, this.endpoint, this.getOptionals());

//         newRequest.responseMappings = Object.assign({}, this.responseMappings, {
//             200: mapping
//         });
//         newRequest.responseValidators = Object.assign({}, this.responseValidators, {
//             200: validator
//         });

//         return newRequest;
//     }

//     public map401Response<TResponseBody, TOutput>(
//         validator: Validator<TResponseBody>,
//         mapping: Fn<TResponseBody, TOutput>
//     ): HttpRequest<TResponses & { 401: typeof mapping }> {
//         const newRequest = new HttpRequest<TResponses & { 401: typeof mapping }>(this.method, this.endpoint, this.getOptionals());

//         newRequest.responseMappings = Object.assign({}, this.responseMappings, {
//             401: mapping
//         });
//         newRequest.responseValidators = Object.assign({}, this.responseValidators, {
//             401: validator
//         });

//         return newRequest;
//     }

//     public map403Response<TResponseBody, TOutput>(
//         validator: Validator<TResponseBody>,
//         mapping: Fn<TResponseBody, TOutput>
//     ): HttpRequest<TResponses & { 403: typeof mapping }> {
//         const newRequest = new HttpRequest<TResponses & { 403: typeof mapping }>(this.method, this.endpoint, this.getOptionals());

//         newRequest.responseMappings = Object.assign({}, this.responseMappings, {
//             403: mapping
//         });
//         newRequest.responseValidators = Object.assign({}, this.responseValidators, {
//             403: validator
//         });

//         return newRequest;
//     }

//     public map409Response<TResponseBody, TOutput>(
//         validator: Validator<TResponseBody>,
//         mapping: Fn<TResponseBody, TOutput>
//     ): HttpRequest<TResponses & { 409: typeof mapping }> {
//         const newRequest = new HttpRequest<TResponses & { 409: typeof mapping }>(this.method, this.endpoint, this.getOptionals());

//         newRequest.responseMappings = Object.assign({}, this.responseMappings, {
//             409: mapping
//         });
//         newRequest.responseValidators = Object.assign({}, this.responseValidators, {
//             409: validator
//         });

//         return newRequest;
//     }

//     public withQueryParams(params: { [k: string]: string | number }): HttpRequest<TResponses> {
//         const keys = Object.keys(params);
//         if (keys.length) {
//             this.queryParams = '?' + keys.map(key => `${key}=${params[key]}`).join('&');
//         }
//         return this;
//     }

//     public withBody<TBody>(body: TBody): HttpRequest<TResponses> {
//         this.body = body;

//         return this;
//     }

//     public withoutRefresh(): HttpRequest<TResponses> {
//         this.autoRefresh = false;
//         return this;
//     }

//     public async send(): SendResponse<TResponses> {
//         const jwt = await getSensitiveData(LocalStorageKey.JWT);
//         const token = jwt.or(() => '');
//         const emailId = await getSensitiveData(LocalStorageKey.EMAIL);
//         const email = emailId.or(() => 'email');

//         const response = await this.trySendingResponse();

//         if (jwt.isSome() && isNormalResponse(response) && response.status === 401) {
//             if (this.autoRefresh === false) {
//                 return response;
//             }

//             const refreshRequest = await HttpRequest.post('security/token/refresh')
//                 .withBody({
//                     User: email,
//                     Token: token
//                 })
//                 .map200Response(validators.requestTokenResponse, r => ({ token: r.token }))
//                 .withoutRefresh()
//                 .send();

//             if (isNormalResponse(refreshRequest) && refreshRequest.status === 200) {
//                 await setSensitiveData(LocalStorageKey.JWT, refreshRequest.payload.token);
//                 return await this.trySendingResponse();
//             } else {
//                 return response;
//             }
//         } else {
//             return response;
//         }
//     }

//     private createRequest(path: string, jwt: Maybe<string>) {
//         return fetch(`${config.apiUrl}/${path}`, {
//             method: this.method,
//             headers: Object.assign(
//                 { 'Content-Type': 'application/json' },
//                 jwt.map(token => ({ Authorization: `Bearer ${token}` })).or(() => ({}))
//             ),
//             body: JSON.stringify(this.body)
//         });
//     }

//     private async trySendingResponse(): SendResponse<TResponses> {
//         const jwt = await getSensitiveData(LocalStorageKey.JWT);

//         try {
//             const endpoint = this.endpoint + (this.queryParams || '');
//             const response = await this.createRequest(endpoint, jwt);

//             const status = response.status;
//             const mapper = this.responseMappings[status];

//             if (mapper) {
//                 const validator = this.responseValidators[status];
//                 const responseBody = await response.json();
//                 let validated: any;
//                 try {
//                     validated = validator(responseBody);
//                 } catch (validationException) {
//                     console.warn(`Invalid response body for endpoint [${endpoint}]`, responseBody);
//                     return parseError(status);
//                 }
//                 const payload = mapper(validated);
//                 return expectedResponse({ status, payload }) as any;
//             } else {
//                 return expectedResponse({ status }) as any;
//             }
//         } catch (e) {
//             return networkFailure();
//         }
//     }

//     private getOptionals(): Optionals {
//         return {
//             body: this.body,
//             queryParams: this.queryParams,
//             autoRefresh: this.autoRefresh
//         };
//     }
// }
