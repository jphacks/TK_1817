class AddEndToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :end, :string
  end
end
