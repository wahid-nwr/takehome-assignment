resource "google_redis_instance" "this" {

  name           = var.instance_name
  project        = var.project_id
  region         = var.region

  tier           = var.tier
  memory_size_gb = var.memory_size_gb

  redis_version  = var.redis_version

  labels = var.labels

  auth_enabled = var.auth_enabled
}