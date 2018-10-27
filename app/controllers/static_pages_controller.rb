class StaticPagesController < ApplicationController
  require 'rspotify'

  def home; end

  def help; end

  def search
    @playlist_id = params[:search][:playlist_id]
    @playlist_user = params[:search][:playlist_user]

    # Authenticate spotify
    spotify_authenticate

    pl = RSpotify::Playlist.find(@playlist_user, @playlist_id)
    @tracks = pl.tracks
  end
end
