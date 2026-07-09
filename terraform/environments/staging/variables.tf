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

variable "enable_redis" {
  type    = bool
  default = false
}

variable "cloud_sql_activation_policy" {
  type    = string
  default = "ALWAYS"
}

variable "service_api_key" {
  type      = string
  sensitive = true
}