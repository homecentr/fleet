apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: ingress-traefik
spec:
  podSelector: {}
    # TBA - check labels - app or k.io/instance etc.
    app.kubernetes.io/name=traefik
    app.kubernetes.io/instance=ingress-kube-system
  policyTypes:
    - Ingress
    - Egress
  ingress: {}
    # Entrypoints
    # 80
    # 443
    # Metrics - 9100
    # Dashboard - 9000
    # This is needed only from metallb - will it work without explicit allow?
  egress: {}
    - to:
        namespaceSelector: {}
        podSelector:
            matchLabels:
                homecentr.one/allow-ingress # Port is always different !!!

# TBA - policy strategy
#   - protect ingress, i.e. by default pods can call anything - only in cluster, should explicitly exclude 10.0.0.0/8
#   - protect egress -> bad
#   - protect both -> too much hassle

# Default policy for each namespace:
#  Ingress = none
#  Egress = any in-cluster traefik -> out of cluster traffic must be explicitly allowed (kube api as well)

# Ingress could be also driven by labels which should be standardized
#   appname -> choose label