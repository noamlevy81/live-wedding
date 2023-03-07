output "base_url" {
  value = aws_api_gateway_deployment.apideploy.invoke_url
}

output "edge_device_access_key_id" {
  value = aws_iam_access_key.edge_device_access_key.id
}


output "edge_device_secret_access_key" {
  value = aws_iam_access_key.edge_device_access_key.secret
  sensitive = true
}

output "website_domain" {
  value = module.static_web_hosting.website_domain
}