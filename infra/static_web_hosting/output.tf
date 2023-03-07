output "website_domain" {
  value = aws_s3_bucket.website_bucket.website_endpoint
}