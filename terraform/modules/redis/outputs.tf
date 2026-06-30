output "instance_name" {
  description = "Redis instance name"
  value       = google_redis_instance.this.name
}

output "host" {
  description = "Redis host"
  value       = google_redis_instance.this.host
}

output "port" {
  description = "Redis port"
  value       = google_redis_instance.this.port
}

output "current_location_id" {
  description = "Redis zone"
  value       = google_redis_instance.this.current_location_id
}