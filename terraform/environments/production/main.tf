locals {
  labels = {
    application = "feature-flag-service"
    environment = "production"
    managed_by  = "terraform"
  }

  service_name = "feature-flag-service-production"

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
    NODE_ENV     = "production"
    DATABASE_URL = local.database_url
    REDIS_URL    = local.redis_url
  }
}

module "networking" {

  source = "../../modules/networking"

  project_id = var.project_id

  region = var.region

  network_name = "ff-production"

  labels = local.labels
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

  min_instances = local.min_instances

  max_instances = local.max_instances

  env_vars = local.app_env

  labels = local.labels
  service_account_email = var.runtime_service_account

  invoker_members = var.invoker_members
}

module "cloud_sql" {

  source = "../../modules/cloud-sql"

  project_id = var.project_id
  region     = var.region

  instance_name = "feature-flag-db-production"

  database_name = "feature_flags"

  username = "featureflags"

  tier = local.cloud_sql_tier

  private_network = module.networking.network_self_link

  depends_on = [
    module.networking
  ]

  backup_enabled      = true
  deletion_protection = true
  prevent_destroy     = true

  labels = local.labels
}

module "redis" {

  source = "../../modules/redis"

  project_id = var.project_id
  region     = var.region

  instance_name = "feature-flag-redis-production"

  tier = local.redis_tier

  memory_size_gb = local.redis_memory

  prevent_destroy = false

  labels = local.labels
}

module "cloud_run_job" {
  source = "../../modules/cloud-run-job"

  name                    = "feature-flag"
  project_id              = var.project_id
  region                  = var.region
  container_image         = var.container_image
  runtime_service_account = var.runtime_service_account
  database_url            = local.database_url
  vpc_connector           = module.networking.vpc_connector
}