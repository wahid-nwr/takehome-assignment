locals {
  labels = {
    application = "feature-flag-service"
    environment = "staging"
    managed_by  = "terraform"
  }

  service_name = "feature-flag-service-staging"

  cloud_sql_tier = "db-custom-2-4096"
  redis_tier     = "BASIC"
  redis_memory   = 1

  min_instances = 1
  max_instances = 10

  database_url = format(
    "postgresql://%s:%s@%s:5432/%s",
    module.cloud_sql.username,
    module.cloud_sql.password,
    module.cloud_sql.private_ip,
    module.cloud_sql.database_name
  )

  redis_url = format(
    "redis://%s:%s",
    module.redis.host,
    module.redis.port
  )

  app_env = {
    NODE_ENV     = "staging"
    DATABASE_URL = local.database_url
    REDIS_URL    = local.redis_url
  }
}

module "project_services" {
  source     = "../../modules/project-services"
  project_id = var.project_id

  services = [
    "compute.googleapis.com",
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "redis.googleapis.com",
    "vpcaccess.googleapis.com",
    "secretmanager.googleapis.com",
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "cloudresourcemanager.googleapis.com",
  ]
}

module "networking" {

  source = "../../modules/networking"

  project_id = var.project_id

  region = var.region

  network_name = "ff-stg"

  labels = local.labels

  depends_on = [
    module.project_services
  ]
}

module "artifact_registry" {

  source = "../../modules/artifact-registry"

  project_id = var.project_id

  region = var.region

  repository_id = "feature-flag"
}

module "cloud_run" {

  source = "../../modules/cloud-run"

  project_id = var.project_id
  region     = var.region

  service_name = local.service_name

  container_image = var.container_image

  vpc_connector = module.networking.vpc_connector

  cpu    = "1"
  memory = "512Mi"

  min_instances = local.max_instances
  max_instances = local.max_instances

  env_vars = local.app_env

  labels = local.labels
  service_account_email = ""

  depends_on = [
    module.project_services
  ]
}

module "cloud_sql" {

  source = "../../modules/cloud-sql"

  project_id = var.project_id
  region     = var.region

  instance_name = "feature-flag-db-staging"

  database_name = "feature_flags"

  username = "featureflags"

  tier = local.cloud_sql_tier

  private_network = module.networking.network_self_link

  depends_on = [
    module.project_services,
    module.networking
  ]

  backup_enabled      = true
  deletion_protection = false
  prevent_destroy     = false

  labels = local.labels
}

module "redis" {

  source = "../../modules/redis"

  project_id = var.project_id
  region     = var.region

  instance_name = "feature-flag-redis-staging"

  tier = local.redis_tier

  memory_size_gb = local.redis_memory

  prevent_destroy = false

  labels = local.labels

  depends_on = [
    module.project_services
  ]
}