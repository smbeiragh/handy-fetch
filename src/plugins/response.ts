import {IPluginFactory} from "../types";
import { createResponse } from '../response';

const response: IPluginFactory = () => ({
  name: 'response',
  onReturn: (promise: Promise<any>, { options }) => promise.then(
    (orgResponse) => createResponse(orgResponse, options),
  ),
});

export default response;
