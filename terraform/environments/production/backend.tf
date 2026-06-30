terraform {
  backend "gcs" {
    bucket = "feature-flag-terraform-state"
    prefix = "production"
  }
}