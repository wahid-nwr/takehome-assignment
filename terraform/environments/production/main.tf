locals {
  labels = {
    application = "feature-flag-service"
    environment = "production"
    managed_by  = "terraform"
  }

  service_name = "feature-flag-service"

  cloud_sql_tier = "db-f1-micro"
  redis_tier     = "BASIC"
  redis_memory   = 1

  min_instances = 0
  max_instances = 2

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

module "cloud_run" {

  source = "../../modules/cloud-run"

  project_id = var.project_id
  region     = var.region

  service_name    = local.service_name
  container_image = var.container_image

  vpc_connector = module.networking.vpc_connector

  resources = {
    cpu    = "2"
    memory = "1Gi"
  }

  min_instances = 1
  max_instances = 10

  env_vars = local.app_env

  labels = local.labels
}

module "cloud_sql" {

  source = "../../modules/cloud-sql"

  project_id = var.project_id
  region     = var.region

  instance_name = "feature-flag-db"

  database_name = "feature_flags"

  username = "featureflags"

  tier = "db-custom-2-4096"

  private_network = module.networking.network_self_link

  backup_enabled      = true
  deletion_protection = true
  prevent_destroy     = true

  labels = local.labels
}

module "redis" {

  source = "../../modules/redis"

  project_id = var.project_id
  region     = var.region

  instance_name = "feature-flag-redis"

  tier = "STANDARD_HA"

  memory_size_gb = 2

  prevent_destroy = true

  labels = local.labels
}

module "networking" {

  source = "../../modules/networking"

  project_id = var.project_id

  region = var.region

  network_name = "feature-flag-network"

  labels = local.labels
}