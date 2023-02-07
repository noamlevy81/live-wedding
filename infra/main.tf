provider "aws" {
  region  = "eu-west-1"
  profile = "noam_private"
}

resource "aws_s3_bucket" "images_bucket" {
  bucket = "or-and-noam-wedding-bucket"

  acl  = "public-read-write"
  tags = {
    Name = "images-bucket"
  }
}