resource "google_cloud_run_v2_service" "api" {

  name     = var.service_name
  location = var.region
  project  = var.project_id

  labels = var.labels

  template {

    execution_environment = "EXECUTION_ENVIRONMENT_GEN2"

    service_account = var.service_account_email

    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }

    max_instance_request_concurrency = var.max_concurrency

    dynamic "vpc_access" {
      for_each = var.vpc_connector == null ? [] : [1]

      content {
        connector = var.vpc_connector
        egress    = "PRIVATE_RANGES_ONLY"
      }
    }

    timeout = var.timeout_seconds

    containers {

      image = var.container_image

      ports {
        container_port = var.container_port
      }

      resources {
        limits = {
          cpu    = var.cpu
          memory = var.memory
        }
      }

      dynamic "env" {
        for_each = var.env_vars

        content {
          name  = env.key
          value = env.value
        }
      }
    }
  }

  ingress = var.ingress
}