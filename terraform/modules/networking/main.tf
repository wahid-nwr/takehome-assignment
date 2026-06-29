resource "google_compute_network" "this" {

  name = var.network_name

  auto_create_subnetworks = false

  project = var.project_id
}

resource "google_compute_global_address" "private_service_access" {

  name = "${var.network_name}-private-ip"

  purpose = "VPC_PEERING"

  address_type = "INTERNAL"

  prefix_length = 16

  network = google_compute_network.this.id

  project = var.project_id
}

resource "google_service_networking_connection" "private_service_access" {

  network = google_compute_network.this.id

  service = "servicenetworking.googleapis.com"

  reserved_peering_ranges = [
    google_compute_global_address.private_service_access.name
  ]
}

resource "google_vpc_access_connector" "this" {

  name = "${var.network_name}-connector"

  region = var.region

  network = google_compute_network.this.name

  min_instances = 2

  max_instances = 3

  ip_cidr_range = "10.8.0.0/28"

  project = var.project_id
}

resource "google_compute_subnetwork" "this" {
  name          = "${var.network_name}-subnet"
  network       = google_compute_network.this.id
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  project       = var.project_id
}