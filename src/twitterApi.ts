import fetch from "node-fetch";
import conf from "conf"

const config = new conf({projectName : "alphafish"});


const getRecentTweet = async(twitterHandle : string) => {

    try {
        const bearerToken = config.get('twitterBearerToken');
    
        const response = await fetch(`https://api.twitter.com/2/users/by/username/${twitterHandle}`, {
            method: 'get',
            // body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json',"Authorization" : `Bearer ${bearerToken}`}
        });
        const data : any = await response.json();
        const tweetId = data.data.id;
        
        const response1 = await fetch(`https://api.twitter.com/2/users/${tweetId}/tweets?exclude=replies`, {
            method: 'get',
           // body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json',"Authorization" : `Bearer ${bearerToken}`}
        });
        const tweets : any = await response1.json()
        const noSpecialCharacters = tweets.data[0].text.replace(/[^a-zA-Z0-9 ]/g, '');
        const lowerCase = noSpecialCharacters.toLowerCase();
    
        return [lowerCase,tweets.data[0].text];

    } catch (error) {
        throw error;
    }


}

export default getRecentTweet;