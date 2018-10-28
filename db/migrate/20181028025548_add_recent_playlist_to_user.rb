class AddRecentPlaylistToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :recent_playlist, :string
  end
end
