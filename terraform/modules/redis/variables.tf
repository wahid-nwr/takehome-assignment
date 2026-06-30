variable "project_id" {
  description = "Google Cloud project ID"
  type        = string
}

variable "region" {
  description = "Google Cloud region"
  type        = string
}

variable "instance_name" {
  description = "Redis instance name"
  type        = string
}

variable "tier" {
  description = "Redis service tier"
  type        = string
  default     = "BASIC"
}

variable "memory_size_gb" {
  description = "Redis memory size in GB"
  type        = number
  default     = 1
}

variable "redis_version" {
  description = "Redis version"
  type        = string
  default     = "REDIS_7_2"
}

variable "labels" {
  description = "Labels applied to Redis resources"
  type        = map(string)
  default     = {}
}

variable "prevent_destroy" {
  description = "Prevent Terraform from destroying the Redis instance"
  type        = bool
  default     = false
}

variable "auth_enabled" {
  description = "Enable Redis AUTH"
  type        = bool
  default     = true
}