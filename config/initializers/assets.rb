# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path.
# Rails.application.config.assets.paths << Emoji.images_path
# Add Yarn node_modules folder to the asset load path.
Rails.application.config.assets.paths << Rails.root.join('node_modules')

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in the app/assets
# folder are already added.
Rails.application.config.assets.precompile += %w(
  style.js
  home.css
  login.css
  player.css
  jquery.ripples.js
  jquery.ripples-min.js
  maps.js
  dropdown_fix.js
  timedropper.js
  timedropper.css
  nextmusic.js
  player.js
  player_v2.js
  player_maps.js
  player_v2_map.js
  getparams.js
  )
