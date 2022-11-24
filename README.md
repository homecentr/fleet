# Fleet
- Sort out secrets encryption with sealed secrets
    - Add yarn scripts for working with secrets
    - Import keys - create a directory for them (e.g. ".keys")

- E2E tests for apps using Cypress - tests should have a configurable domain and ip range (via env var with a default)
    - yarn test command

- CI workflow
    - Validate fleet.yml (or fleet.yaml) files against a json schema (which I must create)
    - Validate all helm charts
        - Run helm lint
        - Verify all dependencies are installed

- Consolidate bundles which contain external helm chart and custom resources
    - Create a helm chart with defined dependencies
    - As per https://github.com/rancher/fleet/issues/250 the deps must be committed directly into the repo, therefore there is a risk
      of drift between Chart.yaml

- Consider how to structure the repo - we need to put the network policies somewhere
    /infra
        /cert-manager (external helm chart)
        /cert-manager-configuration (inline helm chart)
        /kubescape
        /local-volumes
        /metallb
        /metallb-configuration
        /network-policies
        /node-problem-detector
        /prometheus-operator
        /prometheus-nodes or prometheus-operator-configuration
        /reflector
        /dashboard (or an alternative - Weave Scope - to be evaluated)
    /apps
        /dns (give this a better name - public-dns or external-dns)
        /frigate
        /homepage
        /mosquitto
        /netboot
        /nextcloud
        /qbittorrent
        /smtp-relay
        /snipe-it
        /unifi-controller