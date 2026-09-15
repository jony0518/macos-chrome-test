# macos-chrome-test

Runs Google Chrome on a GitHub-hosted macOS runner against a measurement page
and uploads what the page reports, headless and headed.

Run it from the Actions tab (`macOS Chrome measurement` -> Run workflow) and
give it the collector's base URL. The URL is a workflow input rather than a
committed value, so nothing about the collector lives in this repository.
