require 'rspotify/oauth'

# Spotify API
Rails.application.config.middleware.use OmniAuth::Builder do
  provider :spotify,
           Rails.application.credentials.spotify[:id],
           Rails.application.credentials.spotify[:secret],
           scope: "user-read-email playlist-modify-public user-library-read user-library-modify user-read-currently-playing user-modify-playback-state user-read-recently-played user-read-playback-state streaming"

  provider :twitter,
           Rails.application.credentials.twitter[:key],
           Rails.application.credentials.twitter[:secret]
end
