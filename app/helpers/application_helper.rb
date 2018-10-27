module ApplicationHelper
  # RbNaClを使用して対象鍵暗号を施す
  require 'rbnacl'
  require 'uri'

  # 暗号化
  def encrypt_data(data, password, salt)
    key = RbNaCl::Hash.sha256(password)[0..31]
    nonce = RbNaCl::Hash.sha256(salt)[0..23]
    secret_box = RbNaCl::SecretBox.new(key)
    secret_box.encrypt(nonce, data)
  end

  # 復号化
  def decrypt_data(cipherdata, password, salt)
    key = RbNaCl::Hash.sha256(password)[0..31]
    nonce = RbNaCl::Hash.sha256(salt)[0..23]
    secret_box = RbNaCl::SecretBox.new(key)
    data = secret_box.decrypt(nonce, cipherdata)
    # このままだとASCII-8bit形式なので、日本語用にUTF-8に変更
    data.to_s.force_encoding('utf-8')
  end

  # cookie取得
  def getcookie(tag)
    cookies.signed[tag]
  end

  # cookie保存
  def setcookie(tag, value)
    cookies.permanent.signed[tag] = value
  end

  # cookie削除
  def deletecookie(tag)
    cookies.delete(tag)
  end

  # リダイレクト先を保存しておく
  def store_location
    session[:forwarding_url] = request.original_url if request.get?
  end

  # 記憶したリダイレクト先に戻る
  def redirect_back_or(default)
    # Redirect to session[:forwarding_url], or default if nil
    redirect_to(session[:forwarding_url] || default)
    session.delete(:forwarding_url)
  end

  # テストなどのためにランダム文章を生成する
  def random_sentence
    rand = Random.new
    "I am #{rand(1..10000000)}! Nice to meet you!!"
  end
end
