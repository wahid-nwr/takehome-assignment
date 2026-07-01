## Table of Contents

- Project Overview
- Features
- Technology Stack
- Architecture Overview
- Project Structure
- Running Locally
- API Overview
- Feature Evaluation Algorithm
- Infrastructure
- CI/CD Pipeline
- Security
- Design Decisions
- Trade-offs
- Testing Strategy
- Future Improvements
- Deployment Information

# Project Overview

This project implements a multi-tenant Feature Flag Service designed to centrally manage runtime configuration and feature rollouts for multiple applications. It provides APIs for managing feature flags, evaluating feature values at runtime, and gradually releasing new functionality through deterministic percentage-based rollouts.

The service is built with a strong emphasis on both backend engineering and platform engineering. Beyond implementing the application itself, the project includes containerization, infrastructure-as-code, automated CI/CD pipelines, and deployment to Google Cloud Platform using modern cloud-native practices.

The solution is implemented using TypeScript, Node.js, Express, Prisma, PostgreSQL, Redis, Docker, Terraform, GitHub Actions, and Google Cloud Platform. Infrastructure is provisioned entirely through Terraform, while GitHub Actions automates validation, testing, container image publishing, and deployments to separate staging and production environments.

The primary objective of this project is to demonstrate practical software engineering skills across application development, infrastructure automation, deployment pipelines, and engineering decision-making while keeping the overall solution maintainable and appropriately scoped for the assignment.

# Features

## Implemented

### Backend

* Multi-tenant feature flag management
* Environment-scoped feature flags (development, staging, production)
* Feature flag CRUD operations
* Deterministic percentage-based rollout engine
* Bulk feature flag evaluation
* Request validation and error handling
* PostgreSQL persistence using Prisma ORM
* Redis integration for caching
* Unit tests for the evaluation engine

### Platform & DevOps

* Multi-stage Docker build for production
* Docker Compose for local development
* Infrastructure provisioned with Terraform
* Modular Terraform configuration with reusable modules
* Separate bootstrap and environment infrastructure
* Google Cloud Run deployment
* Cloud SQL (PostgreSQL)
* Memorystore (Redis)
* VPC and Serverless VPC Connector
* Artifact Registry
* Dedicated runtime service accounts
* Workload Identity Federation for GitHub Actions
* Automated CI pipeline
* Automated CD pipelines for staging and production
* Separate Google Cloud projects for staging and production

## Assignment Coverage

| Requirement                                | Status |
| ------------------------------------------ | :----: |
| Multi-tenant feature management            |    ✅   |
| Feature flag CRUD                          |    ✅   |
| Environment-scoped configuration           |    ✅   |
| Deterministic percentage rollouts          |    ✅   |
| Bulk evaluation endpoint                   |    ✅   |
| PostgreSQL persistence                     |    ✅   |
| Redis caching                              |    ✅   |
| Docker & Docker Compose                    |    ✅   |
| Terraform infrastructure                   |    ✅   |
| Cloud Run deployment                       |    ✅   |
| GitHub Actions CI/CD                       |    ✅   |
| Separate staging & production environments |    ✅   |
| Runtime service accounts                   |    ✅   |
| Workload Identity Federation               |    ✅   |
| Real-time distribution (SSE/WebSocket)     |    ❌   |
| Cloud Monitoring dashboards & alerts       |    ❌   |
| Secret Manager integration                 |    ❌   |
| Load testing                               |    ❌   |
| Automated rollback / traffic splitting     |    ❌   |


# Technology Stack

| Category               | Technology             | Reason for Selection                                                                             |
| ---------------------- | ---------------------- | ------------------------------------------------------------------------------------------------ |
| Language               | TypeScript             | Strong typing improves maintainability and reduces runtime errors.                               |
| Runtime                | Node.js                | Well suited for building lightweight, asynchronous API services.                                 |
| Web Framework          | Express                | Minimal framework providing flexibility without unnecessary abstraction.                         |
| ORM                    | Prisma                 | Type-safe database access with schema migrations and a clean developer experience.               |
| Database               | PostgreSQL (Cloud SQL) | Reliable relational database suitable for multi-tenant configuration data.                       |
| Cache                  | Redis (Memorystore)    | Reduces database load and improves response times for frequently evaluated flags.                |
| Infrastructure as Code | Terraform              | Enables repeatable, version-controlled infrastructure provisioning.                              |
| Containerization       | Docker                 | Ensures consistent environments across local development, CI, and production.                    |
| CI/CD                  | GitHub Actions         | Automates validation, testing, image publishing, and deployment workflows.                       |
| Cloud Platform         | Google Cloud Platform  | Fully managed services reduce operational overhead while supporting modern deployment practices. |

Design Philosophy: The technology choices prioritize simplicity, maintainability, and managed cloud services over introducing additional frameworks or operational complexity. This keeps the solution focused on the assignment objectives while following production-oriented engineering practices.

# Architecture Overview

The Feature Flag Service is designed as a stateless REST API that separates application logic from infrastructure concerns. Feature flag definitions are stored in PostgreSQL, while Redis is used to improve evaluation performance by reducing repeated database access. The application is deployed on Google Cloud Run, allowing the service to scale automatically based on incoming traffic.

The infrastructure is provisioned using Terraform and organized into reusable modules with separate bootstrap and environment-specific configurations. Continuous Integration and Continuous Deployment are implemented using GitHub Actions, enabling automated validation, testing, infrastructure provisioning, and application deployment to both staging and production environments.

## Application Request Flow

The following diagram illustrates the request flow during feature flag evaluation.

```text
                Client
                   │
                   ▼
          Feature Flag Service
             (Cloud Run)
                   │
          Evaluation Engine
                   │
          Check Redis Cache
             │           │
        Cache Hit    Cache Miss
             │           │
             │     PostgreSQL
             │           │
             └───────────┘
                   │
             Evaluated Result
                   │
                   ▼
                 Client
```

## Deployment Overview

The application is deployed on Google Cloud Platform using managed services.

```text
Developer
     │
     ▼
GitHub Repository
     │
GitHub Actions
     │
 ├── Validate
 ├── Test
 ├── Build Docker Image
 ├── Push Artifact Registry
 └── Deploy via Terraform
            │
            ▼
Google Cloud Platform

 ├── Cloud Run
 ├── Cloud SQL (PostgreSQL)
 ├── Memorystore (Redis)
 ├── Artifact Registry
 ├── VPC
 ├── Serverless VPC Connector
 └── IAM Service Accounts
```

The service is deployed to separate staging and production environments. Each environment has its own Google Cloud project, infrastructure, runtime service account, and deployment pipeline, providing clear isolation between environments while keeping the deployment process consistent.


# Project Structure

```text
.
├── src/                    # Application source code
│   ├── modules/            # Domain modules (feature flags, evaluation, etc.)
│   ├── common/             # Shared utilities, middleware, and helpers
│   └── index.ts            # Application entry point
│
├── prisma/                 # Database schema and migrations
│
├── terraform/
│   ├── bootstrap/          # One-time project resources
│   ├── staging/            # Staging environment infrastructure
│   ├── production/         # Production environment infrastructure
│   └── modules/            # Reusable Terraform modules
│
├── .github/
│   ├── workflows/          # CI/CD pipelines
│   └── actions/            # Reusable GitHub Actions
│
├── tests/                  # Unit and integration tests
├── docker-compose.yml      # Local development environment
├── Dockerfile              # Production container image
└── README.md
```

The project is organized to separate application logic, infrastructure, automation, and testing into independent areas of responsibility.

* **src/** contains the application source code following a modular structure to keep business logic, API endpoints, and shared components well organized.
* **terraform/** contains all infrastructure-as-code, separating one-time project resources from environment-specific infrastructure while promoting module reuse.
* **.github/** contains reusable GitHub Actions and deployment workflows for Continuous Integration and Continuous Deployment.
* **tests/** contains automated tests covering the core business logic.
* **prisma/** manages the database schema and migrations used by the application.


# Running Locally

## Prerequisites

Before running the application, ensure the following tools are installed:

* Node.js
* Docker and Docker Compose
* PostgreSQL (optional when using Docker Compose)
* Redis (optional when using Docker Compose)

## Clone the Repository

```bash
git clone <repository-url>
cd <repository-name>
```

## Configure Environment Variables

Create a `.env` file from the provided example and update the required values.

```bash
cp .env.example .env
```

Configure the database, Redis, and application settings as required.

## Start Dependencies

Run PostgreSQL and Redis using Docker Compose.

```bash
docker compose up -d
```

## Install Dependencies

```bash
npm install
```

## Apply Database Migrations

```bash
npx prisma migrate deploy
```

For local development, you may also use:

```bash
npx prisma migrate dev
```

## Start the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm run build
npm start
```

## Verify the Service

Once the application is running, verify the health endpoint:

```text
GET /health
```

A successful response indicates that the service is ready to accept requests.│   ├── config/             # Application configuration


# API Overview

The service exposes RESTful APIs for managing feature flags and evaluating feature values at runtime. All endpoints communicate using JSON over HTTP.

## Core Endpoints

| Method | Endpoint                                     | Description                                   |
| ------ | -------------------------------------------- | --------------------------------------------- |
| POST   | `/api/v1/tenants`                            | Register a new tenant.                        |
| POST   | `/api/v1/tenants/{tenantId}/flags`           | Create a feature flag.                        |
| GET    | `/api/v1/tenants/{tenantId}/flags`           | List feature flags.                           |
| PUT    | `/api/v1/tenants/{tenantId}/flags/{flagKey}` | Update an existing feature flag.              |
| DELETE | `/api/v1/tenants/{tenantId}/flags/{flagKey}` | Archive a feature flag.                       |
| POST   | `/api/v1/evaluate`                           | Evaluate a feature flag for a user.           |
| POST   | `/api/v1/evaluate/bulk`                      | Evaluate all active feature flags for a user. |
| GET    | `/health`                                    | Application health check.                     |

## Example: Create new tenant
**Request**

```http
POST /api/v1/tenants
Authorization: Bearer ff_admin_xxxxxxxxx
Content-Type: application/json
```

```json
{
  "environment": "production",
  "userId": "user-456",
  "flagKey": "new-checkout"
}
```

**Response**

```json
{
  "name": "Acme",
  "apiKey": "ff_live_xxxxxxxxxxxxxxxxx"
}
```

## Example: Feature Flag Evaluation

**Request**

```http
POST /api/v1/evaluate
Content-Type: application/json
Authorization: Bearer ff_live_xxxxxxxxxxxxxxxxx
```

```json
{
  "environment": "production",
  "userId": "user-456",
  "flagKey": "new-checkout"
}
```

**Response**

```json
{
  "flagKey": "new-checkout",
  "value": true,
  "reason": "percentage-rollout"
}
```

## Response Codes

| Status Code | Description                       |
| ----------- | --------------------------------- |
| 200         | Request completed successfully.   |
| 201         | Resource created successfully.    |
| 400         | Invalid request payload.          |
| 401         | Authentication failed.            |
| 404         | Requested resource was not found. |
| 500         | Unexpected server error.          |


## Authentication

The service uses API key authentication.

### Service API Key

Administrative operations (tenant provisioning) require a service API key.

Example:

Authorization: Bearer <SERVICE_API_KEY>

### Tenant API Key

Each tenant receives a unique API key during provisioning.

The key is returned only once and stored as a SHA-256 hash.

Subsequent API requests authenticate using:

Authorization: Bearer <TENANT_API_KEY>

# Feature Evaluation Algorithm

Feature flag evaluation is designed to be deterministic, ensuring that the same user consistently receives the same feature variation for a given flag. This behavior is essential for gradual rollouts, user experience consistency, and repeatable experimentation.

For percentage-based rollouts, the service combines the feature flag identifier with the user identifier to produce a deterministic hash value. The hash is then mapped to a value between **0 and 99**. If the calculated value falls within the configured rollout percentage, the feature is enabled for that user; otherwise, the default flag value is returned.

For example, with a rollout percentage of **25%**, only users whose calculated hash value falls within **0–24** receive the feature. Because the hash input remains unchanged for the same user and feature flag, subsequent evaluations always produce the same result.

```text
flag_key + user_id
        │
        ▼
Deterministic Hash
        │
        ▼
Hash % 100
        │
        ▼
Compare with rollout percentage
        │
        ▼
Return evaluated flag value
```

This approach provides predictable rollouts without maintaining per-user state, while allowing rollout percentages to be increased gradually as confidence in a feature grows.


# Infrastructure

The application is deployed on Google Cloud Platform (GCP) using fully managed services. All infrastructure is provisioned with Terraform, enabling consistent, repeatable deployments across staging and production environments.

## Infrastructure Components

| Component          | Service                        | Purpose                                                                              |
| ------------------ | ------------------------------ | ------------------------------------------------------------------------------------ |
| Compute            | Cloud Run                      | Hosts the Feature Flag Service as a stateless containerized application.             |
| Database           | Cloud SQL (PostgreSQL)         | Stores tenants, feature flags, and application data.                                 |
| Cache              | Memorystore (Redis)            | Improves performance by reducing repeated database access during feature evaluation. |
| Container Registry | Artifact Registry              | Stores versioned Docker images for deployment.                                       |
| Networking         | VPC & Serverless VPC Connector | Enables secure connectivity between Cloud Run and private resources.                 |
| Identity & Access  | IAM Service Accounts           | Provides least-privilege access for runtime workloads and deployment automation.     |

## Terraform Structure

The Terraform configuration is organized to separate one-time project resources from environment-specific infrastructure.

```text
terraform/
├── bootstrap/
│   ├── staging/
│   └── production/
├── staging/
├── production/
└── modules/
```

* **bootstrap/** provisions project-level resources that are created once, including service enablement, Artifact Registry, runtime service accounts, and other shared infrastructure.
* **staging/** provisions infrastructure dedicated to the staging environment.
* **production/** provisions infrastructure dedicated to the production environment.
* **modules/** contains reusable Terraform modules shared across environments.

This separation keeps environment deployments focused on runtime infrastructure while avoiding unnecessary recreation of shared project resources.

## Environment Isolation

The project maintains independent staging and production environments.

Each environment has:

* A dedicated Google Cloud project
* Independent infrastructure
* Separate runtime service account
* Separate deployment pipeline
* Independent Terraform state

This isolation reduces the risk of accidental cross-environment changes while allowing both environments to evolve independently using the same infrastructure code.


# CI/CD Pipeline

The project uses GitHub Actions to automate validation, testing, container image publishing, infrastructure provisioning, and application deployment. The pipeline is designed to provide a consistent deployment process while maintaining clear separation between staging and production environments.

## Continuous Integration

The CI pipeline is triggered for changes to feature branches, `develop`, and `main`.

Each execution performs the following steps:

1. Install project dependencies
2. Validate source code
3. Build the application
4. Execute automated tests
5. Generate and publish test coverage artifacts

This ensures that application changes are validated before deployment.

## Continuous Deployment

Deployment is implemented using separate workflows for staging and production.

Each deployment performs the following sequence:

1. Execute the CI pipeline
2. Build the production Docker image
3. Push the image to Google Artifact Registry
4. Execute Terraform Plan
5. Apply infrastructure changes with Terraform
6. Deploy the latest application revision to Cloud Run

Staging and production deployments are isolated through independent Google Cloud projects, runtime service accounts, Workload Identity Providers, and GitHub Environments.

```text
          Git Push
              │
              ▼
      GitHub Actions
              │
     ┌────────┴────────┐
     │                 │
     ▼                 ▼
 Validate          Run Tests
     │                 │
     └────────┬────────┘
              ▼
      Build Docker Image
              │
              ▼
 Push to Artifact Registry
              │
              ▼
      Terraform Plan
              │
              ▼
      Terraform Apply
              │
              ▼
      Deploy to Cloud Run
```

This deployment workflow ensures that application and infrastructure changes are delivered together using the same version-controlled pipeline, reducing manual intervention and improving deployment consistency.


# Security

The project applies several security practices to reduce operational risk while keeping the solution appropriately scoped for the assignment.

## Identity and Access Management

Application deployments authenticate to Google Cloud using **Workload Identity Federation**, allowing GitHub Actions to obtain short-lived credentials without storing long-lived service account keys in the repository.

At runtime, the application executes using a dedicated service account rather than the default Compute Engine service account. This follows the principle of least privilege by granting the application only the permissions required for normal operation.

## Environment Isolation

Staging and production environments are deployed into separate Google Cloud projects with independent infrastructure, runtime service accounts, and deployment pipelines. This separation minimizes the risk of accidental cross-environment access or deployment.

## Infrastructure Security

Infrastructure is managed exclusively through Terraform, ensuring that infrastructure changes are version-controlled, reviewable, and reproducible.

Cloud Run connects to private infrastructure through a Serverless VPC Connector, allowing managed services such as Cloud SQL and Redis to remain isolated from direct public access where appropriate.

## Container Security

The application is packaged using a multi-stage Docker build to produce a lightweight production image. The runtime container executes as a non-root user, following container security best practices.

## Future Security Enhancements

The following security improvements were identified but were intentionally left out to keep the implementation focused on the core assignment requirements:

* Secret Manager integration for application secrets
* Automated secret rotation
* API rate limiting
* Additional audit and monitoring policies


# Design Decisions

The following design decisions were made to balance simplicity, maintainability, and the objectives of the assignment.

| Decision                                 | Rationale                                                                                                                                                                                                                           |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Modular application structure**        | The application is organized into domain-focused modules to separate business logic, data access, and API concerns, making the codebase easier to maintain and extend.                                                              |
| **Stateless application design**         | Business state is persisted in PostgreSQL while application instances remain stateless, allowing Cloud Run to scale horizontally without session affinity.                                                                          |
| **Deterministic rollout algorithm**      | Feature evaluations use deterministic hashing to ensure that the same user consistently receives the same feature variation during gradual rollouts.                                                                                |
| **Prisma as the data access layer**      | Prisma provides type-safe database access and migration management while reducing boilerplate code.                                                                                                                                 |
| **Terraform modularization**             | Infrastructure is organized into reusable modules to improve consistency and reduce duplication across environments.                                                                                                                |
| **Bootstrap and environment separation** | One-time project resources (such as service enablement, Artifact Registry, and runtime service accounts) are managed separately from environment-specific infrastructure, resulting in cleaner infrastructure lifecycle management. |
| **Environment isolation**                | Staging and production use separate Google Cloud projects, infrastructure, runtime identities, and deployment pipelines to reduce operational risk.                                                                                 |
| **Workload Identity Federation**         | GitHub Actions authenticates using short-lived credentials instead of long-lived service account keys, improving deployment security.                                                                                               |
| **Managed Google Cloud services**        | Cloud Run, Cloud SQL, and Memorystore were selected to minimize operational overhead while allowing the project to focus on application and platform engineering rather than infrastructure management.                             |
| **Infrastructure as Code**               | All cloud resources are provisioned through Terraform, ensuring deployments are reproducible, version-controlled, and consistent across environments.                                                                               |


# Trade-offs

The implementation focuses on delivering a maintainable and production-oriented solution while remaining appropriately scoped for the assignment. The following trade-offs were made intentionally.

| Decision                                         | Trade-off                                                                                                                                                                                                                                                                        |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Express instead of NestJS**                    | Express provides greater flexibility with less framework abstraction, while requiring more explicit project structure and application wiring.                                                                                                                                    |
| **Managed GCP services**                         | Cloud Run, Cloud SQL, and Memorystore reduce operational complexity at the expense of lower infrastructure customization compared to self-managed alternatives.                                                                                                                  |
| **Terraform modularization**                     | Separating bootstrap resources from environment-specific infrastructure improves long-term maintainability, although it introduces additional Terraform configuration.                                                                                                           |
| **Separate staging and production environments** | Independent environments improve deployment safety and isolation but require duplicate infrastructure and additional cloud resources.                                                                                                                                            |
| **Stateless application architecture**           | Stateless services simplify scaling and deployments but require persistent storage and external caching services.                                                                                                                                                                |
| **Focused implementation scope**                 | Development effort was prioritized on the core backend, infrastructure, and deployment requirements. Optional features such as real-time distribution, advanced observability, and automated rollback were intentionally deferred to keep the solution focused and maintainable. |
| **Documentation over additional features**       | The final stage of development prioritized clear documentation, architecture explanations, and engineering rationale over implementing additional non-core functionality, reflecting the importance of maintainability and knowledge sharing in production systems.              |


# Testing Strategy

The testing approach focuses on validating the core business logic of the application, with particular emphasis on the feature evaluation engine where correctness is critical.

## Current Test Coverage

The automated test suite primarily covers:

* Feature flag evaluation logic
* Deterministic percentage-based rollout behavior
* Rollout percentage boundary conditions
* Different feature flag types
* Invalid input and validation scenarios
* Core business logic components

These tests execute automatically as part of the Continuous Integration pipeline to ensure application changes do not introduce regressions.

## Testing Philosophy

The feature evaluation engine is the most critical component of the system because incorrect evaluations directly affect application behavior. For this reason, testing effort was concentrated on deterministic behavior and business rule correctness rather than maximizing code coverage.

The CI pipeline validates every change by building the application, executing the automated test suite, and publishing test coverage artifacts.

## Performance Testing

The feature evaluation endpoint was load tested using k6 with a ramping workload.

**Configuration**

- Ramp-up to 50 virtual users
- 50-second execution
- Bearer API key authentication
- Randomized user identifiers to exercise percentage rollout logic

**Results (Local Development)**

| Metric | Result |
|--------|--------|
| Requests | 2,025 |
| Failed Requests | 0.00% |
| Average Latency | 2.31 ms |
| P95 Latency | 4.69 ms |
| Maximum Latency | 28.87 ms |

The service completed all requests successfully while maintaining consistently low response times.

## Future Test Enhancements

Given additional time, the following tests would be added:

* Integration tests covering end-to-end API workflows
* Tenant isolation tests to verify strict separation between tenants
* Environment-scoped evaluation tests
* Infrastructure validation tests for Terraform modules
* Load testing of the evaluation endpoints using a tool such as k6 or Artillery
* Performance benchmarking for Redis cache effectiveness under concurrent workloads


# Future Improvements

The current implementation focuses on the core requirements of the assignment while maintaining a clean and maintainable architecture. Given additional time, the following enhancements would be considered:

* **Real-time feature distribution** using Server-Sent Events (SSE) or WebSockets to notify clients immediately when feature flags change.
* **Advanced targeting rules** to support user attributes, segments, and conditional feature evaluation beyond percentage-based rollouts.
* **Cloud Monitoring dashboards and alerting** for application health, latency, error rates, and infrastructure metrics.
* **Google Cloud Secret Manager** integration to centrally manage application secrets and database credentials.
* **Load and performance testing** to validate throughput, latency, and cache effectiveness under concurrent workloads.
* **Expanded automated testing**, including end-to-end API tests, tenant isolation tests, and infrastructure validation.
* **Progressive deployment strategies**, such as traffic splitting or automated rollback for safer production releases.

These improvements build upon the existing architecture without requiring significant changes to the overall system design.


# Deployment Information

The application is deployed to Google Cloud Platform with separate staging and production environments.

| Environment | URL                | Status |
| ----------- | ------------------ | ------ |
| Staging     | `<staging-url>`    | Active |
| Production  | `<production-url>` | Active |

## Health Endpoint

Each deployment exposes a health endpoint for basic service verification.

```text
GET /health
```

A successful response confirms that the application is running and ready to accept requests.

> **Note:** The deployed environments are provisioned and managed entirely through Terraform, while GitHub Actions automates the build and deployment process.
