-- Remove query parameters from request
local clear_request = string.gsub(ngx.var.request, "?.* ", " ")
ngx.var.original_request = clear_request

local original_method = ngx.var.request_method

-- Rewrite the query parameters to body for the post
if original_method == "GET" or original_method == "DELETE" then
  local body = "{"
  local args, err = ngx.req.get_uri_args()
  ngx.var.args = ""

  for key, val in pairs(args) do
    body = body .. '"' .. key .. '": "' .. val .. '" ,'
  end

  if body:sub(-1, -1) == "," then
    body = body:sub(1, -2)
  end

  body = body .. "}"

  ngx.req.read_body()
  ngx.req.set_body_data(body)

  -- Update the http method
  ngx.req.set_method(ngx.HTTP_POST)
elseif original_method == "PUT" then
  -- Update the http method
  ngx.req.set_method(ngx.HTTP_POST)
end
