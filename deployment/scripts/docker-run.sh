#!/bin/bash

# RFC XXXX Docker Run Script
# Manages Docker containers for development and testing

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOCKER_DIR="deployment/docker"
COMPOSE_FILE="${DOCKER_DIR}/docker-compose.yml"

echo -e "${BLUE}🚀 RFC XXXX Docker Management Script${NC}"
echo "====================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Function to show help
show_help() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  start       Start all RFC XXXX nodes"
    echo "  stop        Stop all RFC XXXX nodes"
    echo "  restart     Restart all RFC XXXX nodes"
    echo "  status      Show status of all nodes"
    echo "  logs        Show logs from all nodes"
    echo "  dev         Start development environment"
    echo "  test        Run tests in container"
    echo "  demo        Run showcase demo"
    echo "  clean       Clean up containers and volumes"
    echo "  monitor     Open monitoring dashboard"
    echo ""
    echo "Options:"
    echo "  --follow    Follow logs (for logs command)"
    echo "  --node N    Target specific node (1-4)"
    echo "  --help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start                    # Start all nodes"
    echo "  $0 logs --follow           # Follow all logs"
    echo "  $0 logs --node 1           # Show logs for node 1"
    echo "  $0 demo                    # Run showcase demo"
    echo "  $0 monitor                 # Open monitoring dashboard"
}

# Function to start all nodes
start_nodes() {
    echo -e "${YELLOW}🚀 Starting RFC XXXX network...${NC}"
    cd "${DOCKER_DIR}"

    # Build images if they don't exist
    if ! docker images | grep -q "rfcxxxx"; then
        echo -e "${BLUE}📦 Building images...${NC}"
        docker-compose build
    fi

    # Start all services
    docker-compose up -d

    echo -e "${GREEN}✅ RFC XXXX network started successfully!${NC}"
    echo ""
    echo -e "${BLUE}🌐 Network endpoints:${NC}"
    echo "  Node 1: UDP:3001, HTTP:8081"
    echo "  Node 2: UDP:3002, HTTP:8082"
    echo "  Node 3: UDP:3003, HTTP:8083"
    echo "  Node 4: UDP:3004, HTTP:8084"
    echo "  Monitor: http://localhost:8090"
    echo ""
    echo -e "${YELLOW}💡 Use '$0 status' to check node health${NC}"
    echo -e "${YELLOW}💡 Use '$0 logs' to view logs${NC}"
    echo -e "${YELLOW}💡 Use '$0 monitor' to open dashboard${NC}"
}

# Function to stop all nodes
stop_nodes() {
    echo -e "${YELLOW}🛑 Stopping RFC XXXX network...${NC}"
    cd "${DOCKER_DIR}"
    docker-compose down
    echo -e "${GREEN}✅ RFC XXXX network stopped${NC}"
}

# Function to restart all nodes
restart_nodes() {
    echo -e "${YELLOW}🔄 Restarting RFC XXXX network...${NC}"
    stop_nodes
    sleep 2
    start_nodes
}

# Function to show status
show_status() {
    echo -e "${BLUE}📊 RFC XXXX Network Status${NC}"
    echo "=========================="
    cd "${DOCKER_DIR}"
    docker-compose ps

    echo ""
    echo -e "${BLUE}🔍 Health Checks:${NC}"
    for i in {1..4}; do
        if docker exec rfcxxxx-node-${i} node -e "console.log('Node ${i} healthy')" 2>/dev/null; then
            echo -e "  Node ${i}: ${GREEN}✅ Healthy${NC}"
        else
            echo -e "  Node ${i}: ${RED}❌ Unhealthy${NC}"
        fi
    done
}

# Function to show logs
show_logs() {
    local follow=false
    local node=""

    # Parse options
    while [[ $# -gt 0 ]]; do
        case $1 in
            --follow)
                follow=true
                shift
                ;;
            --node)
                node="$2"
                shift 2
                ;;
            *)
                shift
                ;;
        esac
    done

    cd "${DOCKER_DIR}"

    if [ -n "$node" ]; then
        echo -e "${BLUE}📋 Logs for Node ${node}${NC}"
        if [ "$follow" = true ]; then
            docker-compose logs -f "rfcxxxx-node-${node}"
        else
            docker-compose logs "rfcxxxx-node-${node}"
        fi
    else
        echo -e "${BLUE}📋 All Node Logs${NC}"
        if [ "$follow" = true ]; then
            docker-compose logs -f
        else
            docker-compose logs
        fi
    fi
}

# Function to start development environment
start_dev() {
    echo -e "${YELLOW}🔧 Starting development environment...${NC}"
    cd "${DOCKER_DIR}"
    docker-compose up -d rfcxxxx-dev
    echo -e "${GREEN}✅ Development environment started${NC}"
    echo -e "${BLUE}💡 Access at: http://localhost:8080${NC}"
}

# Function to run tests
run_tests() {
    echo -e "${YELLOW}🧪 Running tests in container...${NC}"
    cd "${DOCKER_DIR}"
    docker-compose run --rm rfcxxxx-dev npm test
}

# Function to run demo
run_demo() {
    echo -e "${YELLOW}🎬 Running RFC XXXX showcase demo...${NC}"
    cd "${DOCKER_DIR}"
    docker-compose run --rm rfcxxxx-dev npm run demo:real
}

# Function to clean up
cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up RFC XXXX containers and volumes...${NC}"
    cd "${DOCKER_DIR}"
    docker-compose down -v --remove-orphans
    docker system prune -f
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Function to open monitoring dashboard
open_monitor() {
    echo -e "${BLUE}📊 Opening monitoring dashboard...${NC}"
    if command -v xdg-open > /dev/null; then
        xdg-open http://localhost:8090
    elif command -v open > /dev/null; then
        open http://localhost:8090
    else
        echo -e "${YELLOW}💡 Open your browser to: http://localhost:8090${NC}"
    fi
}

# Main command handling
case "${1:-help}" in
    start)
        start_nodes
        ;;
    stop)
        stop_nodes
        ;;
    restart)
        restart_nodes
        ;;
    status)
        show_status
        ;;
    logs)
        shift
        show_logs "$@"
        ;;
    dev)
        start_dev
        ;;
    test)
        run_tests
        ;;
    demo)
        run_demo
        ;;
    clean)
        cleanup
        ;;
    monitor)
        open_monitor
        ;;
    help|--help)
        show_help
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
