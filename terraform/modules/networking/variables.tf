variable "project_id" {
  description = "Google Cloud project ID"
  type        = string
}

variable "region" {
  description = "Google Cloud region"
  type        = string
}

variable "network_name" {
  description = "VPC network name"
  type        = string
}

variable "labels" {
  description = "Labels applied to networking resources"
  type        = map(string)
  default     = {}
}