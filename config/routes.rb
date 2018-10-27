Rails.application.routes.draw do
  # トップページ
  root 'users#home'

  get '/search', to: 'static_pages#search'

  # User controller
  get '/status', to: 'users#status'
  get '/logout', to: 'users#logout'
  post '/play', to: 'users#play'

  # Spotify API callback
  get '/auth/spotify/callback', to: 'users#spotify'

  # 固定ページ
  get '/help', to: 'static_pages#help'
end
