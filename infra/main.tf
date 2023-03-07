provider "aws" {
  region  = "eu-west-1"
  profile = "noam_private"
}

locals {
  domain = "or-and-noam-wedding"
}

resource "aws_s3_bucket" "images_bucket" {
  bucket = "${local.domain}-bucket"

  acl  = "public-read-write"
  tags = {
    Name = "images-bucket"
  }
}
module "presign_url_lambda" {
  source = "./lambda"

  lambda_name    = "presigned_url_lambda"
  lambda_handler = "lambda.handler"
  lambda_role    = aws_iam_role.lambda_exec_role.arn
}

resource "aws_iam_role" "lambda_exec_role" {
  name               = "lambda-assume-role"
  description        = "Allows Lambda Function to call AWS services on your behalf."
  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
POLICY

}

resource "aws_iam_role_policy" "lambda_s3_permission" {
  role   = aws_iam_role.lambda_exec_role.id
  policy = <<EOF
{
"Version": "2012-10-17",
    "Statement": [
        {
        "Effect": "Allow",
        "Action": "s3:*",
        "Resource": "*"
        }
    ]
}
EOF
}

resource "aws_iam_user" "edge_device_user" {
  name = "edge_device_user"
}

resource "aws_iam_access_key" "edge_device_access_key" {
  user = aws_iam_user.edge_device_user.name
}

resource "aws_iam_user_policy" "s3_read_policy" {
  name = "test"
  user = aws_iam_user.edge_device_user.name

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "S3ReadAccess",
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::${aws_s3_bucket.images_bucket.bucket}/images/*",
                "arn:aws:s3:::your-bucket-name"
            ]
        }
    ]
}

EOF
}


resource "aws_api_gateway_rest_api" "apiLambda" {
  name        = "myAPI"
}



resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.apiLambda.id
  parent_id   = aws_api_gateway_rest_api.apiLambda.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxyMethod" {
  rest_api_id   = aws_api_gateway_rest_api.apiLambda.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id = aws_api_gateway_rest_api.apiLambda.id
  resource_id = aws_api_gateway_method.proxyMethod.resource_id
  http_method = aws_api_gateway_method.proxyMethod.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.presign_url_lambda.invoke_arn
}




resource "aws_api_gateway_method" "proxy_root" {
  rest_api_id   = aws_api_gateway_rest_api.apiLambda.id
  resource_id   = aws_api_gateway_rest_api.apiLambda.root_resource_id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_root" {
  rest_api_id = aws_api_gateway_rest_api.apiLambda.id
  resource_id = aws_api_gateway_method.proxy_root.resource_id
  http_method = aws_api_gateway_method.proxy_root.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.presign_url_lambda.invoke_arn
}


resource "aws_api_gateway_deployment" "apideploy" {
  depends_on = [
    aws_api_gateway_integration.lambda,
    aws_api_gateway_integration.lambda_root,
  ]

  rest_api_id = aws_api_gateway_rest_api.apiLambda.id
  stage_name  = "test"
}


resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${module.presign_url_lambda.name}"
  principal     = "apigateway.amazonaws.com"

  # The "/*/*" portion grants access from any method on any resource
  # within the API Gateway REST API.
  source_arn = "${aws_api_gateway_rest_api.apiLambda.execution_arn}/*/*"
}

module "static_web_hosting" {
  source = "./static_web_hosting"
  domain_name = local.domain
}