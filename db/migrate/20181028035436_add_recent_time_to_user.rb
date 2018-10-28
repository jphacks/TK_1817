class AddRecentTimeToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :recent_time, :datetime
  end
end
