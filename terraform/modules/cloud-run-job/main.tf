resource "google_cloud_run_v2_job" "migration" {

  name = "${var.name}-migration"
  project  = var.project_id
  location = var.region

  template {

    template {

      service_account = var.runtime_service_account

      containers {

        image = var.container_image

        command = ["npx"]

        args = [
          "prisma",
          "migrate",
          "deploy"
        ]

        env {
          name = "DATABASE_URL"

          value_source {
            secret_key_ref {
              secret  = var.database_url_secret_id
              version = "latest"
            }
          }
        }

      }

      vpc_access {
        connector = var.vpc_connector
        egress    = "PRIVATE_RANGES_ONLY"
      }

    }
  }
}