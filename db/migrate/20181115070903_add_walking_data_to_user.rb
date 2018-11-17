class AddWalkingDataToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :walked_distance, :float, default: 0
    add_column :users, :walked_steps, :float, default: 0
  end
end
