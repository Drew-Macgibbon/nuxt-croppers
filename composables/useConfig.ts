// this will probably live in a config file, just added to composable for simplicity

export default function useConfig() {
  const cropperConfig = {
    working: 'hello from config',
    avatar: {},
    cover: {},
  };

  return {
    cropperConfig,
  };
}
