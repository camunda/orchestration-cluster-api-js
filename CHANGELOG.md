## [1.1.1](https://github.com/camunda/orchestration-cluster-api-js/compare/v1.1.0...v1.1.1) (2025-11-07)

### Bug Fixes

- preserve cancelable promise in loose client ([c1d49ba](https://github.com/camunda/orchestration-cluster-api-js/commit/c1d49ba3f38be97fa8e2d212b6ccbc3158256a5d))

# [1.1.0](https://github.com/camunda/orchestration-cluster-api-js/compare/v1.0.0...v1.1.0) (2025-11-05)

### Features

- add CamundaSupportLogger ([2562abc](https://github.com/camunda/orchestration-cluster-api-js/commit/2562abc2849161d5a306fda19776eb30c2ab56b4))
- enrich activated jobs with resolution methods ([2bbd361](https://github.com/camunda/orchestration-cluster-api-js/commit/2bbd36142abc21b34f9b9aaa16639efa6859835c))
- log telemetry at trace level ([822bf29](https://github.com/camunda/orchestration-cluster-api-js/commit/822bf29f9ef6add9f6d5668e024f8376bf2483e8))
- propagate cancel throw to caller ([c69fc0c](https://github.com/camunda/orchestration-cluster-api-js/commit/c69fc0c52881498c32b80da310a922892d92b06f))
- use injected support logger ([b46606b](https://github.com/camunda/orchestration-cluster-api-js/commit/b46606bfd49e2dcf57e5e852a15142115188a4de))

# 1.0.0 (2025-10-23)

### Bug Fixes

- add v2 to configured REST address ([21899b2](https://github.com/camunda/orchestration-cluster-api-js/commit/21899b29b1487d43156e6f552230e3319d26e545))
- add v2 to default base url ([5812e21](https://github.com/camunda/orchestration-cluster-api-js/commit/5812e212fe8276f0accb78b060d281439717d3aa))
- enrich createResource after validation ([8a31753](https://github.com/camunda/orchestration-cluster-api-js/commit/8a317538176a0d83d16d4f4c1badf8d150ec0292))

### Features

- add camundacon demos ([f7b8d9c](https://github.com/camunda/orchestration-cluster-api-js/commit/f7b8d9c99ab1dcf4c699ae9343ea95b3df843469))
- add default TenantId config ([e881fe2](https://github.com/camunda/orchestration-cluster-api-js/commit/e881fe2d1d7f7aebdb400abdd3148fae57b03b51))
- add default tenantId to json bodies ([96a1730](https://github.com/camunda/orchestration-cluster-api-js/commit/96a1730bb8da8479f3236fb2aaeda5a4750cceaf))
- add global adaptive backpressure ([2fbb5c8](https://github.com/camunda/orchestration-cluster-api-js/commit/2fbb5c85396b04d0b54ae1aa7b91780bbc0bec01))
- add retry, fix tests ([94aac1c](https://github.com/camunda/orchestration-cluster-api-js/commit/94aac1c630cc6cf61a5ab7498f0e1f0d7ad5bc1d))
- allow backpressure profile via ctor ([64f88b0](https://github.com/camunda/orchestration-cluster-api-js/commit/64f88b0f34a28fced50482b3564a2429fb13e452))
- backoff on 500 and 503 ([9909ebc](https://github.com/camunda/orchestration-cluster-api-js/commit/9909ebcb22ffe37f2f14954225c727a010995423))
- backpressure legacy mode ([4c92277](https://github.com/camunda/orchestration-cluster-api-js/commit/4c92277c99362bbf80013494e7ac481ee23f42e2))
- camundacon demos ([8e0f7ad](https://github.com/camunda/orchestration-cluster-api-js/commit/8e0f7ad986bb52f5fcaccad648e43fbc4b983930))
- cross-platform Camunda 8 OC API client ([2e47bd7](https://github.com/camunda/orchestration-cluster-api-js/commit/2e47bd765f57e4b37fa64446132eeb8c9d4bab02))
- enable backpressure tuning ([923efe3](https://github.com/camunda/orchestration-cluster-api-js/commit/923efe3df5b22533f9ff5e5839d0fda0228643a9))
- implement job worker ([4fc3501](https://github.com/camunda/orchestration-cluster-api-js/commit/4fc3501a45ea5de4cc206897cbddaf704d6f76e7))
- use es for camundacon ([d598a1e](https://github.com/camunda/orchestration-cluster-api-js/commit/d598a1e5e91573976bb2d9e2ce6e3c2ea4e7ba03))
