class UsersController < ApplicationController
  def spotify
    authdata = RSpotify::User.new(request.env['omniauth.auth'])

    # Find logged in user
    @user = User.find_by(email: authdata.email)
    # If no user found, create new user
    @user = User.create(
      name: authdata.display_name,
      email: authdata.email,
      spotifydata: spotifyuser_to_json(authdata)
    )

    # !!!NOTICE!!! User's "spotifydata" is raw hash data.
    # This is not safe for public use. Be sure to encrypt it in future.

    login_as @user

    redirect_to root_path
  end

  def home
    unless logged_in?
      render 'static_pages/home'
      return
    end

    @playlists = spotify_user(current_user).playlists
  end

  def logout
    logout_user
    redirect_to root_path
  end

  def play
    current_user.end = params['end_']
    current_user.save!

    spotify_authenticate
    playlist_id = params['playlist_id']
    playlist_user = 'aaa'

    pl = RSpotify::Playlist.find(playlist_user, playlist_id)
    tracks = pl.tracks
    
    bpms = tracks.map.with_index do |track, index|
      {
        order: index,
        tempo: track.audio_features.tempo
      }
    end

    # 残り時間(秒)
    limittime = Time.parse(params['time']) - Time.now

    # 求められる早さ(m/s)
    speed = params['distance'].to_i / limittime

    # 歩幅(m)
    steplength = 0.7

    # bpm
    desired_tempo = speed / steplength * 60

    bpms.each do |b|
      b[:diff] = (b[:tempo] - desired_tempo).abs
    end

    selected_music = bpms.min_by do |b|
      b[:diff]
    end

    player = RSpotify::Player.new(spotify_user(current_user))
    params = {
      "context_uri": pl.uri,
      "offset": {
        "position": selected_music[:order]
      },
      "position_ms": 0
    }
    
    # No player failsafe
    device = spotify_user(current_user).devices.first
    if device.nil?
      flash[:warning] = "Spotify プレイヤーが見つかりませんでした。アプリを起動してください。"
      redirect_to root_path
      return
    end

    player.play(
      device.id, 
      params
    )

    redirect_to player_path(bpm: selected_music[:tempo])
  end

  def stop
    RSpotify::Player.new(spotify_user(current_user)).pause
    redirect_to root_path
  end
end
