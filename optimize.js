define(function (require) {
  return function (plugins, source, callback) {
    plugins = normalizePlugins(plugins);

    if (plugins === null) return callback(null, source);

    require(plugins.names, function () {
      try {
        for (var result = source, i = 0, length = plugins.length; i < length; i ++) {
          var plugin = arguments[i];
          var process = plugins[i].process;
          result = process(plugin, result);
        }
        callback(null, result);
      } catch (err) {
        callback(err);
      }
    });
  }

  function normalizePlugins(plugins) {
    if (!(plugins && plugins.length)) return null;

    var normalized = [];
    normalized.names = [];

    for (var i = 0, length = plugins.length; i < length; i ++) {
      var plugin = plugins[i];

      if (!plugin) return;

      var pluginName = plugin.name || plugin;
      var pluginProcess = plugin.process || defaultProcess;

      if (typeof pluginName !== 'string') return;
      if (typeof pluginProcess !== 'function') return;

      normalized.push({ name: pluginName, process: pluginProcess });
      normalized.names.push(pluginName);
    }

    if (normalized.length === 0) return null;

    return normalized;
  }

  function defaultProcess(plugin, source) {
    if (typeof plugin === 'function') return plugin(source);
    return source;
  }
});