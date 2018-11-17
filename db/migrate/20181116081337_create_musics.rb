class CreateMusics < ActiveRecord::Migration[5.2]
  def change
    create_table :musics do |t|
      t.string :name
      t.float :bpm
      t.string :filename

      t.timestamps
    end
  end
end
