#!/bin/bash

# RFC XXXX Kubernetes Deployment Script
# Deploys the RFC XXXX network to Kubernetes cluster

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="rfcxxxx"
K8S_DIR="deployment/k8s"
IMAGE_NAME="rfcxxxx"
VERSION="1.0.0"

echo -e "${BLUE}🚀 RFC XXXX Kubernetes Deployment Script${NC}"
echo "============================================="

# Parse command line arguments
ACTION="deploy"
DRY_RUN=false
FORCE=false
CLEANUP=false

while [[ $# -gt 0 ]]; do
    case $1 in
        deploy)
            ACTION="deploy"
            shift
            ;;
        undeploy)
            ACTION="undeploy"
            shift
            ;;
        status)
            ACTION="status"
            shift
            ;;
        logs)
            ACTION="logs"
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --force)
            FORCE=true
            shift
            ;;
        --cleanup)
            CLEANUP=true
            shift
            ;;
        --help)
            echo "Usage: $0 [COMMAND] [OPTIONS]"
            echo ""
            echo "Commands:"
            echo "  deploy       Deploy RFC XXXX to Kubernetes (default)"
            echo "  undeploy     Remove RFC XXXX from Kubernetes"
            echo "  status       Show deployment status"
            echo "  logs         Show logs from all nodes"
            echo ""
            echo "Options:"
            echo "  --dry-run    Show what would be deployed without applying"
            echo "  --force      Force deployment even if resources exist"
            echo "  --cleanup    Clean up resources before deployment"
            echo "  --help       Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 deploy                    # Deploy to Kubernetes"
            echo "  $0 deploy --dry-run         # Preview deployment"
            echo "  $0 status                   # Check deployment status"
            echo "  $0 logs                     # View logs"
            echo "  $0 undeploy                 # Remove deployment"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}❌ kubectl is not installed or not in PATH${NC}"
    echo "Please install kubectl and configure it to connect to your Kubernetes cluster"
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}❌ Cannot connect to Kubernetes cluster${NC}"
    echo "Please ensure kubectl is configured and the cluster is accessible"
    exit 1
fi

# Function to show cluster info
show_cluster_info() {
    echo -e "${BLUE}📊 Cluster Information:${NC}"
    kubectl cluster-info
    echo ""
    echo -e "${BLUE}📋 Current Context:${NC}"
    kubectl config current-context
    echo ""
}

# Function to deploy RFC XXXX
deploy_rfcxxxx() {
    echo -e "${YELLOW}🚀 Deploying RFC XXXX to Kubernetes...${NC}"

    # Show cluster info
    show_cluster_info

    # Cleanup if requested
    if [ "$CLEANUP" = true ]; then
        echo -e "${YELLOW}🧹 Cleaning up existing resources...${NC}"
        kubectl delete namespace "$NAMESPACE" --ignore-not-found=true
        sleep 5
    fi

    # Check if namespace exists
    if kubectl get namespace "$NAMESPACE" &> /dev/null; then
        if [ "$FORCE" = false ]; then
            echo -e "${YELLOW}⚠️  Namespace '$NAMESPACE' already exists${NC}"
            echo "Use --force to overwrite or --cleanup to remove first"
            exit 1
        fi
    fi

    # Apply manifests in order
    local manifests=(
        "namespace.yaml"
        "configmap.yaml"
        "secret.yaml"
        "pvc.yaml"
        "deployment.yaml"
        "services.yaml"
        "network-policies.yaml"
        "monitoring.yaml"
    )

    for manifest in "${manifests[@]}"; do
        local file="${K8S_DIR}/${manifest}"
        if [ -f "$file" ]; then
            echo -e "${BLUE}📄 Applying ${manifest}...${NC}"
            if [ "$DRY_RUN" = true ]; then
                kubectl apply -f "$file" --dry-run=client -o yaml
            else
                kubectl apply -f "$file"
            fi
        else
            echo -e "${RED}❌ Manifest file not found: ${file}${NC}"
            exit 1
        fi
    done

    if [ "$DRY_RUN" = true ]; then
        echo -e "${GREEN}✅ Dry run completed successfully${NC}"
        return 0
    fi

    # Wait for deployments to be ready
    echo -e "${YELLOW}⏳ Waiting for deployments to be ready...${NC}"
    kubectl wait --for=condition=available --timeout=300s deployment/rfcxxxx-node-1 -n "$NAMESPACE"
    kubectl wait --for=condition=available --timeout=300s deployment/rfcxxxx-node-2 -n "$NAMESPACE"
    kubectl wait --for=condition=available --timeout=300s deployment/rfcxxxx-node-3 -n "$NAMESPACE"
    kubectl wait --for=condition=available --timeout=300s deployment/rfcxxxx-node-4 -n "$NAMESPACE"
    kubectl wait --for=condition=available --timeout=300s deployment/rfcxxxx-monitoring -n "$NAMESPACE"

    echo -e "${GREEN}✅ RFC XXXX deployed successfully!${NC}"
    show_deployment_info
}

# Function to undeploy RFC XXXX
undeploy_rfcxxxx() {
    echo -e "${YELLOW}🛑 Undeploying RFC XXXX from Kubernetes...${NC}"

    # Delete namespace (this will delete all resources in the namespace)
    kubectl delete namespace "$NAMESPACE" --ignore-not-found=true

    echo -e "${GREEN}✅ RFC XXXX undeployed successfully${NC}"
}

# Function to show deployment status
show_status() {
    echo -e "${BLUE}📊 RFC XXXX Deployment Status${NC}"
    echo "=============================="

    # Check if namespace exists
    if ! kubectl get namespace "$NAMESPACE" &> /dev/null; then
        echo -e "${RED}❌ Namespace '$NAMESPACE' not found${NC}"
        echo "Run '$0 deploy' to deploy RFC XXXX"
        exit 1
    fi

    # Show namespace info
    echo -e "${BLUE}📋 Namespace:${NC}"
    kubectl get namespace "$NAMESPACE" -o wide

    echo ""
    echo -e "${BLUE}🚀 Deployments:${NC}"
    kubectl get deployments -n "$NAMESPACE" -o wide

    echo ""
    echo -e "${BLUE}🔗 Services:${NC}"
    kubectl get services -n "$NAMESPACE" -o wide

    echo ""
    echo -e "${BLUE}📦 Pods:${NC}"
    kubectl get pods -n "$NAMESPACE" -o wide

    echo ""
    echo -e "${BLUE}💾 Persistent Volume Claims:${NC}"
    kubectl get pvc -n "$NAMESPACE" -o wide

    echo ""
    echo -e "${BLUE}🔒 Network Policies:${NC}"
    kubectl get networkpolicies -n "$NAMESPACE" -o wide

    # Show pod status
    echo ""
    echo -e "${BLUE}🔍 Pod Status Details:${NC}"
    kubectl describe pods -n "$NAMESPACE" | grep -A 5 -B 5 "Status\|Ready\|Restart"
}

# Function to show logs
show_logs() {
    echo -e "${BLUE}📋 RFC XXXX Logs${NC}"
    echo "=================="

    # Check if namespace exists
    if ! kubectl get namespace "$NAMESPACE" &> /dev/null; then
        echo -e "${RED}❌ Namespace '$NAMESPACE' not found${NC}"
        exit 1
    fi

    # Show logs from all nodes
    for i in {1..4}; do
        echo -e "${YELLOW}📄 Node ${i} Logs:${NC}"
        kubectl logs -n "$NAMESPACE" -l component=node-${i} --tail=20
        echo ""
    done

    echo -e "${YELLOW}📄 Monitoring Logs:${NC}"
    kubectl logs -n "$NAMESPACE" -l component=monitoring --tail=20
}

# Function to show deployment info
show_deployment_info() {
    echo ""
    echo -e "${GREEN}🎉 RFC XXXX Network Deployed Successfully!${NC}"
    echo ""
    echo -e "${BLUE}🌐 Access Information:${NC}"
    echo "  Namespace: $NAMESPACE"
    echo "  Monitoring Dashboard: kubectl port-forward -n $NAMESPACE svc/rfcxxxx-monitoring-service 8080:80"
    echo "  Node 1 API: kubectl port-forward -n $NAMESPACE svc/rfcxxxx-node-1-service 8081:8080"
    echo "  Node 2 API: kubectl port-forward -n $NAMESPACE svc/rfcxxxx-node-2-service 8082:8080"
    echo "  Node 3 API: kubectl port-forward -n $NAMESPACE svc/rfcxxxx-node-3-service 8083:8080"
    echo "  Node 4 API: kubectl port-forward -n $NAMESPACE svc/rfcxxxx-node-4-service 8084:8080"
    echo ""
    echo -e "${BLUE}🔍 Useful Commands:${NC}"
    echo "  Check status: $0 status"
    echo "  View logs: $0 logs"
    echo "  Monitor: kubectl get pods -n $NAMESPACE -w"
    echo "  Undeploy: $0 undeploy"
    echo ""
    echo -e "${YELLOW}💡 The RFC XXXX network is now running in Kubernetes!${NC}"
}

# Main execution
case "$ACTION" in
    deploy)
        deploy_rfcxxxx
        ;;
    undeploy)
        undeploy_rfcxxxx
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    *)
        echo -e "${RED}❌ Unknown action: $ACTION${NC}"
        exit 1
        ;;
esac
