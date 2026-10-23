# PHP2Shell Safe Training Room

An English-only, VM-runnable defensive learning room about PHP2Shell (CVE-2026-109618 and CVE-2026-109619). It provides a guided timeline replay, synthetic evidence, diagnosis tasks, a mitigation decision, a short quiz, and a local training flag.

## Safety and scope

This repository is **not an exploit lab**. It does not include a vulnerable PHP version, PHP server, exploit, command execution, shell, payload, memory primitive, upload endpoint, target URL field, or vulnerability scanner. The simulated records are fictional, deterministic browser content. The server in this package serves static files only; it has no API and makes no outbound requests. The score and flag only report local exercise completion.

Run it inside a disposable VM as a training room. Docker publishes the site only on the VM's loopback address (`127.0.0.1:8088`). The first image build may download the official Node base image. Do not expose the port to a public interface. The VM is an extra containment boundary, not a reason to point the exercise at real systems.

## Start in a VM

Requirements: a disposable Linux VM with Docker Engine and the Docker Compose plugin installed.

```sh
docker compose up --build
```

Open `http://127.0.0.1:8088` **inside the VM**. The container runs as the unprivileged `node` user, has a read-only root filesystem, dropped Linux capabilities, no-new-privileges, a PID limit, and CPU/memory limits. The only published port is bound to VM loopback.

Stop and remove the room with:

```sh
docker compose down
```

To inspect the source without Docker, run `node server.cjs` from this directory and browse to `http://127.0.0.1:8080`.

## Learning objectives

- Explain why PHP request parsing and upload-progress processing can happen before application code.
- Describe the OOM-corruption path associated with CVE-2026-109618.
- Describe stale request-owned state and the early-consumer lifecycle associated with CVE-2026-109619.
- Read a synthetic event timeline without mistaking it for evidence from a live system.
- Choose a patched PHP runtime as the complete remediation and recognize configuration workarounds as partial.

## Room flow

1. Review the lifecycle briefing.
2. Replay the two fictional evidence timelines and submit a diagnosis.
3. Choose the response that fully addresses the PHP runtime flaw.
4. Complete the five-question knowledge check. Four correct answers, both replays, a correct diagnosis, and the correct remediation decision reveal a local training flag.
5. Use the instructor notes to discuss fleet inventory, vendor backports, worker restarts, and the limits of passive scanning.

## GitHub

To publish this as a separate repository, copy the **contents of this directory** into a new GitHub repository, then use GitHub's normal repository workflow. The `Dockerfile` and `compose.yaml` are at the repository root after copying. No GitHub credentials are needed to run the room locally. This project does not automatically publish or push to GitHub.

## Primary references

- [PHP advisory: CVE-2026-109618 — RCE via OOM corruption](https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w)
- [PHP advisory: CVE-2026-109619 — RCE via stale global state](https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp)
- [PHP security release notice](https://www.php.net/archive/2026.php#2026-10-21-5)

The room is an educational simulation, not a vulnerability reproduction, security certification, penetration test, or substitute for applying vendor security updates.

The Compose service uses an internal Docker network with no external route during runtime. Only the explicitly published loopback port is intended for learner access. Official source links in the page open only when a learner deliberately clicks them in a browser.
