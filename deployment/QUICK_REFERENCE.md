# RFC XXXX Deployment - Quick Reference

## 🚀 **Quick Commands**

### Docker (Development)
```bash
# Start RFC XXXX network
./deployment/scripts/deploy.sh docker start

# Run showcase demo
./deployment/scripts/deploy.sh docker demo

# View logs
./deployment/scripts/deploy.sh docker logs

# Open monitoring dashboard
./deployment/scripts/deploy.sh docker monitor

# Stop network
./deployment/scripts/deploy.sh docker stop
```

### Kubernetes (Production)
```bash
# Deploy to Kubernetes
./deployment/scripts/deploy.sh k8s deploy

# Check status
./deployment/scripts/deploy.sh k8s status

# View logs
./deployment/scripts/deploy.sh k8s logs

# Access monitoring (port-forward)
kubectl port-forward -n rfcxxxx svc/rfcxxxx-monitoring-service 8080:80

# Delete deployment
./deployment/scripts/deploy.sh k8s delete
```

## 📊 **Access Points**

### Docker
- **Monitoring Dashboard**: http://localhost:8090
- **Node 1**: http://localhost:8081
- **Node 2**: http://localhost:8082
- **Node 3**: http://localhost:8083
- **Node 4**: http://localhost:8084

### Kubernetes
- **Monitoring Dashboard**: `kubectl port-forward -n rfcxxxx svc/rfcxxxx-monitoring-service 8080:80`
- **Node Services**: `kubectl get svc -n rfcxxxx`
- **Pod Status**: `kubectl get pods -n rfcxxxx`

## 🔧 **Troubleshooting**

### Docker Issues
```bash
# Check container status
docker ps

# View container logs
docker logs rfcxxxx-node-1

# Restart containers
./deployment/scripts/deploy.sh docker restart

# Clean up everything
./deployment/scripts/deploy.sh docker clean
```

### Kubernetes Issues
```bash
# Check pod status
kubectl get pods -n rfcxxxx

# View pod logs
kubectl logs -n rfcxxxx deployment/rfcxxxx-deployment

# Check service endpoints
kubectl get endpoints -n rfcxxxx

# Restart deployment
kubectl rollout restart deployment/rfcxxxx-deployment -n rfcxxxx
```

## 📁 **Key Files**

### Docker
- `deployment/docker/Dockerfile` - Container image definition
- `deployment/docker/docker-compose.yml` - Multi-container orchestration
- `deployment/docker/nginx.conf` - Monitoring dashboard config

### Kubernetes
- `deployment/k8s/deployment.yaml` - Main application deployment
- `deployment/k8s/services.yaml` - Service definitions
- `deployment/k8s/network-policies.yaml` - Security policies
- `deployment/k8s/monitoring.yaml` - Monitoring setup

### Scripts
- `deployment/scripts/deploy.sh` - Universal deployment script
- `deployment/scripts/docker-build.sh` - Docker image builder
- `deployment/scripts/k8s-deploy.sh` - Kubernetes deployment manager

## 🎯 **Common Use Cases**

### Development Workflow
1. `./deployment/scripts/deploy.sh docker start` - Start development environment
2. Make code changes
3. `./deployment/scripts/deploy.sh docker demo` - Test changes
4. `./deployment/scripts/deploy.sh docker logs` - Debug issues
5. `./deployment/scripts/deploy.sh docker stop` - Clean up

### Production Deployment
1. `./deployment/scripts/deploy.sh k8s deploy` - Deploy to production
2. `./deployment/scripts/deploy.sh k8s status` - Verify deployment
3. `kubectl port-forward -n rfcxxxx svc/rfcxxxx-monitoring-service 8080:80` - Access monitoring
4. `./deployment/scripts/deploy.sh k8s logs` - Monitor logs

### Demo/Presentation
1. `./deployment/scripts/deploy.sh docker start` - Start demo environment
2. `./deployment/scripts/deploy.sh docker demo` - Run showcase demo
3. Open http://localhost:8090 - Show monitoring dashboard
4. `./deployment/scripts/deploy.sh docker stop` - Clean up after demo

## 📞 **Help & Support**

### Get Help
```bash
# Universal help
./deployment/scripts/deploy.sh --help

# Docker help
./deployment/scripts/deploy.sh docker --help

# Kubernetes help
./deployment/scripts/deploy.sh k8s --help
```

### Documentation
- `deployment/README.md` - Comprehensive deployment guide
- `deployment/DEPLOYMENT_SUMMARY.md` - Implementation summary
- `deployment/QUICK_REFERENCE.md` - This quick reference

---

**🚀 Ready to deploy RFC XXXX anywhere from laptop to cloud!**
