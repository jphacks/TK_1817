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

  def twitter_login
    # auth情報を取り出しログイン
    auth = request.env['omniauth.auth']

    # Find logged in user
    @user = User.find_by(twitter_uid: auth.uid)
    # If no user found, create new user
    @user ||= User.create(
      name: auth[:info][:nickname],
      twitter_uid: auth.uid
    )

    login_as @user

    redirect_to root_path
  end

  def home
    render 'static_pages/home' unless logged_in?
  end

  def player;end

  def player_v2;end

  def logout
    logout_user
    redirect_to root_path
  end

  def play
    current_user.end = params['end_']
    current_user.time = params['time']
    current_user.recent_playlist = params['playlist_id']

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

    if current_user.recent_played_id
      bpms.reject!{|b| b[:order] == current_user.recent_played_id}
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

    current_user.recent_played_id = selected_music[:order]
    current_user.save!

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

  def play_v2
    @user = current_user
    @user.walked_distance = @user.walked_distance * 0.9 + params[:recent_dist].to_f
    @user.walked_steps = @user.walked_steps * 0.9 + params[:recent_steps].to_f

    # 求められる早さ(m/s)
    speed = params['remain_dist'].to_f / (params[:limit_time].to_f / 1000)

    # 歩幅(m)
    if @user.walked_steps != 0
      steplength = @user.walked_distance / @user.walked_steps
      # はずれ値切り
      steplength = [[steplength, 0.6].max, 0.9].min
    else
      steplength = 0.7
    end

    # bpm
    desired_tempo = speed / steplength * 60

    musics = Music.all.reject { |m| m.id == @user.recent_played_id }
    selected_music = musics.min_by do |m|
      (desired_tempo - m.bpm).abs
    end

    @user.recent_played_id = selected_music.id

    @user.save!

    render json: {
      'music_src': selected_music.filename,
      'music_name': selected_music.name,
      'tempo': selected_music.bpm
    }
  end

  def stop
    RSpotify::Player.new(spotify_user(current_user)).pause
    redirect_to root_path
  end
end
