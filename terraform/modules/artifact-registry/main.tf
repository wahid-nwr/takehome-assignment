resource "google_artifact_registry_repository" "docker" {

  project = var.project_id

  location = var.region

  repository_id = "feature-flag"

  format = "DOCKER"

  description = "Docker images"
}