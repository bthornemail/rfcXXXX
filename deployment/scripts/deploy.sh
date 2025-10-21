#!/bin/bash

# RFC XXXX Universal Deployment Script
# Supports both Docker and Kubernetes deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 RFC XXXX Universal Deployment Script${NC}"
echo "============================================="

# Function to show help
show_help() {
    echo "Usage: $0 [PLATFORM] [COMMAND] [OPTIONS]"
    echo ""
    echo "Platforms:"
    echo "  docker      Deploy using Docker Compose (default)"
    echo "  k8s         Deploy using Kubernetes"
    echo ""
    echo "Commands:"
    echo "  start       Start the RFC XXXX network"
    echo "  stop        Stop the RFC XXXX network"
    echo "  restart     Restart the RFC XXXX network"
    echo "  status      Show network status"
    echo "  logs        Show logs from all nodes"
    echo "  demo        Run showcase demo"
    echo "  test        Run tests"
    echo "  clean       Clean up resources"
    echo "  monitor     Open monitoring dashboard"
    echo ""
    echo "Options:"
    echo "  --help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 docker start              # Start with Docker"
    echo "  $0 k8s deploy               # Deploy to Kubernetes"
    echo "  $0 docker demo              # Run demo with Docker"
    echo "  $0 k8s status               # Check Kubernetes status"
    echo "  $0 docker monitor           # Open Docker monitoring"
    echo ""
    echo "Quick Start:"
    echo "  1. Docker: $0 docker start"
    echo "  2. K8s:    $0 k8s deploy"
}

# Function to check prerequisites
check_prerequisites() {
    local platform="$1"

    case "$platform" in
        docker)
            if ! command -v docker &> /dev/null; then
                echo -e "${RED}❌ Docker is not installed${NC}"
                exit 1
            fi
            if ! command -v docker-compose &> /dev/null; then
                echo -e "${RED}❌ Docker Compose is not installed${NC}"
                exit 1
            fi
            if ! docker info &> /dev/null; then
                echo -e "${RED}❌ Docker is not running${NC}"
                exit 1
            fi
            ;;
        k8s)
            if ! command -v kubectl &> /dev/null; then
                echo -e "${RED}❌ kubectl is not installed${NC}"
                exit 1
            fi
            if ! kubectl cluster-info &> /dev/null; then
                echo -e "${RED}❌ Cannot connect to Kubernetes cluster${NC}"
                exit 1
            fi
            ;;
    esac
}

# Function to deploy with Docker
deploy_docker() {
    local command="$1"

    case "$command" in
        start)
            echo -e "${YELLOW}🐳 Starting RFC XXXX with Docker...${NC}"
            ./deployment/scripts/docker-run.sh start
            ;;
        stop)
            echo -e "${YELLOW}🐳 Stopping RFC XXXX Docker containers...${NC}"
            ./deployment/scripts/docker-run.sh stop
            ;;
        restart)
            echo -e "${YELLOW}🐳 Restarting RFC XXXX Docker containers...${NC}"
            ./deployment/scripts/docker-run.sh restart
            ;;
        status)
            echo -e "${YELLOW}🐳 Docker container status...${NC}"
            ./deployment/scripts/docker-run.sh status
            ;;
        logs)
            echo -e "${YELLOW}🐳 Docker container logs...${NC}"
            ./deployment/scripts/docker-run.sh logs
            ;;
        demo)
            echo -e "${YELLOW}🐳 Running demo with Docker...${NC}"
            ./deployment/scripts/docker-run.sh demo
            ;;
        test)
            echo -e "${YELLOW}🐳 Running tests with Docker...${NC}"
            ./deployment/scripts/docker-run.sh test
            ;;
        clean)
            echo -e "${YELLOW}🐳 Cleaning up Docker resources...${NC}"
            ./deployment/scripts/docker-run.sh clean
            ;;
        monitor)
            echo -e "${YELLOW}🐳 Opening Docker monitoring dashboard...${NC}"
            ./deployment/scripts/docker-run.sh monitor
            ;;
        *)
            echo -e "${RED}❌ Unknown Docker command: $command${NC}"
            echo "Available commands: start, stop, restart, status, logs, demo, test, clean, monitor"
            exit 1
            ;;
    esac
}

# Function to deploy with Kubernetes
deploy_k8s() {
    local command="$1"

    case "$command" in
        deploy|start)
            echo -e "${YELLOW}☸️  Deploying RFC XXXX to Kubernetes...${NC}"
            ./deployment/scripts/k8s-deploy.sh deploy
            ;;
        undeploy|stop)
            echo -e "${YELLOW}☸️  Undeploying RFC XXXX from Kubernetes...${NC}"
            ./deployment/scripts/k8s-deploy.sh undeploy
            ;;
        status)
            echo -e "${YELLOW}☸️  Kubernetes deployment status...${NC}"
            ./deployment/scripts/k8s-deploy.sh status
            ;;
        logs)
            echo -e "${YELLOW}☸️  Kubernetes pod logs...${NC}"
            ./deployment/scripts/k8s-deploy.sh logs
            ;;
        demo)
            echo -e "${YELLOW}☸️  Running demo in Kubernetes...${NC}"
            kubectl run rfcxxxx-demo --image=rfcxxxx:1.0.0 --rm -it --restart=Never --namespace=rfcxxxx -- npm run demo:real
            ;;
        test)
            echo -e "${YELLOW}☸️  Running tests in Kubernetes...${NC}"
            kubectl run rfcxxxx-test --image=rfcxxxx:1.0.0 --rm -it --restart=Never --namespace=rfcxxxx -- npm test
            ;;
        clean)
            echo -e "${YELLOW}☸️  Cleaning up Kubernetes resources...${NC}"
            ./deployment/scripts/k8s-deploy.sh undeploy
            ;;
        monitor)
            echo -e "${YELLOW}☸️  Opening Kubernetes monitoring dashboard...${NC}"
            kubectl port-forward -n rfcxxxx svc/rfcxxxx-monitoring-service 8080:80 &
            echo -e "${GREEN}✅ Monitoring dashboard available at: http://localhost:8080${NC}"
            echo "Press Ctrl+C to stop port forwarding"
            wait
            ;;
        *)
            echo -e "${RED}❌ Unknown Kubernetes command: $command${NC}"
            echo "Available commands: deploy, undeploy, status, logs, demo, test, clean, monitor"
            exit 1
            ;;
    esac
}

# Function to show platform comparison
show_platform_info() {
    echo -e "${BLUE}📊 Platform Comparison${NC}"
    echo "======================"
    echo ""
    echo -e "${YELLOW}🐳 Docker (Local Development):${NC}"
    echo "  ✅ Quick setup and teardown"
    echo "  ✅ Easy debugging and development"
    echo "  ✅ No cluster management needed"
    echo "  ✅ Perfect for testing and demos"
    echo "  ❌ Limited scalability"
    echo "  ❌ Single machine only"
    echo ""
    echo -e "${YELLOW}☸️  Kubernetes (Production):${NC}"
    echo "  ✅ True distributed deployment"
    echo "  ✅ High availability and scalability"
    echo "  ✅ Production-ready monitoring"
    echo "  ✅ Network policies and security"
    echo "  ❌ Requires cluster setup"
    echo "  ❌ More complex debugging"
    echo ""
    echo -e "${BLUE}💡 Recommendation:${NC}"
    echo "  Start with Docker for development, then deploy to Kubernetes for production"
}

# Parse command line arguments
PLATFORM="docker"
COMMAND="start"

while [[ $# -gt 0 ]]; do
    case $1 in
        docker|k8s)
            PLATFORM="$1"
            shift
            ;;
        start|stop|restart|status|logs|demo|test|clean|monitor|deploy|undeploy)
            COMMAND="$1"
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        --info)
            show_platform_info
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Unknown option: $1${NC}"
            echo ""
            show_help
            exit 1
            ;;
    esac
done

# Check prerequisites
check_prerequisites "$PLATFORM"

# Execute deployment
case "$PLATFORM" in
    docker)
        deploy_docker "$COMMAND"
        ;;
    k8s)
        deploy_k8s "$COMMAND"
        ;;
    *)
        echo -e "${RED}❌ Unknown platform: $PLATFORM${NC}"
        exit 1
        ;;
esac

echo -e "${GREEN}✅ Operation completed successfully!${NC}"
