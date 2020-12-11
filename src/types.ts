export const INTERNALS = Symbol('Handy Fetch - Fetcher Internals');
export const CHAIN_INTERNALS = Symbol('Handy Fetch - Chain Info');
export const RESPONSE_INTERNALS = Symbol('Handy Fetch Response Internals');

export interface IHttpError {
  getResponse(): IHttpResponse,
  message: string,
  stack?: string,
  name: string,
  toReadableString():string
}

export interface IBadRequestError extends Error, IHttpError {
  isBadRequest():boolean,
  isUnauthorized():boolean,
  isForbidden():boolean,
  isNotFound():boolean,
  isUnprocessableEntity():boolean,
}

export interface IInternalServerError extends Error, IHttpError {
  isInternalServerError():boolean,
  isBadGateway():boolean,
  isServiceUnavailable():boolean,
  isGatewayTimeOut():boolean,
}

export interface IFetchOptions extends RequestInit {
  as?: "json" | "text" | "blob" | "arrayBuffer" | "buffer" | null,
  shouldParseBody?: boolean | ((response: IHttpResponse, options: IFetchOptions)=> any) | null
}

export type IFilter<TValue, TExtras> = {
  (value: TValue, extras: TExtras): TValue
} | undefined

export type TOnOptionsFilter = IFilter<IFetchOptions, {defaultOptions: IFetchOptions}>;
export type TOnReturnFilter = IFilter<Promise<any>, { options:IFetchOptions, defaultOptions: IFetchOptions}>;

export interface IPlugin {
  name: string,
  onOptions?: TOnOptionsFilter
  onReturn?: TOnReturnFilter
  helper?: boolean,
  getChain?(): IChain | IShallowChain
}

export interface IPluginFactory {
  ({ fetch, mergeOptions }: { fetch: IChain, mergeOptions: (...options: IFetchOptions[])=> IFetchOptions}): IPlugin
}

export type TFilters = "onReturn" | "onOptions";

export interface IFetcher {
  options: IChain,
  response: IChain,
  base: IChain,
  default: IChain,
  bodyParser: IChain,
  httpErrors: IChain,
  json: IChain,
  asJson: IChain,
  get: IChain,
  post: IChain,
  put: IChain,
  patch: IChain,
  delete: IChain,
  head: IChain
}

export interface IPluginsBag {
  [key: string]: IPlugin,
}

export interface IFetchInternals {
  plugins: IPluginsBag,
  pluginsList: string[],
  defaultOptions: IFetchOptions
}

export interface IFetch {
  (url: string, options?: IFetchOptions): Promise<any>,
  [INTERNALS]?: IFetchInternals
}

export interface IFetchWithInternals extends IFetch {
  [INTERNALS]: IFetchInternals
}

export interface IShallowChain {
  [CHAIN_INTERNALS]: IShallowChainInternals,
}

export interface IChain extends IFetch, IFetcher, IShallowChain {
  [CHAIN_INTERNALS]: IChainInternals,
  [INTERNALS]: IFetchInternals
  clone(shallow: boolean): IChain | IShallowChain,
  use(pluginFactory: IPluginFactory, options?: {name?: string, replace?: ()=>{} }): IChain,
  alias(alias: string, targetChain: IChain, replace? : boolean | (() => any)): IChain,
  fetch?(url: string, options: IFetchOptions): Promise<any>
}

export type TChainInfo = Array<{method: string}>;

export interface IShallowChainInternals {
  chainInfo: TChainInfo
}

export interface IChainInternals extends IShallowChainInternals{
  fetch: IFetchWithInternals
}

export type THeaders = HeadersInit;
export type TBody = BodyInit | Record<string|number, any>

export interface IHttpResponse {
  [RESPONSE_INTERNALS]: any,
  body: TBody,
  bodyUsed: boolean,
  url: string,
  status: number,
  statusText: string,
  ok: boolean,
  isOk: boolean,
  isBadRequest: boolean,
  isServerError: boolean,
  headers: HeadersInit,
  nativeResponse: any,
  json(): Promise<IHttpResponse>,
  text(): Promise<IHttpResponse>,
  blob(): Promise<IHttpResponse>,
  arrayBuffer(): Promise<IHttpResponse>,
  buffer?(): Promise<IHttpResponse>
}

export type TErrorCB<TError> = (e: TError)=> any;
