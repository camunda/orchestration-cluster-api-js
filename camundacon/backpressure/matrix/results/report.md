# JS SDK Backpressure Matrix Report

Generated: 2026-03-12 04:03:55

## Parameters

- **Target per client**: 10000
- **Pre-created instances**: 50000 (BALANCED backpressure, before workers start)
- **Client concurrency**: 32
- **Activate batch**: 32
- **Payload**: 10 KB per instance
- **Container restarted** between each run
- **SDK modes**: rest-disabled (LEGACY/no BP), rest-balanced (BALANCED BP), grpc-stream (@camunda8/sdk streamJobs), grpc-poll (@camunda8/sdk createWorker)
- **Clusters**: 1broker (single broker, high pressure), 3broker (3-broker cluster, reduced pressure)

## Results Summary

| Cluster | Clients | SDK Mode | Handler | Isolation | Throughput | Errors | QFull | Wall-clock | Jain | Status |
|---------|---------|----------|---------|-----------|------------|--------|-------|------------|------|--------|
| 1broker | 5 | grpc-poll | cpu | ind | 156.8/s | 2397 ⚠️ | 0 | 300.3s | 0.991 | ok |
| 1broker | 5 | grpc-poll | http | ind | 110.0/s | 1874 ⚠️ | 0 | 315.6s | 0.999 | ok |
| 1broker | 5 | grpc-stream | cpu | ind | 14.4/s | 6937 ⚠️ | 0 | 300.0s | 1.000 | ok |
| 1broker | 5 | grpc-stream | http | ind | 20.7/s | 6953 ⚠️ | 0 | 300.0s | 0.998 | ok |
| 1broker | 5 | rest-balanced | cpu | ind | 180.1/s | 2964 ⚠️ | 0 | 277.8s | 1.000 | ok |
| 1broker | 5 | rest-balanced | http | ind | 160.3/s | 2818 ⚠️ | 0 | 300.1s | 1.000 | ok |
| 1broker | 5 | rest-disabled | cpu | ind | 129.6/s | 36644 ⚠️ | 0 | 300.1s | 1.000 | ok |
| 1broker | 5 | rest-disabled | http | ind | 99.0/s | 43863 ⚠️ | 0 | 300.1s | 1.000 | ok |
| 1broker | 5 | grpc-poll | cpu | shr | 45.8/s | 10664 ⚠️ | 0 | 300.1s | 1.000 | ok |
| 1broker | 5 | grpc-poll | http | shr | 11.0/s | 16917 ⚠️ | 0 | 300.0s | 1.000 | ok |
| 1broker | 5 | grpc-stream | cpu | shr | 20.5/s | 19435 ⚠️ | 0 | 300.0s | 1.000 | ok |
| 1broker | 5 | grpc-stream | http | shr | 18.4/s | 24723 ⚠️ | 0 | 300.0s | 1.000 | ok |
| 1broker | 5 | rest-balanced | cpu | shr | 67.3/s | 8089 ⚠️ | 0 | 300.0s | 1.000 | ok |
| 1broker | 5 | rest-balanced | http | shr | 33.1/s | 9497 ⚠️ | 0 | 300.0s | 1.000 | ok |
| 1broker | 5 | rest-disabled | cpu | shr | 16.4/s | 231438 ⚠️ | 0 | 300.0s | 1.000 | ok |
| 1broker | 5 | rest-disabled | http | shr | 18.2/s | 205473 ⚠️ | 0 | 300.0s | 1.000 | ok |
| 1broker | 10 | grpc-poll | cpu | ind | 234.3/s | 2307 ⚠️ | 0 | 300.0s | 0.987 | ok |
| 1broker | 10 | grpc-poll | http | ind | 234.1/s | 2421 ⚠️ | 0 | 300.2s | 0.998 | ok |
| 1broker | 10 | grpc-stream | cpu | ind | 30.7/s | 4476 ⚠️ | 0 | 300.1s | 0.997 | ok |
| 1broker | 10 | grpc-stream | http | ind | 29.4/s | 3082 ⚠️ | 0 | 300.1s | 0.998 | ok |
| 1broker | 10 | rest-balanced | cpu | ind | 214.1/s | 3762 ⚠️ | 0 | 300.0s | 0.999 | ok |
| 1broker | 10 | rest-balanced | http | ind | 216.5/s | 3279 ⚠️ | 0 | 300.0s | 0.999 | ok |
| 1broker | 10 | rest-disabled | cpu | ind | 146.1/s | 62278 ⚠️ | 0 | 300.1s | 0.998 | ok |
| 1broker | 10 | rest-disabled | http | ind | 172.7/s | 67480 ⚠️ | 0 | 300.0s | 0.999 | ok |
| 1broker | 10 | grpc-poll | cpu | shr | 29.8/s | 18280 ⚠️ | 0 | 300.0s | 1.000 | ok |
| 1broker | 10 | grpc-poll | http | shr | 17.8/s | 21275 ⚠️ | 0 | 300.0s | 1.000 | ok |
| 1broker | 10 | grpc-stream | cpu | shr | 16.4/s | 33262 ⚠️ | 0 | 300.0s | 1.000 | ok |
| 1broker | 10 | grpc-stream | http | shr | 26.0/s | 34173 ⚠️ | 0 | 300.0s | 1.000 | ok |
| 1broker | 10 | rest-balanced | cpu | shr | 48.3/s | 21834 ⚠️ | 0 | 300.0s | 1.000 | ok |
| 1broker | 10 | rest-balanced | http | shr | 34.1/s | 20862 ⚠️ | 0 | 300.0s | 1.000 | ok |
| 1broker | 10 | rest-disabled | cpu | shr | 9.9/s | 475175 ⚠️ | 0 | 300.0s | 0.998 | ok |
| 1broker | 10 | rest-disabled | http | shr | 10.9/s | 459783 ⚠️ | 0 | 300.0s | 0.999 | ok |
| 3broker | 5 | grpc-poll | cpu | ind | 453.7/s | 0 | 0 | 110.5s | 1.000 | ok |
| 3broker | 5 | grpc-poll | http | ind | 321.2/s | 0 | 0 | 156.0s | 1.000 | ok |
| 3broker | 5 | grpc-stream | cpu | ind | 71.4/s | 0 | 0 | 300.0s | 1.000 | ok |
| 3broker | 5 | grpc-stream | http | ind | 71.2/s | 0 | 0 | 300.0s | 1.000 | ok |
| 3broker | 5 | rest-balanced | cpu | ind | 398.5/s | 0 | 0 | 125.7s | 1.000 | ok |
| 3broker | 5 | rest-balanced | http | ind | 322.2/s | 0 | 0 | 155.3s | 1.000 | ok |
| 3broker | 5 | rest-disabled | cpu | ind | 428.8/s | 0 | 0 | 116.7s | 1.000 | ok |
| 3broker | 5 | rest-disabled | http | ind | 327.3/s | 0 | 0 | 152.9s | 1.000 | ok |
| 3broker | 5 | grpc-poll | cpu | shr | 207.8/s | 2 ⚠️ | 0 | 240.7s | 1.000 | ok |
| 3broker | 5 | grpc-poll | http | shr | 75.0/s | 0 | 0 | 300.1s | 1.000 | ok |
| 3broker | 5 | grpc-stream | cpu | shr | 68.7/s | 33 ⚠️ | 0 | 300.0s | 1.000 | ok |
| 3broker | 5 | grpc-stream | http | shr | 62.5/s | 404 ⚠️ | 0 | 300.0s | 1.000 | ok |
| 3broker | 5 | rest-balanced | cpu | shr | 264.3/s | 0 | 0 | 189.4s | 1.000 | ok |
| 3broker | 5 | rest-balanced | http | shr | 104.1/s | 0 | 0 | 300.0s | 1.000 | ok |
| 3broker | 5 | rest-disabled | cpu | shr | 216.0/s | 19730 ⚠️ | 0 | 231.7s | 1.000 | ok |
| 3broker | 5 | rest-disabled | http | shr | 96.9/s | 20879 ⚠️ | 0 | 300.0s | 1.000 | ok |
| 3broker | 10 | grpc-poll | cpu | ind | 547.0/s | 0 | 0 | 183.0s | 1.000 | ok |
| 3broker | 10 | grpc-poll | http | ind | 471.1/s | 4 ⚠️ | 0 | 212.5s | 1.000 | ok |
| 3broker | 10 | grpc-stream | cpu | ind | 72.1/s | 20 ⚠️ | 0 | 300.1s | 0.999 | ok |
| 3broker | 10 | grpc-stream | http | ind | 71.4/s | 23 ⚠️ | 0 | 300.0s | 1.000 | ok |
| 3broker | 10 | rest-balanced | cpu | ind | 527.4/s | 0 | 0 | 189.7s | 1.000 | ok |
| 3broker | 10 | rest-balanced | http | ind | 445.4/s | 34 ⚠️ | 0 | 224.8s | 1.000 | ok |
| 3broker | 10 | rest-disabled | cpu | ind | 508.8/s | 38 ⚠️ | 0 | 196.6s | 1.000 | ok |
| 3broker | 10 | rest-disabled | http | ind | 452.4/s | 26 ⚠️ | 0 | 221.1s | 1.000 | ok |
| 3broker | 10 | grpc-poll | cpu | shr | 133.1/s | 6322 ⚠️ | 0 | 300.0s | 1.000 | ok |
| 3broker | 10 | grpc-poll | http | shr | 56.3/s | 2808 ⚠️ | 0 | 300.1s | 1.000 | ok |
| 3broker | 10 | grpc-stream | cpu | shr | 70.3/s | 10808 ⚠️ | 0 | 300.0s | 1.000 | ok |
| 3broker | 10 | grpc-stream | http | shr | 64.2/s | 10592 ⚠️ | 0 | 300.0s | 1.000 | ok |
| 3broker | 10 | rest-balanced | cpu | shr | 208.9/s | 1782 ⚠️ | 0 | 300.0s | 1.000 | ok |
| 3broker | 10 | rest-balanced | http | shr | 67.9/s | 2143 ⚠️ | 0 | 300.0s | 1.000 | ok |
| 3broker | 10 | rest-disabled | cpu | shr | 43.1/s | 282204 ⚠️ | 0 | 300.0s | 1.000 | ok |
| 3broker | 10 | rest-disabled | http | shr | 18.0/s | 299680 ⚠️ | 0 | 300.0s | 1.000 | ok |

## Server-Side Metrics (Prometheus delta per run)

| Config | Received | Dropped | Deferred | Jobs Pushed | Push Fail | BP Limit | BP Inflight | Job Act Avg | Job Life Avg | PI Exec Avg | Jobs Act | Jobs Done | PIs Done |
|--------|----------|---------|----------|-------------|-----------|----------|-------------|-------------|--------------|-------------|----------|-----------|----------|
| 1broker-5c-grpc-poll-cpu-ind | 139861 | 35239 | 35239 | 0 | 0 | 64 | 0 | 11072901ms | -18770386ms | -18770386ms | 47103 | 47071 | 47071 |
| 1broker-5c-grpc-poll-http-ind | 136569 | 34790 | 34790 | 0 | 0 | 49 | 35 | 117320576ms | -104356881ms | -104356881ms | 34830 | 34576 | 34576 |
| 1broker-5c-grpc-stream-cpu-ind | 117869 | 45776 | 45776 | 3992 | 17236 | 8 | 0 | -8352886ms | -41752639ms | -41752639ms | 21644 | 4330 | 4330 |
| 1broker-5c-grpc-stream-http-ind | 131482 | 53150 | 53150 | 5906 | 21356 | 10 | 0 | -57354113ms | -255290542ms | -255290542ms | 27646 | 6211 | 6211 |
| 1broker-5c-rest-balanced-cpu-ind | 154201 | 44129 | 44129 | 0 | 0 | 61 | 0 | -173844711ms | 24647931ms | 24647931ms | 50125 | 50089 | 50089 |
| 1broker-5c-rest-balanced-http-ind | 151902 | 35337 | 35337 | 0 | 0 | 71 | 0 | -170031166ms | 139855824ms | 139855824ms | 48180 | 48126 | 48126 |
| 1broker-5c-rest-disabled-cpu-ind | 265266 | 153396 | 153396 | 0 | 0 | 53 | 0 | 155773357ms | 110201252ms | 110201252ms | 38909 | 38908 | 38908 |
| 1broker-5c-rest-disabled-http-ind | 268680 | 168898 | 168898 | 0 | 0 | 46 | 0 | 15875460ms | 256170302ms | 256170302ms | 29814 | 29714 | 29714 |
| 1broker-5c-grpc-poll-cpu-shr | 179292 | 67245 | 67245 | 0 | 0 | 57 | 0 | 113003771ms | 113003911ms | 113003911ms | 13753 | 13753 | 13753 |
| 1broker-5c-grpc-poll-http-shr | 187751 | 91055 | 91055 | 0 | 0 | 24 | 5 | -1608884975ms | -1608884465ms | -1608884465ms | 3305 | 3305 | 3305 |
| 1broker-5c-grpc-stream-cpu-shr | 174912 | 86709 | 86709 | 6038 | 27883 | 9 | 2 | 165097134ms | 914115839ms | 914115839ms | 34046 | 6149 | 6149 |
| 1broker-5c-grpc-stream-http-shr | 200244 | 108537 | 108537 | 5396 | 32544 | 22 | 11 | 147710164ms | 1020694536ms | 1020694536ms | 38054 | 5507 | 5507 |
| 1broker-5c-rest-balanced-cpu-shr | 172369 | 51603 | 51603 | 0 | 0 | 60 | 0 | 182665624ms | -185187244ms | -185187244ms | 20235 | 20210 | 20210 |
| 1broker-5c-rest-balanced-http-shr | 163854 | 57081 | 57081 | 0 | 0 | 52 | 9 | -359238609ms | -323338973ms | -323338973ms | 9974 | 9943 | 9943 |
| 1broker-5c-rest-disabled-cpu-shr | 840052 | 755780 | 755780 | 0 | 0 | 26 | 1 | -1082680808ms | -1082680577ms | -1082680577ms | 4907 | 4907 | 4907 |
| 1broker-5c-rest-disabled-http-shr | 782509 | 681438 | 681438 | 0 | 0 | 36 | 24 | 674440162ms | 674440659ms | 674440659ms | 5453 | 5453 | 5453 |
| 1broker-10c-grpc-poll-cpu-ind | 159341 | 15501 | 15501 | 0 | 0 | 95 | 0 | -93775330ms | -93775075ms | -93775075ms | 70315 | 70315 | 70315 |
| 1broker-10c-grpc-poll-http-ind | 155989 | 12801 | 12801 | 0 | 0 | 74 | 0 | 50993261ms | -101087763ms | -101087763ms | 70279 | 70237 | 70237 |
| 1broker-10c-grpc-stream-cpu-ind | 125952 | 23096 | 23096 | 8335 | 35657 | 33 | 0 | 179453379ms | 877691750ms | 877691750ms | 45016 | 9204 | 9204 |
| 1broker-10c-grpc-stream-http-ind | 108656 | 12452 | 12452 | 7336 | 29912 | 14 | 0 | -54331543ms | -239800961ms | -239800961ms | 38880 | 8809 | 8809 |
| 1broker-10c-rest-balanced-cpu-ind | 176766 | 42060 | 42060 | 0 | 0 | 72 | 0 | -111073086ms | -111072820ms | -111072820ms | 64230 | 64230 | 64230 |
| 1broker-10c-rest-balanced-http-ind | 159432 | 22304 | 22304 | 0 | 0 | 69 | 0 | -56610498ms | -56639629ms | -56639629ms | 65018 | 64984 | 64984 |
| 1broker-10c-rest-disabled-cpu-ind | 348219 | 247437 | 247437 | 0 | 0 | 34 | 0 | -201553336ms | 9571247ms | 9571247ms | 43956 | 43826 | 43826 |
| 1broker-10c-rest-disabled-http-ind | 381059 | 267243 | 267243 | 0 | 0 | 22 | 96 | 112623797ms | 5716873ms | 5716873ms | 51943 | 51659 | 51659 |
| 1broker-10c-grpc-poll-cpu-shr | 224843 | 86302 | 86302 | 0 | 0 | 36 | 0 | 570729671ms | 570729866ms | 570729866ms | 8949 | 8949 | 8949 |
| 1broker-10c-grpc-poll-http-shr | 225256 | 93579 | 93579 | 0 | 0 | 48 | 13 | 1701244030ms | 1701244442ms | 1701244442ms | 5352 | 5352 | 5352 |
| 1broker-10c-grpc-stream-cpu-shr | 205446 | 119743 | 119743 | 4873 | 26034 | 21 | 0 | 90765059ms | 571340450ms | 571340450ms | 30970 | 4920 | 4920 |
| 1broker-10c-grpc-stream-http-shr | 236768 | 135416 | 135416 | 7741 | 37095 | 18 | 6 | 62611965ms | 360943704ms | 360943704ms | 44896 | 7788 | 7788 |
| 1broker-10c-rest-balanced-cpu-shr | 237290 | 117419 | 117419 | 0 | 0 | 47 | 4 | 433173425ms | -128640757ms | -128640757ms | 14515 | 14500 | 14500 |
| 1broker-10c-rest-balanced-http-shr | 223642 | 92852 | 92852 | 0 | 0 | 57 | 41 | 410688812ms | 237335107ms | 237335107ms | 10228 | 10227 | 10227 |
| 1broker-10c-rest-disabled-cpu-shr | 1590095 | 1493476 | 1493476 | 0 | 0 | 29 | 0 | 2215089239ms | 2215089461ms | 2215089461ms | 2958 | 2958 | 2958 |
| 1broker-10c-rest-disabled-http-shr | 1551998 | 1446853 | 1446853 | 0 | 0 | 32 | 48 | -1391733328ms | -1836106698ms | -1836106698ms | 3295 | 3263 | 3263 |
| 3broker-5c-grpc-poll-cpu-ind | 48283 | 10 | 10 | 0 | 0 | 106 | 0 | 26739807ms | 26739965ms | 26739965ms | 16769 | 16769 | 16769 |
| 3broker-5c-grpc-poll-http-ind | 50565 | 14 | 14 | 0 | 0 | 111 | 0 | -55805534ms | -55805203ms | -55805203ms | 16685 | 16685 | 16685 |
| 3broker-5c-grpc-stream-cpu-ind | 40548 | 102 | 102 | 6602 | 9939 | 100 | 0 | 318898745ms | 765007877ms | 765007877ms | 17085 | 7122 | 7122 |
| 3broker-5c-grpc-stream-http-ind | 40485 | 142 | 142 | 6572 | 9915 | 100 | 0 | 319923066ms | 768384208ms | 768384208ms | 17031 | 7091 | 7091 |
| 3broker-5c-rest-balanced-cpu-ind | 48525 | 191 | 191 | 0 | 0 | 100 | 0 | 318116597ms | -115323768ms | -115323768ms | 16366 | 16362 | 16362 |
| 3broker-5c-rest-balanced-http-ind | 53213 | 118 | 118 | 0 | 0 | 100 | 0 | 478056333ms | -459414646ms | -459414646ms | 17408 | 17378 | 17378 |
| 3broker-5c-rest-disabled-cpu-ind | 49232 | 451 | 451 | 0 | 0 | 100 | 0 | 535700036ms | 204379041ms | 204379041ms | 17086 | 17062 | 17062 |
| 3broker-5c-rest-disabled-http-ind | 53222 | 142 | 142 | 0 | 0 | 100 | 0 | 171967448ms | 499554211ms | 499554211ms | 17405 | 17377 | 17377 |
| 3broker-5c-grpc-poll-cpu-shr | 51534 | 979 | 979 | 0 | 0 | 100 | 0 | 224746959ms | 224747020ms | 224747020ms | 16646 | 16646 | 16646 |
| 3broker-5c-grpc-poll-http-shr | 41615 | 791 | 791 | 0 | 0 | 100 | 0 | 386350163ms | 200593043ms | 200593043ms | 7533 | 7501 | 7501 |
| 3broker-5c-grpc-stream-cpu-shr | 40787 | 558 | 558 | 6757 | 9878 | 100 | 0 | 335426014ms | 817022267ms | 817022267ms | 16763 | 6882 | 6882 |
| 3broker-5c-grpc-stream-http-shr | 44358 | 4800 | 4800 | 6126 | 10458 | 100 | 0 | 336452752ms | 899792073ms | 899792073ms | 16712 | 6249 | 6249 |
| 3broker-5c-rest-balanced-cpu-shr | 53306 | 649 | 649 | 0 | 0 | 100 | 0 | -396295566ms | -396295504ms | -396295504ms | 17857 | 17857 | 17857 |
| 3broker-5c-rest-balanced-http-shr | 48248 | 368 | 368 | 0 | 0 | 100 | 0 | 555358952ms | 288247568ms | 288247568ms | 10593 | 10581 | 10581 |
| 3broker-5c-rest-disabled-cpu-shr | 153595 | 101922 | 101922 | 0 | 0 | 100 | 0 | -311294403ms | -311294340ms | -311294340ms | 16797 | 16797 | 16797 |
| 3broker-5c-rest-disabled-http-shr | 151278 | 104581 | 104581 | 0 | 0 | 100 | 0 | 845915007ms | 550084952ms | 550084952ms | 9554 | 9542 | 9542 |
| 3broker-10c-grpc-poll-cpu-ind | 69924 | 928 | 928 | 0 | 0 | 100 | 0 | -223806968ms | 158883548ms | 158883548ms | 33351 | 33327 | 33327 |
| 3broker-10c-grpc-poll-http-ind | 72278 | 1275 | 1275 | 0 | 0 | 100 | 0 | 45237099ms | 129360122ms | 129360122ms | 33423 | 33423 | 33423 |
| 3broker-10c-grpc-stream-cpu-ind | 57708 | 514 | 514 | 6204 | 27011 | 100 | 0 | 236323998ms | 1127577816ms | 1127577816ms | 34239 | 7176 | 7176 |
| 3broker-10c-grpc-stream-http-ind | 57541 | 427 | 427 | 6097 | 27124 | 100 | 0 | -261079591ms | -1260425701ms | -1260425701ms | 34277 | 7100 | 7100 |
| 3broker-10c-rest-balanced-cpu-ind | 72504 | 2067 | 2067 | 0 | 0 | 100 | 0 | 191122397ms | -214101885ms | -214101885ms | 33311 | 33292 | 33292 |
| 3broker-10c-rest-balanced-http-ind | 76617 | 2717 | 2717 | 0 | 0 | 100 | 0 | -207696005ms | 42720875ms | 42720875ms | 33856 | 33843 | 33843 |
| 3broker-10c-rest-disabled-cpu-ind | 72886 | 2843 | 2843 | 0 | 0 | 100 | 0 | 242353929ms | -257687346ms | -257687346ms | 33399 | 33376 | 33376 |
| 3broker-10c-rest-disabled-http-ind | 76826 | 2624 | 2624 | 0 | 0 | 100 | 0 | 142017099ms | -148261936ms | -148261936ms | 33105 | 33051 | 33051 |
| 3broker-10c-grpc-poll-cpu-shr | 113873 | 50144 | 50144 | 0 | 0 | 100 | 0 | 627829492ms | 627829583ms | 627829583ms | 13351 | 13351 | 13351 |
| 3broker-10c-grpc-poll-http-shr | 82305 | 26660 | 26660 | 0 | 0 | 100 | 0 | 747487706ms | 747488050ms | 747488050ms | 5526 | 5526 | 5526 |
| 3broker-10c-grpc-stream-cpu-shr | 128464 | 71376 | 71376 | 6925 | 26425 | 100 | 0 | 126103154ms | 601232664ms | 601232664ms | 33446 | 7015 | 7015 |
| 3broker-10c-grpc-stream-http-shr | 128821 | 72334 | 72334 | 6346 | 26983 | 100 | 0 | 168083838ms | 869581466ms | 869581466ms | 33457 | 6467 | 6467 |
| 3broker-10c-rest-balanced-cpu-shr | 94290 | 22119 | 22119 | 0 | 0 | 100 | 0 | -216887365ms | -216887305ms | -216887305ms | 20199 | 20199 | 20199 |
| 3broker-10c-rest-balanced-http-shr | 76930 | 18313 | 18313 | 0 | 0 | 100 | 0 | -622252587ms | -1048499669ms | -1048499669ms | 6676 | 6664 | 6664 |
| 3broker-10c-rest-disabled-cpu-shr | 1016453 | 962281 | 962281 | 0 | 0 | 100 | 0 | -832130706ms | -2096968980ms | -2096968980ms | 4211 | 4208 | 4208 |
| 3broker-10c-rest-disabled-http-shr | 1066330 | 1014828 | 1014828 | 0 | 0 | 100 | 0 | 4176655043ms | -1561090310ms | -1561090310ms | 1856 | 1850 | 1850 |

## Analysis

### 1broker — 10 Clients

- **rest-disabled**: avg throughput 84.9/s, total errors 1064716
- **rest-balanced**: avg throughput 128.3/s, total errors 49737
- **grpc-stream**: avg throughput 25.6/s, total errors 74993
- **grpc-poll**: avg throughput 129.0/s, total errors 44283

**Best configuration per handler:**

- **cpu**: grpc-poll + ind → 234.3/s, 2307 errors ⚠️
- **http**: grpc-poll + ind → 234.1/s, 2421 errors ⚠️

### 1broker — 5 Clients

- **rest-disabled**: avg throughput 65.8/s, total errors 517418
- **rest-balanced**: avg throughput 110.2/s, total errors 23368
- **grpc-stream**: avg throughput 18.5/s, total errors 58048
- **grpc-poll**: avg throughput 80.9/s, total errors 31852

**Best configuration per handler:**

- **cpu**: grpc-poll + ind → 156.8/s, 2397 errors ⚠️
- **http**: grpc-poll + ind → 110.0/s, 1874 errors ⚠️

### 3broker — 10 Clients

- **rest-disabled**: avg throughput 255.6/s, total errors 581948
- **rest-balanced**: avg throughput 312.4/s, total errors 3959
- **grpc-stream**: avg throughput 69.5/s, total errors 21443
- **grpc-poll**: avg throughput 301.9/s, total errors 9134

**Best configuration per handler:**

- **cpu**: grpc-poll + ind → 547.0/s, 0 errors
- **http**: grpc-poll + ind → 471.1/s, 4 errors ⚠️

### 3broker — 5 Clients

- **rest-disabled**: avg throughput 267.3/s, total errors 40609
- **rest-balanced**: avg throughput 272.3/s, total errors 0
- **grpc-stream**: avg throughput 68.5/s, total errors 437
- **grpc-poll**: avg throughput 264.4/s, total errors 2

**Best configuration per handler:**

- **cpu**: grpc-poll + ind → 453.7/s, 0 errors
- **http**: rest-disabled + ind → 327.3/s, 0 errors

### SDK Mode Comparison

**rest-disabled:**
  - 2/16 configs zero errors
  - Worst: 1broker-10c-rest-disabled-cpu-shr with 475175 errors
  - Peak (error-free): 3broker-5c-rest-disabled-cpu-ind at 428.8/s

**rest-balanced:**
  - 5/16 configs zero errors
  - Worst: 1broker-10c-rest-balanced-cpu-shr with 21834 errors
  - Peak (error-free): 3broker-10c-rest-balanced-cpu-ind at 527.4/s

**grpc-stream:**
  - 2/16 configs zero errors
  - Worst: 1broker-10c-grpc-stream-http-shr with 34173 errors
  - Peak (error-free): 3broker-5c-grpc-stream-cpu-ind at 71.4/s

**grpc-poll:**
  - 4/16 configs zero errors
  - Worst: 1broker-10c-grpc-poll-http-shr with 21275 errors
  - Peak (error-free): 3broker-10c-grpc-poll-cpu-ind at 547.0/s


### Isolation Comparison

**Independent (child process per client):** avg throughput 238.7/s, total errors 253680
**Shared (one client, N loops):** avg throughput 68.2/s, total errors 2268267

| Metric | Independent | Shared | Delta |
|--------|-------------|--------|-------|
| Avg throughput | 238.7/s | 68.2/s | +250.2% |
| Total errors | 253680 | 2268267 | -2014587 |


### Mode Comparison (head-to-head)

| Config | G:poll | G:stream | R:balanced | R:disabled | Best |
|--------|------|------|------|------|------|
| 1broker-10c-cpu-ind | 234.3/s (2307e) | 30.7/s (4476e) | 214.1/s (3762e) | 146.1/s (62278e) | grpc-poll |
| 1broker-10c-cpu-shr | 29.8/s (18280e) | 16.4/s (33262e) | 48.3/s (21834e) | 9.9/s (475175e) | grpc-poll |
| 1broker-10c-http-ind | 234.1/s (2421e) | 29.4/s (3082e) | 216.5/s (3279e) | 172.7/s (67480e) | grpc-poll |
| 1broker-10c-http-shr | 17.8/s (21275e) | 26.0/s (34173e) | 34.1/s (20862e) | 10.9/s (459783e) | rest-balanced |
| 1broker-5c-cpu-ind | 156.8/s (2397e) | 14.4/s (6937e) | 180.1/s (2964e) | 129.6/s (36644e) | grpc-poll |
| 1broker-5c-cpu-shr | 45.8/s (10664e) | 20.5/s (19435e) | 67.3/s (8089e) | 16.4/s (231438e) | rest-balanced |
| 1broker-5c-http-ind | 110.0/s (1874e) | 20.7/s (6953e) | 160.3/s (2818e) | 99.0/s (43863e) | grpc-poll |
| 1broker-5c-http-shr | 11.0/s (16917e) | 18.4/s (24723e) | 33.1/s (9497e) | 18.2/s (205473e) | rest-balanced |
| 3broker-10c-cpu-ind | 547.0/s (0e) | 72.1/s (20e) | 527.4/s (0e) | 508.8/s (38e) | grpc-poll |
| 3broker-10c-cpu-shr | 133.1/s (6322e) | 70.3/s (10808e) | 208.9/s (1782e) | 43.1/s (282204e) | rest-balanced |
| 3broker-10c-http-ind | 471.1/s (4e) | 71.4/s (23e) | 445.4/s (34e) | 452.4/s (26e) | grpc-poll |
| 3broker-10c-http-shr | 56.3/s (2808e) | 64.2/s (10592e) | 67.9/s (2143e) | 18.0/s (299680e) | rest-balanced |
| 3broker-5c-cpu-ind | 453.7/s (0e) | 71.4/s (0e) | 398.5/s (0e) | 428.8/s (0e) | grpc-poll |
| 3broker-5c-cpu-shr | 207.8/s (2e) | 68.7/s (33e) | 264.3/s (0e) | 216.0/s (19730e) | rest-balanced |
| 3broker-5c-http-ind | 321.2/s (0e) | 71.2/s (0e) | 322.2/s (0e) | 327.3/s (0e) | rest-disabled |
| 3broker-5c-http-shr | 75.0/s (0e) | 62.5/s (404e) | 104.1/s (0e) | 96.9/s (20879e) | rest-balanced |


## Recommendations

| Metric | grpc-poll | grpc-stream | rest-balanced | rest-disabled |
|--------|------|------|------|------|
| Total errors | 85271 | 154921 | 77064 | 2204691 |
| Avg throughput | 194.1/s | 45.5/s | 205.8/s | 168.4/s |

**REST Balanced should be the SDK default.** It reduces errors by 97% vs REST Disabled across the full matrix.

**REST Balanced and grpc-poll show comparable throughput**, suggesting the adaptive backpressure system effectively bridges the protocol gap.

---
*Report generated by run-matrix.ts — 64 configurations tested.*