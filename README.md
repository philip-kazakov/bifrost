# Bifrost
![logo](http://norse-mythology.org/wp-content/uploads/2012/11/Bifrost.jpg)
# Description

Bifrost cache and queue your POST request when internet is down. It will try to forward your query to the desired endpoint, if it fail it will save the POST data and try to update them periodically.
It will forward the response as it is.

# Installation

`git clone git@github.com:soixantecircuits/bifrost.git && cd bifrost`

`npm install`

### Config
`npm start`

You should see in the log a line with the port and adress where bifrost is running.

`Bifrost started on http://127.0.0.1:3000`

Now you can post directly their and do not worry about the connectivity.

# Docs

You can check the future wiki.

# Dev mode

in /settings/settings.json, set `flag > devMode` to `true` to perform fake requests
