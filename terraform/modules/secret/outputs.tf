output "secret_ids" {
  description = "Map of logical secret name -> Secret Manager secret_id, for wiring into Cloud Run secret_key_ref"
  value       = { for name in var.secret_names : name => google_secret_manager_secret.this[name].secret_id }
}