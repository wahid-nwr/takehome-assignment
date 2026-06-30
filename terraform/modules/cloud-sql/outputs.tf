output "instance_name" {
  value = google_sql_database_instance.this.name
}

output "database_name" {
  value = google_sql_database.this.name
}

output "username" {
  value = google_sql_user.this.name
}

output "password" {
  value     = random_password.database.result
  sensitive = true
}

output "private_ip" {
  value = google_sql_database_instance.this.private_ip_address
}

output "connection_name" {
  value = google_sql_database_instance.this.connection_name
}