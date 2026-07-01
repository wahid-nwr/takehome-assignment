variable "name" {
  type = string
}

variable "project_id" {
  type = string
}

variable "region" {
  type = string
}

variable "container_image" {
  type = string
}

variable "runtime_service_account" {
  type = string
}

variable "database_url" {
  type      = string
  sensitive = true
}

variable "vpc_connector" {
  type = string
}