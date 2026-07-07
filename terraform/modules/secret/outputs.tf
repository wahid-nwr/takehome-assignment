output "secret_ids" {
  description = "Map of logical secret name -> Secret Manager secret_id, for wiring into Cloud Run secret_key_ref"
  value       = { for k, v in google_secret_manager_secret.this : k => v.secret_id }
}