class AddRecentDistanceToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :recent_distance, :float
  end
end
