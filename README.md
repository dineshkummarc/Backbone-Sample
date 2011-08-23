Simple Gist viewing interface.

Because this leverages an interesting CORS quirk, this works best if served from the example.com domain.

For a simple way to serve files, try this:

    ruby -rwebrick -e 'include WEBrick' -e 'HTTPServer.new(:Port => 8008, :DocumentRoot => ".").tap { |server| trap(:INT) { server.shutdown }; trap(:TERM) { server.shutdown } }.start'
