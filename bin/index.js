#! /usr/bin/env node
import { program } from "commander";
import conf from "conf";
import ccxt from "ccxt";
import chalk from "chalk";
import WebSocket from "ws";
import fetch from "node-fetch";
import { Configuration, OpenAIApi } from "openai";
import getRecentTweet from "./twitterApi.js";
import ftxCoins from "./ftxCoins.js";
const config = new conf({ projectName: "alphafish" });
program.version('1.0.0');
const apiKey = config.get('apiKey');
const secretKey = config.get('secretKey');
const ftx = new ccxt.ftx({ apiKey: `${apiKey}`, secret: `${secretKey}` });
const ws = new WebSocket('wss://ftx.com/ws/');
const openAiApiKey = config.get('openAiApiKey');
const configuration = new Configuration({
    apiKey: openAiApiKey,
});
const openai = new OpenAIApi(configuration);
// //set api & secret keys command
program.command("keys <apiKey> <secretKey>")
    .summary('Store api & secret keys in your local storage.')
    .description('Replace apiKey with your real apiKey value and secretKey with your real secretKey value.')
    .action(async (apiKey, secretKey) => {
    try {
        config.set("apiKey", apiKey);
        config.set("secretKey", secretKey);
        await ftx.fetchMyTrades('BTC/USDT');
        console.log(chalk.green(`Authenticated successfully.`));
        process.exit(0);
    }
    catch (error) {
        console.log(chalk.red(`Please enter valid keys.`));
    }
});
// //market buy coins
program.command("buy <quantity> <coinName>")
    .summary('Market buy coins.')
    .description('Command is buy quantity coinName. Replace coinName and quantity with real value. E.x. buy 10 btc')
    .action(async (quantity, coinName) => {
    try {
        let formatCoinName = '';
        if (coinName.includes('perp')) {
            formatCoinName = `${coinName.replace("perp", "-PERP")}`;
        }
        else if (coinName.includes('usdt')) {
            formatCoinName = `${coinName.replace("usdt", "/USDT")}`;
        }
        else if (coinName.includes('usd')) {
            formatCoinName = `${coinName.replace("usd", "/USD")}`;
        }
        const response = await ftx.createMarketBuyOrder(formatCoinName.toUpperCase(), quantity);
        console.log(chalk.greenBright(`Successfully bought ${formatCoinName.toUpperCase()}`));
        process.exit(0);
    }
    catch (error) {
        console.log(chalk.redBright(error));
        process.exit(0);
    }
});
//limit buy coins
program.command('limitbuy <coinName> <price> <quantity>')
    .summary('Limit buy coins.')
    .description('Command is limitbuy coinName price quantity. Replace coinName, price and quantity with real value. E.x. limitbuy btc 20000 1000')
    .action(async (coinName, price, quantity) => {
    try {
        let formatCoinName = '';
        if (coinName.includes('perp')) {
            formatCoinName = `${coinName.replace("perp", "-PERP")}`;
        }
        else if (coinName.includes('usdt')) {
            formatCoinName = `${coinName.replace("usdt", "/USDT")}`;
        }
        else if (coinName.includes('usd')) {
            formatCoinName = `${coinName.replace("usd", "/USD")}`;
        }
        const response = await ftx.createLimitBuyOrder(formatCoinName.toUpperCase(), quantity, price);
        console.log(chalk.greenBright(`Successfully placed order for ${formatCoinName.toUpperCase()} at ${price}`));
        process.exit(0);
    }
    catch (error) {
        console.log(chalk.redBright(error));
        process.exit(0);
    }
});
//market sell coins
program.command("sell <quantity> <coinName>")
    .summary('Market sell coins.')
    .description('Command is sell quantity coinName. Replace coinName and quantity with real value. E.x. sell 10 btc')
    .action(async (quantity, coinName) => {
    try {
        let formatCoinName = '';
        if (coinName.includes('perp')) {
            formatCoinName = `${coinName.replace("perp", "-PERP")}`;
        }
        else if (coinName.includes('usdt')) {
            formatCoinName = `${coinName.replace("usdt", "/USDT")}`;
        }
        else if (coinName.includes('usd')) {
            formatCoinName = `${coinName.replace("usd", "/USD")}`;
        }
        const response = await ftx.createMarketSellOrder(formatCoinName.toUpperCase(), quantity);
        console.log(chalk.greenBright(`Successfully sold ${formatCoinName.toUpperCase()}`));
        process.exit(0);
    }
    catch (error) {
        console.log(chalk.redBright(error));
        process.exit(0);
    }
});
//limit sell coins
program.command('limitsell <coinName> <price> <quantity>')
    .summary('Limit sell coins.')
    .description('Command is limitsell coinName price quantity. Replace coinName, price and quantity with real value. E.x. limitsell btc 20000 1000')
    .action(async (coinName, price, quantity) => {
    try {
        let formatCoinName = '';
        if (coinName.includes('perp')) {
            formatCoinName = `${coinName.replace("perp", "-PERP")}`;
        }
        else if (coinName.includes('usdt')) {
            formatCoinName = `${coinName.replace("usdt", "/USDT")}`;
        }
        else if (coinName.includes('usd')) {
            formatCoinName = `${coinName.replace("usd", "/USD")}`;
        }
        const response = await ftx.createLimitSellOrder(formatCoinName.toUpperCase(), quantity, price);
        console.log(chalk.greenBright(`Successfully placed sell order for ${formatCoinName.toUpperCase()} at ${price}`));
        process.exit(0);
    }
    catch (error) {
        console.log(chalk.redBright(error));
        process.exit(0);
    }
});
//constantly check for funding and if condition is true buy or sell coins.
program.command('funding <coinName> <condition> <fundingRate> <side> <quantity>')
    .summary('Buy or sell coins based on funding.')
    .description('constantly check for funding and if condition is true buy or sell coins. E.x funding btcperp greaterthan 0.1 buy 1')
    .action(async (coinName, condition, fundingRate, side, quantity) => {
    try {
        let formatCoinName = '';
        if (coinName.includes('perp')) {
            formatCoinName = `${coinName.replace("perp", "-PERP")}`;
        }
        else if (coinName.includes('usdt')) {
            formatCoinName = `${coinName.replace("usdt", "/USDT")}`;
        }
        else if (coinName.includes('usd')) {
            formatCoinName = `${coinName.replace("usd", "/USD")}`;
        }
        setInterval(async () => {
            const seconds = new Date().getTime() / 1000;
            const response = await (await fetch(`https://ftx.com/api/funding_rates?start_time=${seconds - 16000}&end_time=${seconds}&future=${formatCoinName.toUpperCase()}`)).json();
            const funding = await response.result[0];
            if (condition === "greaterthan") {
                if (funding.rate > fundingRate) {
                    await ftx.createMarketOrder(formatCoinName.toUpperCase(), side, quantity);
                    console.log(chalk.greenBright('Trade executed successfully.'));
                    process.exit(0);
                }
                else {
                    console.log(chalk.redBright(chalk.bold(`${funding.rate} is not greater than ${fundingRate}`)));
                }
            }
            else if (condition === "lessthan") {
                if (funding.rate < fundingRate) {
                    await ftx.createMarketOrder(formatCoinName.toUpperCase(), side, quantity);
                    console.log(chalk.greenBright(('Trade executed successfully.')));
                    process.exit(0);
                }
                else {
                    console.log(chalk.redBright(chalk.bold(`${funding.rate} is not less than ${fundingRate}`)));
                }
            }
        }, 1000);
        // console.log(chalk.greenBright(`Successfully placed sell order for ${formatCoinName.toUpperCase()} at ${price}`));
    }
    catch (error) {
        console.log(chalk.redBright(error));
        process.exit(0);
    }
});
//buy or sell something at certain time
program.command("time <time> <side> <coinName> <quantity>")
    .summary('Buy or sell something at certain time.')
    .description('Command is time side coinName quantity. E.x. time 19:50:00 buy btcperp 1. Enter time when you want the trade to be executed.')
    .action(async (time, side, coinName, quantity) => {
    try {
        let formatCoinName = '';
        if (coinName.includes('perp')) {
            formatCoinName = `${coinName.replace("perp", "-PERP")}`;
        }
        else if (coinName.includes('usdt')) {
            formatCoinName = `${coinName.replace("usdt", "/USDT")}`;
        }
        else if (coinName.includes('usd')) {
            formatCoinName = `${coinName.replace("usd", "/USD")}`;
        }
        const currDate = new Date().toLocaleDateString();
        const executionTime = new Date(`${currDate} ${time}`).getTime() - Date.now();
        setInterval(() => {
            console.log(chalk.redBright(`Not executed yet.`));
        }, 1000);
        setTimeout(async () => {
            const response = await ftx.createMarketOrder(formatCoinName.toUpperCase(), side, quantity);
            console.log(chalk.greenBright(`Trade executed Successfully.`));
            process.exit(0);
        }, executionTime);
    }
    catch (error) {
        console.log(chalk.redBright(error));
        process.exit(0);
    }
});
//check sentiment of tweet and buy
program.command("sentiment <twitterHandle> <side> <quantity>")
    .summary('Buy or sell something at certain time.')
    .description('Command is sentiment twitterHandle side quantity. E.x sentiment zerosumonly buy 10 . Input twitter handle without @. By default it buys if sentiment is positive but you can override it by passing sell. E.x sentiment zerosumonly sell 10')
    .action(async (twitterHandle, side, quantity) => {
    try {
        //     console.log(chalk.redBright(`${twitterHandle} hasn't tweeted yet.`));
        let inverseSide = side;
        if (side === 'sell') {
            inverseSide = 'buy';
        }
        setInterval(async () => {
            const tweet = await getRecentTweet(twitterHandle);
            const coins = [];
            for (let i = 0; i < ftxCoins.length; i++) {
                ftxCoins[i].coinName.map(async (curval) => {
                    if (tweet[0].includes(curval)) {
                        coins.push(ftxCoins[i].formatName);
                    }
                });
            }
            if (coins.length !== 0) {
                const completion = await openai.createCompletion({
                    model: "text-davinci-002",
                    prompt: `Analyze the sentiment of the given text. ${tweet[1]}. Output can only be positive,negative or neutral.`,
                    max_tokens: 4
                });
                //  console.log(completion.data.choices[0].text,coins,tweet[1]);
                for (let i = 0; i < coins.length; i++) {
                    // console.log(coins[i]);
                    const sentiment = completion.data.choices[0].text?.replace('\n\n', "");
                    if (i === coins.length - 1) {
                        process.exit(0);
                    }
                    if (sentiment === "positive") {
                        const response = await ftx.createMarketOrder(coins[i], side, quantity);
                        console.log(chalk.greenBright(`${twitterHandle} tweeted : ${tweet[1]}. Sentiment ${sentiment}. ${side} ${quantity} ${coins[i]}`));
                        //console.log(response);
                    }
                    else if (sentiment === "negative") {
                        const response = await ftx.createMarketOrder(coins[i], inverseSide, quantity);
                        console.log(chalk.greenBright(`${twitterHandle} tweeted : ${tweet[1]}. Sentiment ${sentiment}. ${side} ${quantity} ${coins[i]}`));
                        // console.log(response);
                    }
                    else {
                        console.log(chalk.redBright(`${twitterHandle} tweeted : ${tweet[1]}. Sentiment ${sentiment}.`));
                    }
                }
            }
        }, 1000);
    }
    catch (error) {
        console.log(chalk.redBright(error));
        process.exit(0);
    }
});
program.parse(process.argv);
