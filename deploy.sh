#!/bin/bash

# Build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build:prod
cd ..

# Build backend
echo "Building backend..."
cd backend
npm install
npm run build
cd ..

# Create production directory
echo "Creating production directory..."
mkdir -p production
cp -r backend/* production/
cp -r frontend/build production/public

echo "Deployment package ready in 'production' directory" 