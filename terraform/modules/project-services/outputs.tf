output "enabled_services" {
  description = "Set of enabled Google Cloud services"
  value       = keys(google_project_service.services)
}