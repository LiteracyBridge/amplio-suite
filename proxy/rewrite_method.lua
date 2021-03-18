local cjson = require "cjson"
local shell = require "resty.shell"
local httpc = require("resty.http").new()

function split(str, delimiter)
  local words = {}
  for w in str:gmatch(delimiter) do
    table.insert(words, w)
  end

  return unpack(words)
end

-- Remove query parameters from request
local clear_request = string.gsub(ngx.var.request, "?.* ", " ")
ngx.var.original_request = clear_request
local original_method = ngx.var.request_method

-- Rewrite the query parameters to body for the post
local body = ""
if original_method == "GET" or original_method == "DELETE" then
  local args, err = ngx.req.get_uri_args()
  body = body .. '{"queryStringParameters": {'

  for key, val in pairs(args) do
    body = body .. '"' .. key .. '": "' .. val .. '" ,'
  end

  if body:sub(-1, -1) == "," then
    body = body:sub(1, -2)
  end

  body = body .. "}}"
elseif original_method == "POST" or original_method == "PUT" then
  ngx.req.read_body()
  body = ngx.req.get_body_data()
end

-- Use "local DNS" resolver
local ok, line, stderr, reason, status =
  shell.run({'grep', ngx.var.lambda, '/etc/nginx/resolver'}, stdin)

local lambda_name, ip, cmd = split(line, "%S+")
local _, __, handler = split(cmd, ".")

-- Post to lambda
local url = "http://" .. ip .. ":9001/2015-03-31/functions/" .. handler .. "/invocations"
local res, err = httpc:request_uri(url, {
    method = "POST",
    body = body,
})

-- Build response
ngx.status = ngx.HTTP_OK
ngx.header.content_type = "application/json; charset=utf-8"
ngx.header["Access-Control-Allow-Origin"] = "*"

if (res.body) then
  local response = cjson.decode(res.body)
  ngx.status = response["statusCode"]
  ngx.say(response["body"])
end

return ngx.exit(ngx.HTTP_OK)
