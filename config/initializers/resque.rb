Resque.redis = Redis.new(host: 'localhost', post: 6379)
Resque.after_fork = Proc.new { ActiveRecord::Base.establish_connection }