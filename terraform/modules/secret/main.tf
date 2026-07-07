resource "google_secret_manager_secret" "this" {
  for_each = var.secrets

  project   = var.project_id
  secret_id = "${var.name_prefix}-${each.key}"

  labels = var.labels

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "this" {
  for_each = var.secrets

  secret      = google_secret_manager_secret.this[each.key].id
  secret_data = each.value
}

# Grant each accessor (e.g. the Cloud Run runtime service account) permission
# to read the latest version of every secret created here. Access is scoped
# to secretAccessor only (read-only), never secretmanager.admin.
resource "google_secret_manager_secret_iam_member" "accessors" {
  for_each = {
    for pair in setproduct(keys(var.secrets), var.accessors) :
    "${pair[0]}-${pair[1]}" => {
      secret_key = pair[0]
      member     = pair[1]
    }
  }

  project   = var.project_id
  secret_id = google_secret_manager_secret.this[each.value.secret_key].secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = each.value.member
}