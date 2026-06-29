variable "project_id" {
  description = "Google Cloud project ID"
  type        = string
}

variable "services" {
  description = "Google Cloud APIs to enable"
  type        = set(string)
}