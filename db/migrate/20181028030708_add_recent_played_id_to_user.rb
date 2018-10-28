class AddRecentPlayedIdToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :recent_played_id, :integer
  end
end
