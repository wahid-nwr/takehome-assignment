output "cloud_run_url" {
  description = "Cloud Run service URL"
  value       = module.cloud_run.service_uri
}

output "cloud_sql_instance" {
  description = "Cloud SQL instance name"
  value       = module.cloud_sql.instance_name
}

output "redis_instance" {
  description = "Redis instance name"
  value       = module.redis.instance_name
}