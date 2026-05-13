/**
 * Configuración de Babel para Expo.
 * El plugin de Reanimated debe ir al final (requisito oficial).
 */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
