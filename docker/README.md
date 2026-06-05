# Docker — BRAINet API

CPU-only container image for the FastAPI inference service (`app/main.py`).

The **build context is the repository root** because the app imports the
root-level `gradcam_pp.py` alongside the `app/` package.

## Build

```bash
# from the repo root
docker build -f docker/Dockerfile -t brainet:latest .
```

The ResNet18 weights are pulled from Hugging Face and baked into the image at
build time. For an offline build that skips this step:

```bash
docker build -f docker/Dockerfile --build-arg PREFETCH_MODEL=false -t brainet:latest .
```

## Run

```bash
docker run --rm -p 8000:8000 brainet:latest
# health check
curl http://localhost:8000/health
```

Override allowed CORS origins via the `ALLOWED_ORIGINS` env var
(comma-separated):

```bash
docker run --rm -p 8000:8000 -e ALLOWED_ORIGINS="https://example.com" brainet:latest
```

## Compose

```bash
docker compose -f docker/docker-compose.yml up --build
```

## CI/CD

`.github/workflows/docker-ci-cd.yml`:

- **CI** — builds the image on every pull request to `main` (no push).
- **CD** — on pushes to `main` and on `v*.*.*` tags, builds and pushes to
  GitHub Container Registry at `ghcr.io/thisen-ekanayake/brainet`.

Tags produced: `latest` (default branch), the short commit SHA, the branch
name, and semver tags (`1.2.3`, `1.2`) when a `v1.2.3` git tag is pushed.

Auth uses the built-in `GITHUB_TOKEN` — no extra secrets required. The package
inherits the repository's visibility; make it public (or grant pull access)
under **Packages** settings if external pulls are needed.

## Pull the published image

```bash
docker pull ghcr.io/thisen-ekanayake/brainet:latest
```
