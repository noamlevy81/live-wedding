output "invoke_arn" {
  value = aws_lambda_function.lambda.invoke_arn
}

output "name" {
  value = aws_lambda_function.lambda.function_name
}