variable "service_name" {
  description = "Cloud Run service name"
  type        = string
}

variable "project_id" {
  description = "Google Cloud project"
  type        = string
}

variable "region" {
  description = "Deployment region"
  type        = string
}

variable "container_image" {
  description = "Container image"
  type        = string
}

variable "container_port" {
  description = "Container listening port"
  type        = number
  default     = 3000
}

variable "cpu" {
  description = "CPU allocation"
  type        = string
  default     = "1"
}

variable "memory" {
  description = "Memory allocation"
  type        = string
  default     = "512Mi"
}

variable "min_instances" {
  type    = number
  default = 0
}

variable "max_instances" {
  type    = number
  default = 5
}

variable "timeout_seconds" {
  description = "Container request timeout"
  type        = string
  default     = "300s"
}

variable "max_concurrency" {
  type    = number
  default = 80
}

variable "deletion_protection" {
  type    = bool
  default = false
}

variable "env_vars" {
  description = "Plain (non-sensitive) application environment variables"
  type        = map(string)
  default     = {}
}

variable "secret_env_vars" {
  description = <<-EOT
    Environment variables sourced from Secret Manager instead of plain text.
    Map of ENV_VAR_NAME -> secret_id (as returned by the secret module's
    secret_ids output). Always resolves the "latest" version.
    Use this for credentials (DATABASE_URL, REDIS_URL, etc.) instead of env_vars.
  EOT
  type        = map(string)
  default     = {}
}

variable "vpc_connector" {
  description = "Serverless VPC Access connector"
  type        = string
  default     = null
}

variable "labels" {
  description = "Labels applied to the Cloud Run service"
  type        = map(string)
  default     = {}
}

variable "service_account_email" {
  description = "Service account used by Cloud Run"
  type        = string
}

variable "ingress" {
  type    = string
  default = "INGRESS_TRAFFIC_ALL"
}

variable "invoker_members" {
  description = "Members allowed to invoke the Cloud Run service."
  type        = list(string)
  default     = []
}

variable "canary_percent" {
  description = <<-EOT
    Percent of traffic (0-100) routed to the LATEST revision (the one just deployed).
    The remainder goes to stable_revision. Default 100 = simple full cutover,
    identical to previous behavior (no split). Set below 100 together with
    stable_revision to canary a new deploy before fully promoting it.
  EOT
  type        = number
  default     = 100

  validation {
    condition     = var.canary_percent >= 0 && var.canary_percent <= 100
    error_message = "canary_percent must be between 0 and 100."
  }
}

variable "stable_revision" {
  description = <<-EOT
    Name of the last known-good revision to keep serving (100 - canary_percent)%
    of traffic. Pass the previous deploy's latest_ready_revision output here.
    Leave null for a plain 100%-to-latest deploy (e.g. first-ever deploy, or
    when you don't want traffic splitting).
  EOT
  type    = string
  default = null
}