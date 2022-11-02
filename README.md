# AlphaFish
Cli to trade cryptocurrencies in an unique fashion.
Currenlty only supports ftx.

To install this project on your local computer. 
Clone this repo.
Add your twitter bearer token and openai api keys.
sudo npm install -g .

Now you are ready to use the bot.
Type this in your cmd alpha keys and paste your ftx api and secret key.

Keys are stored locally. So don't worry about being hacked :)



Example of how to use the bot.

Type everything in lowercase.

alpha buy <quantity> <coinName> [market buy coins]
Command is buy quantity coinName. Replace coinName and quantity with real value. E.x. buy 10 btcperp

alpha limitbuy <coinName> <price> <quantity> [Limit buy coins]
Command is limitbuy coinName price quantity. Replace coinName, price and quantity with real value. E.x. limitbuy btcperp 20000 1000

same goes for sell just replace the command from buy to sell.

alpha funding <coinName> <condition> <fundingRate> <side> <quantity> [Buy or sell coins based on funding.]
Constantly checks for funding and if condition is true buy or sell coins. E.x funding btcperp greaterthan 0.1 buy 1
Tip : Use this to buy or sell based on extreme fundings.

alpha time <time> <side> <coinName> <quantity> [Buy or sell something at certain time.]
E.x. time 19:50:00 buy btcperp 1. Enter time when you want the trade to be executed.
Can be super useful when new coin is going to launch.

alpha sentiment <twitterHandle> <side> <quantity> [Analyzes the tweet and executes trades based on that.]
Command is sentiment twitterHandle side quantity. E.x sentiment zerosumonly buy 10 . 
Input twitter handle without @. 
By default it buys if sentiment is positive but you can override it by passing sell. E.x sentiment zerosumonly sell 10
Tip : Use on someone who has huge influence like elon. 

IF THIS BOT HELPS YOU IN ANY WAY CONSIDER USING THIS REFLINK OR DONATING SOME SHEKELS -  https://ftx.com/referrals#a=AlphaFish
0xf3d78666b97f90ec78f5737fbef149160b4f5c8e



MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
