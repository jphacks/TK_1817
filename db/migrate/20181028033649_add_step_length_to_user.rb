class AddStepLengthToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :step_length, :float
  end
end
