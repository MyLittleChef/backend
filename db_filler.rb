require "uri"
require "net/http"
require 'byebug'
require 'json'
require 'cgi'
require "uri"
require "net/http"
require 'yaml'

def get_recipes(url:)
  https = Net::HTTP.new(url.host, url.port);
  https.use_ssl = true

  request = Net::HTTP::Get.new(url)
  request[""] = ""
  request["Cookie"] = "__cfduid=dda66b8c926a8d426f391c05243f6bb031604771552"

  response = https.request(request)
  raise 'recipe not found' if response.kind_of? Net::HTTPNotFound
  raise "api_key used" if response.kind_of? Net::HTTPPaymentRequired
  response.read_body
end

def post_request(url:, request_body:)
  url = URI(url)

  http = Net::HTTP.new(url.host, url.port);
  request = Net::HTTP::Post.new(url)
  request["Content-Type"] = "application/x-www-form-urlencoded"
  request.body = request_body
  response = http.request(request)
  response.read_body
end

def post_recipes(url:, recipes:)
  JSON(recipes)['recipes'].each do |recipe|
    recipe_hash = Hash.new
    recipe_hash['title'] = recipe['title']
    recipe_hash['externalId'] = recipe['id']
    recipe_hash['readyInMinutes'] = recipe['readyInMinutes']
    recipe_hash['servings'] = recipe['servings']
    recipe_hash['category'] = recipe['cuisines']
    recipe_hash['dishTypes'] = recipe['dishTypes']
    recipe_hash['instructions'] = ''
    recipe_hash['materialNeeded'] = []
    recipe['analyzedInstructions']&.each do |analyzedInstruction|
      analyzedInstruction&.dig('steps')&.each do |step|
        recipe_hash['instructions'] << "#{step['number']} #{step['step']}\n"
        step.dig('equipment')&.each do |equipment|
          recipe_hash['materialNeeded'] << equipment.dig('localizedName')
        end
      end
    end

    recipe_hash['ingredients'] = []
    recipe['extendedIngredients']&.each do |ingredient|
      ingredient_hash = Hash.new
      ingredient_hash['nom'] = ingredient['name']
      ingredient_hash['uniteMesure'] = ingredient['unit']
      request_body = URI.encode_www_form(ingredient_hash)
      posted_ingredient = post_request(url: "#{url}/ingredients", request_body: request_body)
      recipe_hash['ingredients'] << JSON(posted_ingredient)['id']
    end
    recipe_hash['diets'] = recipe['diets']
    recipe_hash['photopath'] = recipe['image']
    request_body = URI.encode_www_form(recipe_hash)
    post_request(url: "#{url}/recettes", request_body: request_body)
  end
end

def post_recipe(url:, recipe:)
  recipe = JSON.parse(recipe)
  recipe_hash = Hash.new
  recipe_hash['title'] = recipe['title']
  recipe_hash['externalId'] = recipe['id']
  recipe_hash['readyInMinutes'] = recipe['readyInMinutes']
  recipe_hash['servings'] = recipe['servings']
  recipe_hash['category'] = recipe['cuisines']
  recipe_hash['dishTypes'] = recipe['dishTypes']
  recipe_hash['instructions'] = ''
  recipe_hash['materialNeeded'] = []
  recipe['analyzedInstructions']&.each do |analyzedInstruction|
    analyzedInstruction&.dig('steps')&.each do |step|
      recipe_hash['instructions'] << "#{step['number']} #{step['step']}\n"
      step.dig('equipment')&.each do |equipment|
        recipe_hash['materialNeeded'] << equipment.dig('localizedName')
      end
      recipe_hash['materialNeeded'].uniq!
    end
  end

  recipe_hash['ingredients'] = []
  recipe['extendedIngredients']&.each do |ingredient|
    ingredient_hash = Hash.new
    ingredient_hash['nom'] = ingredient['name']
    ingredient_hash['uniteMesure'] = ingredient['unit']
    request_body = URI.encode_www_form(ingredient_hash)
    posted_ingredient = post_request(url: "#{url}/ingredients", request_body: request_body)
    recipe_hash['ingredients'] << JSON(posted_ingredient)['id']
  end
  recipe_hash['ingredients'].uniq!
  recipe_hash['diets'] = recipe['diets']
  recipe_hash['photopath'] = recipe['image']
  request_body = URI.encode_www_form(recipe_hash)
  post_request(url: "#{url}/recettes", request_body: request_body)
end


config = YAML.load_file('db_filler.yml')
spoonacular_api_keys = config['spoonacular_api_keys']
externalId_start = config['externalId_start']
index = config['index_start']
spoonacular_api_keys.each do |spoonacular_api_key|
  puts "current api key : #{spoonacular_api_key}"
  begin
    loop do
      spoonacular_url = URI("https://api.spoonacular.com/recipes/#{index}/information?apiKey=#{spoonacular_api_key}")
      index+=1
      begin
        recipe = get_recipes(url: spoonacular_url)
      rescue StandardError => e
        puts e.inspect
        if e.message == 'recipe not found'
          next
        else
          raise
        end
      end
      myLittleChef_server_IP = config['myLittleChef_server_IP']
      post_recipe(url: myLittleChef_server_IP, recipe: recipe)
    end
  rescue StandardError => e
    puts e.inspect
    next if e.message == 'api_key used'
  end
end
