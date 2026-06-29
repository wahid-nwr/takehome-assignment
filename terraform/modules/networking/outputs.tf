output "network_name" {
  value = google_compute_network.this.name
}

output "network_self_link" {
  description = "Self link of the VPC network"
  value       = google_compute_network.this.self_link
}

output "vpc_connector" {
  value = google_vpc_access_connector.this.id
}

output "private_service_connection" {
  value = google_service_networking_connection.private_service_access
}