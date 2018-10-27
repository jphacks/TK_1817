Rails.application.routes.draw do
  # トップページ
  root 'static_pages#home'

  get '/search', to: 'static_pages#search'

  # User controller
  get '/status', to: 'users#status'
  get '/jobtest', to: 'users#jobtest'

  # Spotify API callback
  get '/auth/spotify/callback', to: 'users#spotify'

  # 固定ページ
  get '/help', to: 'static_pages#help'
end
