variable "project_id" {
  description = "Google Cloud project ID"
  type        = string
}

variable "region" {
  type = string
}

variable "name_prefix" {
  description = "Prefix applied to every secret_id created by this module, e.g. \"feature-flag-production\""
  type        = string
}

variable "secrets" {
  description = "Map of logical secret name -> secret value (e.g. { database-url = \"postgresql://...\" })"
  type        = map(string)
  sensitive   = true
}

variable "accessors" {
  description = "IAM members (e.g. \"serviceAccount:...\") granted secretmanager.secretAccessor on every secret in this module"
  type        = list(string)
  default     = []
}

variable "labels" {
  description = "Labels applied to each secret"
  type        = map(string)
  default     = {}
}