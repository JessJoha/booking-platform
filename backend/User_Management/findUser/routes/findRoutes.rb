require 'sinatra'
require 'json'
require_relative '../model/user'

get '/user/:id' do
  content_type :json
  user = User.find_by(id: params[:id])
  if user
    user.to_json(only: [:id, :username, :email, :role])
  else
    status 404
    { error: 'User not found' }.to_json
  end
end

get '/username/:name' do
  content_type :json
  users = User.where("username LIKE ?", "%#{params[:name]}%")
  users.to_json(only: [:id, :username, :email, :role])
end
