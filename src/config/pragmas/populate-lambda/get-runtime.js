let { is } = require('../../../lib')
let { aliases, runtimes } = require('lambda-runtimes')

// Runtime interpolater
module.exports = function getRuntime ({ config, inventory, name, type, errors }) {
  let { runtime } = config

  if (typeof runtime === 'string') {
    runtime = runtime.toLowerCase()
    let customRuntime = inventory._project?.customRuntimes?.[runtime]

    // Runtime is not actually an AWS value, but a shorthand/aliased name
    if (aliases[runtime]) {
      let aliased = aliases[runtime]
      config.runtime = runtimes[aliased][0]
      config.runtimeAlias = runtime
    }
    // Runtime is custom via plugin
    else if (customRuntime) {
      config.runtimeConfig = customRuntime
    }

    // Special case: compiled runtime is in conflict with a manually specified runtime
    let customRuntimeIsCompiled = inventory._project.build
    let compiledRuntime = inventory._project?.customRuntimes?.runtimes?.[0]
    if (customRuntimeIsCompiled &&
        compiledRuntime && (compiledRuntime !== runtime)) {
      errors.push(`Project is using compiled runtime ${compiledRuntime}, @${type} ${name} cannot use ${runtime}`)
    }
  }
  else if (is.defined(runtime)) {
    // Someone did something funky like specify a number or bool, so coerce and let it fail validation
    config.runtime = `${config.runtime}`
  }
  return config
}
