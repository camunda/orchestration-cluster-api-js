## [1.2.3](https://github.com/camunda/orchestration-cluster-api-js/compare/v1.2.2...v1.2.3) (2025-12-05)

### Bug Fixes

- support fetchVariables in job worker ([b672d8d](https://github.com/camunda/orchestration-cluster-api-js/commit/b672d8d3ec499624a58d1db2b8e920f3ccc77ebc))

## [1.2.2](https://github.com/camunda/orchestration-cluster-api-js/compare/v1.2.1...v1.2.2) (2025-12-01)

### Bug Fixes

- set default requestTimeout to 0 ([c18a22a](https://github.com/camunda/orchestration-cluster-api-js/commit/c18a22a0f5dacfcd6b16ac16d8260307a17f87d9))

## [1.2.1](https://github.com/camunda/orchestration-cluster-api-js/compare/v1.2.0...v1.2.1) (2025-11-28)

### Bug Fixes

- add job.error method ([285e743](https://github.com/camunda/orchestration-cluster-api-js/commit/285e743a0d6f0020ba5b25bf7f048748edcd63b4))

# [1.2.0](https://github.com/camunda/orchestration-cluster-api-js/compare/v1.1.5...v1.2.0) (2025-11-13)

### Features

- add silly level logging ([a8a4aad](https://github.com/camunda/orchestration-cluster-api-js/commit/a8a4aadd3556d5c441d63d2a9b3943a68dc747e5))

## [1.1.5](https://github.com/camunda/orchestration-cluster-api-js/compare/v1.1.4...v1.1.5) (2025-11-13)

### Bug Fixes

- use creds from SaaS correctly. fixes [#28](https://github.com/camunda/orchestration-cluster-api-js/issues/28) ([348bc9e](https://github.com/camunda/orchestration-cluster-api-js/commit/348bc9e3916b7a549ddd17215cd4367877805216))

## [1.1.4](https://github.com/camunda/orchestration-cluster-api-js/compare/v1.1.3...v1.1.4) (2025-11-13)

### Bug Fixes

- **ci:** prevent BUILDINFO drift from parallel matrix jobs ([45edce6](https://github.com/camunda/orchestration-cluster-api-js/commit/45edce610714cf8cb51ca31833f5469bc925085b))
- **gen:** regenerate artifacts ([da77e80](https://github.com/camunda/orchestration-cluster-api-js/commit/da77e809ca58c41f5486c392e46d6ad43954a369))
- mark methods experimental ([f88a8cd](https://github.com/camunda/orchestration-cluster-api-js/commit/f88a8cd6689774ff5cb08c279b04f788d2298375))
- remove pre-release note ([0c3c26d](https://github.com/camunda/orchestration-cluster-api-js/commit/0c3c26d4b674a33aa5f1a3e9c68f131f90411729))
- update dependencies ([faacf92](https://github.com/camunda/orchestration-cluster-api-js/commit/faacf92d995add72bcbc41e9740b9bf746b714e3))

## [1.1.3](https://github.com/camunda/orchestration-cluster-api-js/compare/v1.1.2...v1.1.3) (2025-11-10)

### Bug Fixes

- log backpressure at debug ([ef8fd69](https://github.com/camunda/orchestration-cluster-api-js/commit/ef8fd6999a39b8ed25a57a3647ec3b20928da640))

## [1.1.2](https://github.com/camunda/orchestration-cluster-api-js/compare/v1.1.1...v1.1.2) (2025-11-10)

### Bug Fixes

- fix typings upstream ([3b933df](https://github.com/camunda/orchestration-cluster-api-js/commit/3b933df98480e061baa67e2884fbbbea4e2cd797))
- specify poll timeout in worker ([7c8f217](https://github.com/camunda/orchestration-cluster-api-js/commit/7c8f217a5fa9b83dd40bc968121373a6bd78aea0))
- update some typings ([0085ac2](https://github.com/camunda/orchestration-cluster-api-js/commit/0085ac22ebadbd9fb581170162b164a00e3f5f57))

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
