const DEFAULT_OPTIONS = {
};

const options = () => ({
  name: 'options',
  onOptions: (opt, { defaultOptions }) => [DEFAULT_OPTIONS, defaultOptions, opt],
});

export default options;
