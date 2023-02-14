locals {
  archive_file_name = "${var.lambda_name}.${var.archive_type}"
  archive_file_path = "./${var.lambda_name}.${var.archive_type}"
}

data "archive_file" "lambda_archive" {
  type             = var.archive_type
  source_file       = "./lambda/lambda.js"
  output_file_mode = "0666"
  output_path      = local.archive_file_path
}

resource "aws_lambda_function" "lambda" {
  filename         = local.archive_file_path
  function_name    = var.lambda_name
  role             = var.lambda_role
  handler          = var.lambda_handler
  source_code_hash = data.archive_file.lambda_archive.output_base64sha256
  runtime          = var.runtime
  timeout          = 900

}

