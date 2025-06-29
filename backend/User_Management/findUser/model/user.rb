require 'sinatra/activerecord'

class User < ActiveRecord::Base
  self.table_name = 'users'
end
