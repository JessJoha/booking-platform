require 'sinatra'
require_relative './config/environment'
require_relative './routes/users_routes'

get '/' do
  'findUserService is running'
end
