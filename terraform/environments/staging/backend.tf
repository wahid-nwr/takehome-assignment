terraform {
  backend "gcs" {
    bucket = "feature-flag-terraform-state"
    prefix = "staging"
  }
}