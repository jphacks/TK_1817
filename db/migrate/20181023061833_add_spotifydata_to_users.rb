class AddSpotifydataToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :spotifydata, :string
    add_column :users, :email, :string
  end
end
