class JobTestJob < ApplicationJob
  queue_as :default

  def perform(*args)
    p 'JOB TEST!!!'
  end
end
