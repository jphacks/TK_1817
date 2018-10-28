ook_controller.rbRuby

class WebhookController < ApplicationController
  
  protect_from_forgery :except => [:callback]

require 'line/bot'
require 'net/http'

def client
       client = Line::Bot::Client.new { |config|
 config.channel_secret = 'XXXXXXXXXXXXXXXXXXXXXXXXXX'
 config.channel_token = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
 }
end



def callback

  body = request.body.read

  signature = request.env['HTTP_X_LINE_SIGNATURE']

  event = params["events"][0]
  event_type = event["type"]

  #送られたテキストメッセージをinput_textに取得
  input_text = event["message"]["text"]

  events = client.parse_events_from(body)

  events.each { |event|

    case event
      when Line::Bot::Event::Message
        case event.type
          #テキストメッセージが送られた場合、そのままおうむ返しする
          when Line::Bot::Event::MessageType::Text
             message = {
                  type: 'text',
                  text: input_text
                  }

          #画像が送られた場合、適当な画像を送り返す
          #画像を返すには、画像が保存されたURLを指定する。
          #なお、おうむ返しするには、１度AWSなど外部に保存する必要がある。ここでは割愛する
          when Line::Bot::Event::MessageType::Image
            image_url = "https://XXXXXXXXXX/XXX.jpg"  #httpsであること
              message = {
                  type: "image",
                  originalContentUrl: image_url,
                  previewImageUrl: image_url
                  }
         end #event.type
         #メッセージを返す
         client.reply_message(event['replyToken'],message)
    end #event
 } #events.each

end  #def


end
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
class WebhookController < ApplicationController
  
  protect_from_forgery :except => [:callback]
 
require 'line/bot'
require 'net/http'
 
def client
       client = Line::Bot::Client.new { |config|
 config.channel_secret = 'XXXXXXXXXXXXXXXXXXXXXXXXXX'
 config.channel_token = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
 }
end
 
 
 
def callback
 
  body = request.body.read
 
  signature = request.env['HTTP_X_LINE_SIGNATURE']
 
  event = params["events"][0]
  event_type = event["type"]
 
  #送られたテキストメッセージをinput_textに取得
  input_text = event["message"]["text"]
 
  events = client.parse_events_from(body)
 
  events.each { |event|
 
    case event
      when Line::Bot::Event::Message
        case event.type
          #テキストメッセージが送られた場合、そのままおうむ返しする
          when Line::Bot::Event::MessageType::Text
             message = {
                  type: 'text',
                  text: input_text
                  }
 
          #画像が送られた場合、適当な画像を送り返す
          #画像を返すには、画像が保存されたURLを指定する。
          #なお、おうむ返しするには、１度AWSなど外部に保存する必要がある。ここでは割愛する
          when Line::Bot::Event::MessageType::Image
            image_url = "https://XXXXXXXXXX/XXX.jpg"  #httpsであること
              message = {
                  type: "image",
                  originalContentUrl: image_url,
                  previewImageUrl: image_url
                  }
         end #event.type
         #メッセージを返す
         client.reply_message(event['replyToken'],message)
    end #event
 } #events.each
 
end  #def
 
 
end
