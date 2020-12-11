import {IPluginFactory, IPlugin} from "../types";

const DEFAULT_OPTIONS = {
};

const options: IPluginFactory = ({mergeOptions}) => ({
  name: 'options',
  onOptions: (opt, { defaultOptions }) => mergeOptions(DEFAULT_OPTIONS, defaultOptions, opt),
} as IPlugin);

export default options;
