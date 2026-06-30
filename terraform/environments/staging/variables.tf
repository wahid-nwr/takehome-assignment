variable "project_id" {
  description = "Google Cloud project ID"
  type        = string
}

variable "region" {
  description = "Google Cloud region"
  type        = string
}

variable "container_image" {
  description = "Container image to deploy"
  type        = string
}

variable "invoker_members" {
  description = "GitHub Actions service account"
  type        = list(string)
  default     = []
}

variable "runtime_service_account" {
  type = string
}