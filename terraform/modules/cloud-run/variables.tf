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
  description = "Application environment variables"
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