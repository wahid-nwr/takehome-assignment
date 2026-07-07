variable "project_id" {
  description = "Google Cloud project ID"
  type        = string
}

variable "name_prefix" {
  description = "Prefix applied to every secret_id created by this module, e.g. \"feature-flag-production\""
  type        = string
}

variable "secret_names" {
  description = "Logical names of the secrets to create, e.g. [\"database-url\", \"redis-url\"]. Must NOT be derived from a sensitive value — used as the for_each key."
  type        = list(string)
}

variable "secret_values" {
  description = "Map of logical secret name -> secret value (e.g. { database-url = \"postgresql://...\" }). Keys must exactly match secret_names."
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