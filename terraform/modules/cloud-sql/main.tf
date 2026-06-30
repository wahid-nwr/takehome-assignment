resource "random_password" "database" {
  length  = 32
  special = false
}

resource "google_sql_database_instance" "this" {
  name             = var.instance_name
  project          = var.project_id
  region           = var.region
  database_version = var.database_version

  deletion_protection = var.deletion_protection

  settings {
    tier = var.tier
    edition = "ENTERPRISE"

    availability_type = "ZONAL"

    disk_type = "PD_SSD"
    disk_size = var.disk_size

    disk_autoresize = true

    backup_configuration {
      enabled = var.backup_enabled
    }

    ip_configuration {
      ipv4_enabled = var.private_network == null

      private_network = var.private_network
    }

    user_labels = var.labels
  }
}

resource "google_sql_database" "this" {
  name     = var.database_name
  project  = var.project_id
  instance = google_sql_database_instance.this.name
}

resource "google_sql_user" "this" {
  project  = var.project_id
  instance = google_sql_database_instance.this.name

  name     = var.username
  password = random_password.database.result
}