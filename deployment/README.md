# RFC XXXX Deployment Guide

This directory contains comprehensive deployment configurations for the RFC XXXX implementation, supporting both Docker for development and Kubernetes for production deployment.

## 🚀 Quick Start

### Docker (Local Development)
```bash
# Start the RFC XXXX network
./deployment/scripts/deploy.sh docker start

# Run the showcase demo
./deployment/scripts/deploy.sh docker demo

# Open monitoring dashboard
./deployment/scripts/deploy.sh docker monitor
```

### Kubernetes (Production)
```bash
# Deploy to Kubernetes
./deployment/scripts/deploy.sh k8s deploy

# Check deployment status
./deployment/scripts/deploy.sh k8s status

# View logs
./deployment/scripts/deploy.sh k8s logs
```

## 📁 Directory Structure

```
deployment/
├── docker/                 # Docker deployment files
│   ├── Dockerfile         # Multi-stage Docker image
│   ├── docker-compose.yml # Multi-node development setup
│   └── nginx.conf         # Monitoring dashboard config
├── k8s/                   # Kubernetes deployment files
│   ├── namespace.yaml     # Kubernetes namespace
│   ├── configmap.yaml     # Configuration and secrets
│   ├── secret.yaml        # Sensitive data
│   ├── deployment.yaml    # Node deployments
│   ├── services.yaml      # Service definitions
│   ├── pvc.yaml          # Persistent volume claims
│   ├── network-policies.yaml # Network security
│   └── monitoring.yaml    # Monitoring and dashboard
├── scripts/               # Deployment scripts
│   ├── deploy.sh         # Universal deployment script
│   ├── docker-build.sh   # Docker build script
│   ├── docker-run.sh     # Docker management script
│   └── k8s-deploy.sh     # Kubernetes deployment script
└── README.md             # This file
```

## 🐳 Docker Deployment

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+

### Features
- **Multi-node network**: 4 consensus nodes + 1 development node
- **Real UDP communication**: Actual network message passing
- **Monitoring dashboard**: Web-based network monitoring
- **Development mode**: Hot-reload for development
- **Health checks**: Automatic container health monitoring

### Usage

#### Build and Start
```bash
# Build Docker images
./deployment/scripts/docker-build.sh

# Start all nodes
./deployment/scripts/docker-run.sh start

# Or use the universal script
./deployment/scripts/deploy.sh docker start
```

#### Management Commands
```bash
# Check status
./deployment/scripts/docker-run.sh status

# View logs
./deployment/scripts/docker-run.sh logs --follow

# Run tests
./deployment/scripts/docker-run.sh test

# Run showcase demo
./deployment/scripts/docker-run.sh demo

# Open monitoring dashboard
./deployment/scripts/docker-run.sh monitor

# Stop all containers
./deployment/scripts/docker-run.sh stop

# Clean up resources
./deployment/scripts/docker-run.sh clean
```

#### Network Endpoints
- **Node 1**: UDP:3001, HTTP:8081
- **Node 2**: UDP:3002, HTTP:8082
- **Node 3**: UDP:3003, HTTP:8083
- **Node 4**: UDP:3004, HTTP:8084
- **Monitor**: http://localhost:8090

## ☸️ Kubernetes Deployment

### Prerequisites
- Kubernetes cluster 1.20+
- kubectl configured
- Persistent storage class available

### Features
- **Distributed deployment**: True multi-node distributed system
- **High availability**: Pod restarts and health checks
- **Scalability**: Horizontal pod autoscaling ready
- **Security**: Network policies and RBAC
- **Monitoring**: Prometheus metrics and Grafana dashboards
- **Storage**: Persistent volumes for data persistence

### Usage

#### Deploy to Kubernetes
```bash
# Deploy all components
./deployment/scripts/k8s-deploy.sh deploy

# Or use the universal script
./deployment/scripts/deploy.sh k8s deploy
```

#### Management Commands
```bash
# Check deployment status
./deployment/scripts/k8s-deploy.sh status

# View logs from all nodes
./deployment/scripts/k8s-deploy.sh logs

# Run demo in cluster
./deployment/scripts/deploy.sh k8s demo

# Run tests in cluster
./deployment/scripts/deploy.sh k8s test

# Undeploy everything
./deployment/scripts/k8s-deploy.sh undeploy
```

#### Access Services
```bash
# Port forward to monitoring dashboard
kubectl port-forward -n rfcxxxx svc/rfcxxxx-monitoring-service 8080:80

# Port forward to individual nodes
kubectl port-forward -n rfcxxxx svc/rfcxxxx-node-1-service 8081:8080
kubectl port-forward -n rfcxxxx svc/rfcxxxx-node-2-service 8082:8080
kubectl port-forward -n rfcxxxx svc/rfcxxxx-node-3-service 8083:8080
kubectl port-forward -n rfcxxxx svc/rfcxxxx-node-4-service 8084:8080
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ID` | Unique node identifier | `node-1` |
| `NODE_PORT` | UDP consensus port | `3001` |
| `HTTP_PORT` | HTTP API port | `8080` |
| `LOG_LEVEL` | Logging level | `info` |
| `NETWORK_MODE` | Network mode | `production` |
| `CONSENSUS_TIMEOUT` | Consensus timeout (ms) | `5000` |
| `RETRY_ATTEMPTS` | Message retry attempts | `3` |
| `MAX_MESSAGE_SIZE` | Max UDP message size | `8192` |

### Resource Requirements

#### Docker
- **Memory**: 2GB minimum, 4GB recommended
- **CPU**: 2 cores minimum, 4 cores recommended
- **Storage**: 10GB for containers and data

#### Kubernetes
- **Per Node**:
  - Memory: 256Mi request, 512Mi limit
  - CPU: 250m request, 500m limit
  - Storage: 10Gi persistent volume
- **Total Cluster**:
  - Memory: 2Gi minimum
  - CPU: 2 cores minimum
  - Storage: 50Gi minimum

## 📊 Monitoring

### Docker Monitoring
- **Dashboard**: http://localhost:8090
- **Health checks**: Built into containers
- **Logs**: `docker-compose logs -f`

### Kubernetes Monitoring
- **Dashboard**: Port-forward to monitoring service
- **Metrics**: Prometheus-compatible endpoints on port 9090
- **Health checks**: Kubernetes liveness and readiness probes
- **Logs**: `kubectl logs -n rfcxxxx -l app=rfcxxxx`

### Key Metrics
- **Network Health**: Node connectivity status
- **Consensus Status**: Geometric consensus state
- **UDP Connections**: Active consensus connections
- **IPv6 Models**: Neural architecture encodings
- **Performance**: Response times and throughput

## 🔒 Security

### Docker Security
- **Non-root user**: Containers run as non-root
- **Network isolation**: Custom Docker network
- **Health checks**: Automatic container health monitoring

### Kubernetes Security
- **Network policies**: Restrict pod-to-pod communication
- **RBAC**: Role-based access control
- **Secrets**: Encrypted sensitive data storage
- **Pod security**: Non-root containers with security contexts

## 🚨 Troubleshooting

### Common Issues

#### Docker Issues
```bash
# Check container status
docker-compose ps

# View container logs
docker-compose logs [service-name]

# Restart specific service
docker-compose restart [service-name]

# Clean up and restart
./deployment/scripts/docker-run.sh clean
./deployment/scripts/docker-run.sh start
```

#### Kubernetes Issues
```bash
# Check pod status
kubectl get pods -n rfcxxxx

# Describe problematic pod
kubectl describe pod [pod-name] -n rfcxxxx

# View pod logs
kubectl logs [pod-name] -n rfcxxxx

# Check events
kubectl get events -n rfcxxxx --sort-by='.lastTimestamp'

# Restart deployment
kubectl rollout restart deployment/[deployment-name] -n rfcxxxx
```

### Performance Tuning

#### Docker
- Increase Docker memory limit
- Use SSD storage for better I/O
- Enable Docker BuildKit for faster builds

#### Kubernetes
- Adjust resource requests/limits
- Use node affinity for better placement
- Enable horizontal pod autoscaling
- Configure cluster autoscaling

## 🔄 Development Workflow

### Local Development
1. **Start Docker environment**: `./deployment/scripts/deploy.sh docker start`
2. **Make code changes**: Edit source files
3. **Test changes**: `./deployment/scripts/deploy.sh docker test`
4. **Run demo**: `./deployment/scripts/deploy.sh docker demo`
5. **Monitor**: `./deployment/scripts/deploy.sh docker monitor`

### Production Deployment
1. **Build images**: `./deployment/scripts/docker-build.sh --production`
2. **Deploy to K8s**: `./deployment/scripts/deploy.sh k8s deploy`
3. **Verify deployment**: `./deployment/scripts/deploy.sh k8s status`
4. **Monitor**: Access monitoring dashboard
5. **Scale if needed**: `kubectl scale deployment [name] --replicas=N -n rfcxxxx`

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [RFC XXXX Implementation Guide](../README.md)
- [Network Flow Demo](../src/examples/network-flow-demo.ts)
- [Real Showcase Demo](../src/examples/real-showcase-demo.ts)

## 🤝 Contributing

1. Test changes locally with Docker first
2. Update deployment configurations as needed
3. Test Kubernetes deployment in development cluster
4. Update documentation for any new features
5. Submit pull request with deployment changes

## 📄 License

This deployment configuration is part of the RFC XXXX implementation and follows the same MIT license as the main project.
