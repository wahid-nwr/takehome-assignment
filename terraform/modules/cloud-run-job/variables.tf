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

variable "database_url_secret_id" {
  description = "Secret Manager secret_id holding the DATABASE_URL connection string"
  type        = string
}

variable "vpc_connector" {
  type = string
}