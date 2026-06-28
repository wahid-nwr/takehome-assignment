resource "google_project_service" "services" {

  for_each = toset([
    "compute.googleapis.com",
    "servicenetworking.googleapis.com",
    "vpcaccess.googleapis.com"
  ])

  project = var.project_id
  service = each.value

  disable_on_destroy = false
}

resource "google_compute_network" "this" {

  name                    = var.network_name

  auto_create_subnetworks = true

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

  ip_cidr_range = "10.8.0.0/28"

  project = var.project_id
}