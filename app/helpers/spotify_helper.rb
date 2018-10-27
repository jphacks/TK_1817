module SpotifyHelper
  def spotify_authenticate
    # Spotify APIのセットアップ
    RSpotify.authenticate(Rails.application.credentials.spotify[:id], Rails.application.credentials.spotify[:secret])
  end

  def spotifyuser_to_json sdata
    JSON.generate({
      display_name: sdata.display_name,
      email: sdata.email,
      followers: {
        href: sdata.followers.href,
        total: sdata.followers.total
      },
      href: sdata.href,
      id: sdata.id,
      type: sdata.type,
      uri: sdata.uri,
      credentials: {
        expires: sdata.credentials.expires,
        refresh_token: sdata.credentials.refresh_token,
        token: sdata.credentials.token
      }
    })
  end

  def json_to_spotifyuser json
    hash = JSON.parse(json)

    followers = OmniAuth::AuthHash.new()
    followers.href = hash['followers']['href']
    followers.total = hash['followers']['total']
    hash[:followers] = followers

    credentials = OmniAuth::AuthHash.new()
    credentials.expires = hash['credentials']['expires']
    credentials.refresh_token = hash['credentials']['refresh_token']
    credentials.token = hash['credentials']['token']
    hash[:credentials] = credentials

    sdata = RSpotify::User.new(hash)

    sdata
  end

  def spotify_user user
    json_to_spotifyuser(user.spotifydata)
  end
end