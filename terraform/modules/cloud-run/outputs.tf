output "service_name" {
  value = google_cloud_run_v2_service.api.name
}

output "service_uri" {
  value = google_cloud_run_v2_service.api.uri
}

output "latest_ready_revision" {
  value = google_cloud_run_v2_service.api.latest_ready_revision
}

output "traffic_urls" {
  description = "Map of traffic tag (\"canary\", \"stable\", or \"live\") -> its own dedicated URL, for hitting a specific revision directly regardless of the weighted split."
  value = {
    for t in google_cloud_run_v2_service.api.traffic_statuses :
    t.tag => t.uri
    if t.tag != ""
  }
}