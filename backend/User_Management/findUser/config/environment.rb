require 'sinatra/activerecord'
require 'dotenv/load'

set :database, {
  adapter:  ENV['DB_ADAPTER'],
  host:     ENV['DB_HOST'],
  username: ENV['DB_USERNAME'],
  password: ENV['DB_PASSWORD'],
  database: ENV['DB_NAME'],
  port:     ENV['DB_PORT']
}
