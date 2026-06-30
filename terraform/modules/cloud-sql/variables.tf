variable "project_id" {
  description = "Google Cloud project ID"
  type        = string
}

variable "region" {
  type = string
}

variable "instance_name" {
  type = string
}

variable "database_name" {
  type = string
}

variable "database_version" {
  type    = string
  default = "POSTGRES_16"
}

variable "tier" {
  type    = string
  default = "db-f1-micro"
}

variable "username" {
  type = string
}

variable "deletion_protection" {
  type    = bool
  default = false
}

variable "prevent_destroy" {
  type    = bool
  default = false
}

variable "backup_enabled" {
  type    = bool
  default = true
}

variable "labels" {
  description = "Labels applied to GCP resources"

  type = map(string)

  default = {}
}

variable "disk_size" {
  type    = number
  default = 20
}

variable "private_network" {
  description = "VPC network self link for private IP. Leave null to use public IP."
  type        = string
  default     = null
}