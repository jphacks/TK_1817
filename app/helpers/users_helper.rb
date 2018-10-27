module UsersHelper
  # ログインする
  def login_as(user)
    setcookie(:currentuserid, user.id)
  end

  # ログアウトする
  def logout
    deletecookie(:currentuserid)
  end

  # ログインしているか否かを取得する
  def logged_in?
    current_user_id.present?
  end

  # カレントユーザーのTwitter IDを取得する
  def current_user_id
    getcookie(:currentuserid)
  end

  # カレントユーザーを取得する
  def current_user
    return nil unless logged_in?
    @current_user ||= User.find(current_user_id)
  end
end
