require 'sinatra'


class App < Sinatra::Base
  set :listings, File.open('./listings.json').read

  get '/listings' do
    settings.listings
  end
end
