const setTitle = require('node-bash-title');
setTitle("Converted 0 players");
const yaml = require('js-yaml');
const fs = require('fs');
const http = require('http');
const request = require('request');
console.log('Getting data from vanilla whitelist file');
var vanillaWhitelist = require('./whitelist.json');;
var yamlDataJSON = {
    whitelist: [

    ],
    'enabled': true
};
var i = 0;
var i2 = 0;
if(parseInt(vanillaWhitelist.length) == 1){
    console.log("Getting data of " + vanillaWhitelist.length + " player...");
} else {
    console.log("Getting data of " + vanillaWhitelist.length + " players...");
}
vanillaWhitelist.forEach(player => {
    //console.log("Getting data about " + vanillaWhitelist.length + " players...");
    var playerData;
    request({ url: "http://playerdb.co/api/player/minecraft/" + player.uuid }, function (err, response, body) {
        //console.log("Wating 10 seconds")
        setTimeout(function(body2){
            var undefinederr = "" + body2
            if (undefinederr.includes("undefined")) {
                //i2++
                console.log("Getting old data of " + player.name);
                yamlDataJSON.whitelist.push(player.name.toLowerCase());
                let yamlStr = yaml.safeDump(yamlDataJSON);
                fs.writeFileSync('config.yml', yamlStr, 'utf8');
                i++
                setTitle('Converted ' + i + " players");
            } else {
                playerData = JSON.parse(undefinederr);
                //console.log(playerData.message);
                if (playerData.message === 'Mojang API lookup failed.') {
                    return;
                } else {
                    try {
                        yamlDataJSON.whitelist.push(playerData.data.player.username.toLowerCase());
                        //console.log(yamlDataJSON);
                        let yamlStr = yaml.safeDump(yamlDataJSON);
                        fs.writeFileSync('config.yml', yamlStr, 'utf8');
                        i++;
                        setTitle('Converted ' + i + " players");
                    } catch (err) {
                        setTitle('Error! (player №' + i + ')');
                        console.log(playerData);
                        console.log(err);
                    }
                }
            }
        }, 10000, body);
        

    })
    //console.log(player);
});