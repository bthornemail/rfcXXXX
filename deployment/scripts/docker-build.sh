#!/bin/bash

# RFC XXXX Docker Build Script
# Builds Docker images for development and production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="rfcxxxx"
VERSION="1.0.0"
DOCKER_DIR="deployment/docker"

echo -e "${BLUE}🚀 RFC XXXX Docker Build Script${NC}"
echo "=================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Parse command line arguments
BUILD_TYPE="development"
PUSH=false
NO_CACHE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --production)
            BUILD_TYPE="production"
            shift
            ;;
        --push)
            PUSH=true
            shift
            ;;
        --no-cache)
            NO_CACHE=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --production    Build production image (default: development)"
            echo "  --push          Push image to registry after building"
            echo "  --no-cache      Build without using cache"
            echo "  --help          Show this help message"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Build arguments
BUILD_ARGS=""
if [ "$NO_CACHE" = true ]; then
    BUILD_ARGS="--no-cache"
fi

# Set image tag based on build type
if [ "$BUILD_TYPE" = "production" ]; then
    IMAGE_TAG="${IMAGE_NAME}:${VERSION}"
    BUILD_CONTEXT="."
    echo -e "${YELLOW}📦 Building production image...${NC}"
else
    IMAGE_TAG="${IMAGE_NAME}:dev"
    BUILD_CONTEXT="."
    echo -e "${YELLOW}🔧 Building development image...${NC}"
fi

# Build the image
echo -e "${BLUE}Building image: ${IMAGE_TAG}${NC}"
echo "Build context: ${BUILD_CONTEXT}"
echo "Dockerfile: ${DOCKER_DIR}/Dockerfile"

if docker build $BUILD_ARGS \
    -f "${DOCKER_DIR}/Dockerfile" \
    -t "${IMAGE_TAG}" \
    -t "${IMAGE_NAME}:latest" \
    "${BUILD_CONTEXT}"; then
    echo -e "${GREEN}✅ Image built successfully: ${IMAGE_TAG}${NC}"
else
    echo -e "${RED}❌ Failed to build image${NC}"
    exit 1
fi

# Show image information
echo -e "${BLUE}📊 Image Information:${NC}"
docker images "${IMAGE_NAME}" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"

# Push to registry if requested
if [ "$PUSH" = true ]; then
    echo -e "${YELLOW}📤 Pushing image to registry...${NC}"
    if docker push "${IMAGE_TAG}"; then
        echo -e "${GREEN}✅ Image pushed successfully${NC}"
    else
        echo -e "${RED}❌ Failed to push image${NC}"
        exit 1
    fi
fi

# Show usage instructions
echo -e "${GREEN}🎉 Build completed successfully!${NC}"
echo ""
echo -e "${BLUE}Usage examples:${NC}"
echo "  # Run single container"
echo "  docker run -p 3001:3001 -p 8080:8080 ${IMAGE_TAG}"
echo ""
echo "  # Run with docker-compose"
echo "  cd ${DOCKER_DIR} && docker-compose up"
echo ""
echo "  # Run development environment"
echo "  cd ${DOCKER_DIR} && docker-compose -f docker-compose.yml up rfcxxxx-dev"
echo ""
echo -e "${BLUE}Available ports:${NC}"
echo "  - 3001-3004: UDP consensus ports"
echo "  - 8080-8084: HTTP API ports"
echo "  - 8090: Monitoring dashboard"
