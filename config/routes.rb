Rails.application.routes.draw do
  # トップページ
  root 'users#home'

  get '/search', to: 'static_pages#search'

  # User controller
  get '/status', to: 'users#status'
  get '/logout', to: 'users#logout'
  post '/play', to: 'users#play'
  get '/play_v2', to: 'users#play_v2'
  get '/stop', to: 'users#stop'
  get '/player', to: 'users#player'
  get '/player_v2', to: 'users#player_v2'

  # Spotify API callback
  get '/auth/spotify/callback', to: 'users#spotify'
  # Twitter API callback
  get '/auth/twitter/callback', to: 'users#twitter_login'

  # 固定ページ
  get '/help', to: 'static_pages#help'
end
