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

      # Sensitive config (DB/Redis connection strings, etc.) is injected from
      # Secret Manager at container start rather than as plain-text env vars.
      dynamic "env" {
        for_each = var.secret_env_vars

        content {
          name = env.key

          value_source {
            secret_key_ref {
              secret  = env.value
              version = "latest"
            }
          }
        }
      }
    }
  }

  # --- Canary / blue-green traffic split -----------------------------------
  # Two independent dynamic blocks instead of one conditional list — mixing
  # `revision = null` (LATEST target) and `revision = <string>` (REVISION
  # target) inside a single ternary's object list trips Terraform's dynamic
  # block type unification. Each block below is internally homogeneous, so
  # there's nothing to unify.

  # Target 1: the LATEST revision (the one just deployed) — always present.
  # 100% when there's no stable_revision to split against yet (e.g. first
  # deploy); otherwise gets canary_percent% while stable_revision holds the rest.
  dynamic "traffic" {
    for_each = [1]

    content {
      type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
      percent = var.stable_revision == null ? 100 : var.canary_percent
      tag     = var.stable_revision == null ? "live" : "canary"
    }
  }

  # Target 2: the pinned last-known-good revision — only present once
  # stable_revision is supplied (i.e. from the second deploy onward).
  dynamic "traffic" {
    for_each = var.stable_revision == null ? [] : [var.stable_revision]

    content {
      type     = "TRAFFIC_TARGET_ALLOCATION_TYPE_REVISION"
      revision = traffic.value
      percent  = 100 - var.canary_percent
      tag      = "stable"
    }
  }

  ingress = var.ingress
}

resource "google_cloud_run_service_iam_member" "invokers" {
  for_each = toset(var.invoker_members)

  project  = var.project_id
  location = var.region
  service  = google_cloud_run_v2_service.api.name

  role   = "roles/run.invoker"
  member = each.value
}