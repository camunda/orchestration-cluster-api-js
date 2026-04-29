## [9.1.2](https://github.com/camunda/orchestration-cluster-api-js/compare/v9.1.1...v9.1.2) (2026-04-29)


### Bug Fixes

* **gen:** apply CAMUNDA_DEFAULT_TENANT_ID to activateJobs tenantIds ([479ee41](https://github.com/camunda/orchestration-cluster-api-js/commit/479ee4189ab854a3ac8d199e887cb22d16e360ed))

## [9.1.1](https://github.com/camunda/orchestration-cluster-api-js/compare/v9.1.0...v9.1.1) (2026-04-29)


### Bug Fixes

* **docker:** resolve ambiguous numberOfReplicas config ([78a64bc](https://github.com/camunda/orchestration-cluster-api-js/commit/78a64bc33e4f19d3df40a16161d7f6288a30a5d6))

# [9.1.0](https://github.com/camunda/orchestration-cluster-api-js/compare/v9.0.4...v9.1.0) (2026-04-14)


### Bug Fixes

* add range to stable branch config for semantic-release ordering ([5bd8efd](https://github.com/camunda/orchestration-cluster-api-js/commit/5bd8efda0eaf230698f71eb5d04847fd886fe50b))
* remove range from current stable branch to fix ERELEASEBRANCHES ([6863f2c](https://github.com/camunda/orchestration-cluster-api-js/commit/6863f2c9d616b91e9c6ff3ea12cf82bc492d2317))
* remove range from main prerelease branch config ([bcca3cf](https://github.com/camunda/orchestration-cluster-api-js/commit/bcca3cf2a819c475f938ae15f9175fe9550a925c))


### Features

* add example-app for SDK smoke testing ([a08e2ee](https://github.com/camunda/orchestration-cluster-api-js/commit/a08e2ee2864dc148e33e6df2261ad0d67dd9ec17))

## [9.0.4](https://github.com/camunda/orchestration-cluster-api-js/compare/v9.0.3...v9.0.4) (2026-04-14)


### Bug Fixes

* add range constraint for main branch alpha prereleases ([91ad247](https://github.com/camunda/orchestration-cluster-api-js/commit/91ad247c0fbc691269175a8c82e0bb1c70b25876))

## [9.0.3](https://github.com/camunda/orchestration-cluster-api-js/compare/v9.0.2...v9.0.3) (2026-04-14)


### Bug Fixes

* add built-in defaults for maxParallelJobs and jobTimeoutMs in worker constructors ([23674c4](https://github.com/camunda/orchestration-cluster-api-js/commit/23674c4a853718b7546bd7b67184382823666f8f)), closes [#145](https://github.com/camunda/orchestration-cluster-api-js/issues/145)

## [9.0.2](https://github.com/camunda/orchestration-cluster-api-js/compare/v9.0.1...v9.0.2) (2026-04-14)


### Bug Fixes

* **docs:** add npm badges to README ([8cf1f73](https://github.com/camunda/orchestration-cluster-api-js/commit/8cf1f738710c4831ea57a74e9a4e050a5b03e5bb))

## [9.0.1](https://github.com/camunda/orchestration-cluster-api-js/compare/v9.0.0...v9.0.1) (2026-04-14)


### Bug Fixes

* release stable 9 SDK for Camunda server 8.9 ([671deb9](https://github.com/camunda/orchestration-cluster-api-js/commit/671deb9a1f67d665c1dfe0976c00656934d683d0))

# [8.9.0-alpha.38](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.37...v8.9.0-alpha.38) (2026-04-13)


### Bug Fixes

* address PR review — fix misleading comment, add runtime enum tests ([83ca607](https://github.com/camunda/orchestration-cluster-api-js/commit/83ca607e22bc3383c3de603f2afa87b4a8fea1a1))
* remove invisible character in JSDoc, add exhaustive enum test ([a27df8d](https://github.com/camunda/orchestration-cluster-api-js/commit/a27df8d7786fff9711be5c9d4bfeb43a9115c51b))


### Features

* generate runtime enum value objects for type-safe validation ([4df78de](https://github.com/camunda/orchestration-cluster-api-js/commit/4df78de569f6db1c3ccc2015bebe1b87d19425a1)), closes [#127](https://github.com/camunda/orchestration-cluster-api-js/issues/127)

# [8.9.0-alpha.37](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.36...v8.9.0-alpha.37) (2026-04-09)


### Bug Fixes

* fix for pull request finding ([e5f17cb](https://github.com/camunda/orchestration-cluster-api-js/commit/e5f17cb9d5c0ce73f6456018d9a27384597733b7))
* prefer deployResourcesFromFiles in API spec examples ([fc4eb38](https://github.com/camunda/orchestration-cluster-api-js/commit/fc4eb38ec1e20d053c67a55d06d8dc68bfb2ce91))

# [8.9.0-alpha.36](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.35...v8.9.0-alpha.36) (2026-04-09)


### Bug Fixes

* address review comments on PR [#110](https://github.com/camunda/orchestration-cluster-api-js/issues/110) ([5a0eaf0](https://github.com/camunda/orchestration-cluster-api-js/commit/5a0eaf0dbd22437b9160f568f37a1215b0d0983d))

# [8.9.0-alpha.35](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.34...v8.9.0-alpha.35) (2026-04-09)


### Bug Fixes

* address review comments on PR [#125](https://github.com/camunda/orchestration-cluster-api-js/issues/125) ([6e82793](https://github.com/camunda/orchestration-cluster-api-js/commit/6e82793e4d80a72cd7e7ea168299dcda7268673f))
* replace z.coerce.bigint() with z.coerce.number() for int64 fields ([b0b592a](https://github.com/camunda/orchestration-cluster-api-js/commit/b0b592ad57b3d3cdd9a6976c01107b922c4deeef)), closes [#124](https://github.com/camunda/orchestration-cluster-api-js/issues/124)

# [8.9.0-alpha.34](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.33...v8.9.0-alpha.34) (2026-04-09)


### Bug Fixes

* add missing examples for all template methods (green) ([6fabac5](https://github.com/camunda/orchestration-cluster-api-js/commit/6fabac5bf3423037d4d7d05d9c176d0a45422b5c)), closes [#122](https://github.com/camunda/orchestration-cluster-api-js/issues/122)
* Update scripts/check-method-example-completeness.cjs ([8503c12](https://github.com/camunda/orchestration-cluster-api-js/commit/8503c120b65bf4002fbe153e1b790ed6e2342130))

# [8.9.0-alpha.33](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.32...v8.9.0-alpha.33) (2026-04-09)


### Bug Fixes

* exclude union response schemas from VOID_RESPONSES set ([52c36ab](https://github.com/camunda/orchestration-cluster-api-js/commit/52c36abaacaf79398f47f35b4bbd28d25663ae17)), closes [#120](https://github.com/camunda/orchestration-cluster-api-js/issues/120)
* remove accidentally committed .tmp-clone gitlink ([9301965](https://github.com/camunda/orchestration-cluster-api-js/commit/9301965ce991135bff9dcc4301cc026c8fc92d4c))

# [8.9.0-alpha.32](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.31...v8.9.0-alpha.32) (2026-04-09)


### Bug Fixes

* disable source links in TypeDoc markdown to prevent SHA churn ([6754e9c](https://github.com/camunda/orchestration-cluster-api-js/commit/6754e9c2739893501ad99efc27809dda25110129))

# [8.9.0-alpha.31](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.30...v8.9.0-alpha.31) (2026-04-09)


### Bug Fixes

* wrap [@example](https://github.com/example) code in fenced blocks for TypeDoc markdown rendering ([b1aaa63](https://github.com/camunda/orchestration-cluster-api-js/commit/b1aaa6318ef86d134bdef114af5504a0519937c0))

# [8.9.0-alpha.30](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.29...v8.9.0-alpha.30) (2026-04-09)


### Bug Fixes

* make strip regex CRLF-safe for idempotent injection ([4bab8a4](https://github.com/camunda/orchestration-cluster-api-js/commit/4bab8a4d6fd5eaf19567a837c711fd8035604eb6))


### Features

* inline example code in JSDoc for IntelliSense ([26a51d0](https://github.com/camunda/orchestration-cluster-api-js/commit/26a51d0310b129b78b45e8636742dc32804967ad))

# [8.9.0-alpha.29](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.28...v8.9.0-alpha.29) (2026-04-08)


### Bug Fixes

* validate SDK_MODE against supported modes in benchmark scripts ([5aa1785](https://github.com/camunda/orchestration-cluster-api-js/commit/5aa1785eda4aa456a7350e33376a1122fec2269d))

# [8.9.0-alpha.28](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.27...v8.9.0-alpha.28) (2026-04-08)


### Bug Fixes

* shorten discriminant labels for multi-entry operations ([701aed6](https://github.com/camunda/orchestration-cluster-api-js/commit/701aed6a471ef2b138380e34f14c1d0f4d3469c5))


### Features

* add imports field to operation-map entries ([a7ecf5f](https://github.com/camunda/orchestration-cluster-api-js/commit/a7ecf5fc68277565afecb2518de583e9f345de9b))

# [8.9.0-alpha.27](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.26...v8.9.0-alpha.27) (2026-04-02)


### Bug Fixes

* address review comments on mTLS tests and docs ([c7c26df](https://github.com/camunda/orchestration-cluster-api-js/commit/c7c26df1e3ab4bff848a5c4de7eacfc8e62f310a))


### Features

* support CA-only TLS (self-signed server certs) ([25f11a7](https://github.com/camunda/orchestration-cluster-api-js/commit/25f11a75a74e4cd32f5ada5ff8d41fc50398b902)), closes [#108](https://github.com/camunda/orchestration-cluster-api-js/issues/108)

# [8.9.0-alpha.26](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.25...v8.9.0-alpha.26) (2026-04-02)


### Bug Fixes

* address PR review comments ([eac304d](https://github.com/camunda/orchestration-cluster-api-js/commit/eac304d5aceec4d1b6d4e9c07cd68169019db928))
* correct type errors in SDK examples ([4c95f12](https://github.com/camunda/orchestration-cluster-api-js/commit/4c95f12cf06e69d7b48b3e563cbddd6ebcefcfb7))
* remove redundant dynamic UserTaskKey imports ([078f083](https://github.com/camunda/orchestration-cluster-api-js/commit/078f08332fc6b6b5600d25241b4fa94869d3278a))

# [8.9.0-alpha.25](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.24...v8.9.0-alpha.25) (2026-04-01)


### Bug Fixes

* remove duplicate import ([48f6d95](https://github.com/camunda/orchestration-cluster-api-js/commit/48f6d95f37b023c2d1b39f182ea8cc4c062bb88f))


### Features

* embed specHash from spec-metadata.json in published package ([1377f44](https://github.com/camunda/orchestration-cluster-api-js/commit/1377f44e505f524a2d43844227a71b904f1a4e90)), closes [#90](https://github.com/camunda/orchestration-cluster-api-js/issues/90)
* embed specHash from spec-metadata.json in published package ([3e0b4f8](https://github.com/camunda/orchestration-cluster-api-js/commit/3e0b4f805551a0d516b2feb358b065eca45081b8)), closes [#90](https://github.com/camunda/orchestration-cluster-api-js/issues/90)

# [8.9.0-alpha.24](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.23...v8.9.0-alpha.24) (2026-03-30)


### Bug Fixes

* harden README code injection ([4745468](https://github.com/camunda/orchestration-cluster-api-js/commit/47454684f052027e1449367204e7097b2b26f271)), closes [#87](https://github.com/camunda/orchestration-cluster-api-js/issues/87)

# [8.9.0-alpha.23](https://github.com/camunda/orchestration-cluster-api-js/compare/v8.9.0-alpha.22...v8.9.0-alpha.23) (2026-03-30)


### Bug Fixes

* address PR review comments ([fd357d5](https://github.com/camunda/orchestration-cluster-api-js/commit/fd357d5938dbb0e22d18711087b26560a802494c))
* address PR review comments on heritable worker defaults ([efec39c](https://github.com/camunda/orchestration-cluster-api-js/commit/efec39c54c788f625f27f7be70c830321ff43ef6))
* **config:** add signedInt schema type for CAMUNDA_WORKER_REQUEST_TIMEOUT ([9f9f794](https://github.com/camunda/orchestration-cluster-api-js/commit/9f9f7949e3b1cfcf90ab8abf723595276c41a18d))
* **tests:** convert threaded handler fixtures to .js for Node 20 compat ([1e5f7b1](https://github.com/camunda/orchestration-cluster-api-js/commit/1e5f7b17931043adade84c7630264a1ed543cf2a))
* **threadedJobWorker:** extract validated fields to fix TS strict null errors ([7097cbd](https://github.com/camunda/orchestration-cluster-api-js/commit/7097cbde12076b8ba0d35208cedf7ebe1c891493))
* **threadPool:** don't pass TS strip flags to workers on Node < 22 ([dbf18d3](https://github.com/camunda/orchestration-cluster-api-js/commit/dbf18d3ab92ed1fd5fdf54988c1f613eaf7b09e3))
* use number types for int config overrides in tests and examples ([f7bfa2f](https://github.com/camunda/orchestration-cluster-api-js/commit/f7bfa2f3d9be5152d4cf9a1ca6d0d4f8c117e14b))
* wire README worker-defaults examples into snippet injection ([7759561](https://github.com/camunda/orchestration-cluster-api-js/commit/775956168f588dd02bf6e969ed641f3abb67e288))


### Features

* heritable worker defaults via CAMUNDA_WORKER_* env vars ([0311308](https://github.com/camunda/orchestration-cluster-api-js/commit/03113084fb15566bdf7d3bbb3d0d6e78ef582584))

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
