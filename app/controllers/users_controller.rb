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
end
