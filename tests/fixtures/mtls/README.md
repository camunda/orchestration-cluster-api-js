Test-only mTLS material for `tests/mtls-handshake.test.ts`. Self-signed; not secret, no value outside tests.

`ca.pem` signed `server.pem` (SAN localhost, 127.0.0.1) and `client.pem` (CN sdk-test-client). The CA key was discarded after signing. Valid for 100 years.
