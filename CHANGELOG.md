# [8.9.0-alpha.22](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.21...v8.9.0-alpha.22) (2026-03-30)


### Bug Fixes

* address PR review comments ([ae51b85](https://github.com/camunda/orchestration-cluster-api-js/commit/ae51b8534239de5bb0ca61c1897dfe89514a740d))
* address PR review comments on job corrections ([3a82c3a](https://github.com/camunda/orchestration-cluster-api-js/commit/3a82c3a06e25f589ccc9638aba191affa8f25948))
* address review comments on PR [#85](https://github.com/camunda/orchestration-cluster-api-js/issues/85) ([3d3a810](https://github.com/camunda/orchestration-cluster-api-js/commit/3d3a8109742e6b3fec2e17aecc729565da871ed9))
* restore 'Later, on shutdown:' comment and fix test formatting ([aed9ba5](https://github.com/camunda/orchestration-cluster-api-js/commit/aed9ba5eb0ed5351da0c1c2a84cf3b40c88f63b5))


### Features

* support job corrections in worker job.complete() ([790e15d](https://github.com/camunda/orchestration-cluster-api-js/commit/790e15d675ef3fea09c47cb820a1bc960a075ff6))

# [8.9.0-alpha.21](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.20...v8.9.0-alpha.21) (2026-03-25)


### Bug Fixes

* add void suppressions and fix unused variables in examples ([36c8c6d](https://github.com/camunda/orchestration-cluster-api-js/commit/36c8c6d2e42a7c8c9ac6586d1ab0125d96bb5715))

# [8.9.0-alpha.20](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.19...v8.9.0-alpha.20) (2026-03-24)

### Bug Fixes

- remove unused p-retry dependency ([4065fa2](https://github.com/camunda/orchestration-cluster-api-js/commit/4065fa2dcd7074c457c2b1cf2b349177e9b26780))

# [8.9.0-alpha.19](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.18...v8.9.0-alpha.19) (2026-03-23)

### Bug Fixes

- address PR review comments ([028f361](https://github.com/camunda/orchestration-cluster-api-js/commit/028f361e31a6b84e0446eda095f67c0c9b9b68eb))
- address review feedback for Node 20 compat and type imports ([de1000c](https://github.com/camunda/orchestration-cluster-api-js/commit/de1000cde930a4bd0f55d5d538a1622a6800c824))
- correct type errors in readme examples ([ddea9ad](https://github.com/camunda/orchestration-cluster-api-js/commit/ddea9ad241cdce0bbe99917319dd2c9d9722645e))

### Features

- add compilable README examples with snippet sync ([a687a47](https://github.com/camunda/orchestration-cluster-api-js/commit/a687a47bf628c5da9f2a94677cdf79b5fcaf0671))

# [8.9.0-alpha.18](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.17...v8.9.0-alpha.18) (2026-03-21)

### Bug Fixes

- prevent fetch wrapper accumulation and abort listener leak ([b5658d6](https://github.com/camunda/orchestration-cluster-api-js/commit/b5658d6ec8567d4dc5215400a3d154b9caa47f7f))

# [8.9.0-alpha.17](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.16...v8.9.0-alpha.17) (2026-03-20)

### Features

- lazy-load zod validation schemas to reduce baseline memory footprint ([3d598ef](https://github.com/camunda/orchestration-cluster-api-js/commit/3d598effb41fa31a25eaf743160858f9eee18d83))

# [8.9.0-alpha.16](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.15...v8.9.0-alpha.16) (2026-03-19)

### Bug Fixes

- threaded worker performance regression fix ([dad2fa8](https://github.com/camunda/orchestration-cluster-api-js/commit/dad2fa88f5598bc9530745e44628fefa417e6e23))
- use correct default port in docker-compose ([3cb1641](https://github.com/camunda/orchestration-cluster-api-js/commit/3cb16417f97bb3f64f646bc85857ae4ed38708c1))

# [8.9.0-alpha.15](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.14...v8.9.0-alpha.15) (2026-03-19)

### Bug Fixes

- respawn worker threads after error/exit ([0155eff](https://github.com/camunda/orchestration-cluster-api-js/commit/0155eff714ba0fb6c7b81e3883977da87008972a))

# [8.9.0-alpha.14](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.13...v8.9.0-alpha.14) (2026-03-18)

### Bug Fixes

- address PR review comments for threaded worker ([3eabf5d](https://github.com/camunda/orchestration-cluster-api-js/commit/3eabf5dfc2424a875a498978acec7a865a0d151b))
- emit threadWorkerEntry to dist and resolve path in ESM ([3f00041](https://github.com/camunda/orchestration-cluster-api-js/commit/3f0004199040fbc904426520efccdd9528b2afcd))
- fix constraint validation for unicode regex ([8347376](https://github.com/camunda/orchestration-cluster-api-js/commit/834737664db9a76177cd9f7c652141bc20a45ddb))

### Features

- add performance test, rebuild latest ([1984ad3](https://github.com/camunda/orchestration-cluster-api-js/commit/1984ad38a83f1c652e1f30b2e9751e9800b8cf2e))
- add threadedJobWorker ([1e6b049](https://github.com/camunda/orchestration-cluster-api-js/commit/1e6b049c09cd7078c70b020cc4f9370f527a444d))
- build from latest stable/8.9 ([2798004](https://github.com/camunda/orchestration-cluster-api-js/commit/279800491c202f46b0fea7efc8a7a3ced328a339))
- rebuild from latest stable/8.9 ([e2c8d04](https://github.com/camunda/orchestration-cluster-api-js/commit/e2c8d04280f4991eb5e2564688bc9dbce3c748a8))

# [8.9.0-alpha.13](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.12...v8.9.0-alpha.13) (2026-03-09)

### Features

- add backoff-at-floor to backpressure algorithm ([a0504bc](https://github.com/camunda/orchestration-cluster-api-js/commit/a0504bcdfd3e24c47e168cddc59aeae957bfc8dd))

# [8.9.0-alpha.12](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.11...v8.9.0-alpha.12) (2026-03-08)

### Features

- build from hardened contract in 8.9 ([03ef35a](https://github.com/camunda/orchestration-cluster-api-js/commit/03ef35a9cda1913bf11bd42b07ae95829d4118cc))

# [8.9.0-alpha.11](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.10...v8.9.0-alpha.11) (2026-03-06)

### Features

- add per-operation retry config. New tuning for backpressure ([9dd921a](https://github.com/camunda/orchestration-cluster-api-js/commit/9dd921a0eae67d56d0e8a7d6423ac7d8a3edd3b4))

# [8.9.0-alpha.10](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.9...v8.9.0-alpha.10) (2026-03-05)

### Features

- tune backpressure ([b64c6f1](https://github.com/camunda/orchestration-cluster-api-js/commit/b64c6f14a5b4755881cb1c79c804a5cd8403145f))

# [8.9.0-alpha.9](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.8...v8.9.0-alpha.9) (2026-03-05)

### Features

- add startup jitter for workers ([95b431d](https://github.com/camunda/orchestration-cluster-api-js/commit/95b431d97fc42aaddfde0b744a8ad94bf82ce401))
- regenerate from stable/8.9 ([390a04e](https://github.com/camunda/orchestration-cluster-api-js/commit/390a04e6ea06b462ffd6d77d4ed10a3bf31dffda))

# [8.9.0-alpha.8](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.7...v8.9.0-alpha.8) (2026-03-02)

### Features

- support deprecated enums ([a1a2290](https://github.com/camunda/orchestration-cluster-api-js/commit/a1a22908fef6ca75ce353b851d4b6aabd7aa4522))

# [8.9.0-alpha.7](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.6...v8.9.0-alpha.7) (2026-03-02)

### Bug Fixes

- rebuild from upstream spec ([efd13cb](https://github.com/camunda/orchestration-cluster-api-js/commit/efd13cbaec2e3fa2c0a8c0578f5d5b0fa0101715))

# [8.9.0-alpha.6](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.5...v8.9.0-alpha.6) (2026-02-17)

### Features

- regenerate from latest schema ([c2d9dff](https://github.com/camunda/orchestration-cluster-api-js/commit/c2d9dffe96f645d2043f62335ef97bdc381b37b1))

## [1.2.4-alpha.1](https://github.com/camunda/orchestration-cluster-api-js/compare/v1.2.3...v1.2.4-alpha.1) (2026-01-22)

### Bug Fixes

- correctly type optional parameters ([8fef8c8](https://github.com/camunda/orchestration-cluster-api-js/commit/8fef8c8a4bc69a3dd86b76ac1e01431d97607050))
- enhance response validation error message ([d138134](https://github.com/camunda/orchestration-cluster-api-js/commit/d1381348f46c187e8321fdec088b7654b70c4fa8))
- handle multi-part spec ([86ac930](https://github.com/camunda/orchestration-cluster-api-js/commit/86ac930e3b599126cf5446bcaa323089049bb4ef))
- **spec:** prevent path-local $like refs breaking dts build ([3b75200](https://github.com/camunda/orchestration-cluster-api-js/commit/3b75200caeffb198f072668567cff7e34f5700f0))

### Features

- build 8.9 from monorepo spec ([a80303d](https://github.com/camunda/orchestration-cluster-api-js/commit/a80303d3a54f2d6db77c428f46848f131bd8bf42))
- build from 8.9 spec ([e4ab53c](https://github.com/camunda/orchestration-cluster-api-js/commit/e4ab53cd253ca5d1fcf2d0bf0626c8d26c7da49c))

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
