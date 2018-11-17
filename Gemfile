source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?('/')
  "https://github.com/#{repo_name}.git"
end

# Basic set
gem 'bootsnap'
gem 'coffee-rails'
gem 'jbuilder'
gem 'listen'
gem 'mini_magick'
gem 'puma'
gem 'rails'
gem 'sass-rails'
gem 'slim'
gem 'mini_racer'
gem 'turbolinks'
gem 'uglifier'

# jQuery and bootstrap
gem 'bootstrap'
gem 'bootstrap-will_paginate'
gem 'jquery-jcanvas-rails', git: "https://github.com/danielRomero/jquery-jcanvas-rails.git"
gem 'jquery-rails'
gem 'jquery-ui-rails'
gem 'will_paginate'

# Twitter連携
gem 'omniauth'
gem 'omniauth-twitter'
gem 'twitter'

# Spotify連携
gem 'rspotify'

# font-awesome
gem 'font-awesome-rails'

# 論理削除を実装するparanoia
gem 'paranoia'

# webpush notification
gem 'serviceworker-rails'
gem 'webpush'

# Security(Encryption)
gem 'rbnacl', '~>5.0'

# Resque(ActiveJob)
gem 'resque'
gem 'resque-scheduler'

# .env
gem 'dotenv-rails'

# vulnerability
gem 'loofah', '>= 2.2.3'

group :development, :test do
  gem 'byebug', platforms: %i[mri mingw x64_mingw]
  gem 'capybara'
  gem 'selenium-webdriver'

  # Use sqlite on dev mode
  gem 'sqlite3'

  # Relationship diagrams
  gem 'rails-erd'
end

group :development do
  gem 'spring'
  gem 'spring-watcher-listen'
  gem 'web-console'

  # code refactoring
  gem 'rubocop'
  gem 'scss-lint'
end

group :test do
  gem 'rails-controller-testing'
end

group :production do
  # Use postgresql on production mode
  gem 'pg'
end

# Below gem is only for Windows
# gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]
