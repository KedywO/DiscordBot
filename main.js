const Discord = require('discord.js');
const client = new Discord.Client();
var qBase = null;
var isInit = false;
const baseId = '798876991708725268';

client.on('ready', ()=>{
    console.log("Bot online")
})

//Command for initializing base for questions
client.on('message', (message) =>{
    if(message.content.startsWith('!init') && message.channel.id != baseId && message.author.id=='339812619575754752'){
        qBase = new Set();
        message.channel.send("Baza zainicjonowana!")
        message.client.channels.cache.get(baseId).send(`Baza danych: ${message.content.slice(5)}`);
        isInit = true;
    }
})

// Commmand which moves user between channels (imitation of TS3 poke mechanism)
client.on("message" , (msg) => {
    if(msg.content.startsWith("!miotaj") && (msg.author.id == "339812619575754752" || msg.author.id == "353633704675115012")){
        let member = msg.mentions.members.first();
        msg.delete();
        miotaj(member);
    }
})

const miotaj = async (member) =>{
    for(let i = 0 ; i<5 ; i++) {
        member.voice.setChannel('690937131257954315');
        await sleep(700);
        member.voice.setChannel('690937825440301106');
        await sleep(700);
    }
}


// Kick user
client.on("message" , (msg) => {
    if(msg.content.startsWith("!kick") && (msg.author.id == "339812619575754752" || msg.author.id == "353633704675115012")){
        let member = msg.mentions.members.first();
        member.kick("Bo ta");
        msg.delete();
    }
})

// Deaf user
client.on("message" , (msg) => {
    if(msg.content.startsWith("!deaf") && (msg.author.id == "339812619575754752" || msg.author.id == "353633704675115012")){
        let member = msg.mentions.members.first();
        member.voice.setDeaf(!member.voice.deaf);
        msg.delete();
    }
})

//Ban user
client.on("message" , (msg) => {
    if(msg.content.startsWith("!ban") && msg.author.id == "339812619575754752"){
        let member = msg.mentions.members.first();
        member.ban();
        msg.delete();
    }
})


// Command for signing question
client.on('message', (message) =>{
    if(message.content.startsWith('!q') && message.channel.id != baseId && isInit == true){
        message.delete();
        const noQ = message.content.slice(3);
        var syntax = noQ.split(';');
        const question = syntax[0];
        if(syntax[syntax.length-1] == ''){
            syntax.pop();
        }
        // const [question, odp1,odp2,odp3] = noQ.split(',');
        if(message.content[2] == ' '){

            if(qBase.size == 0){
                qBase.add(question);
                message.client.channels.cache.get(baseId).send(`---------------------------\n${question.toUpperCase()}\n---------------------------`);
                for(let i=1;i<syntax.length;i++){
                    console.log(syntax[i], "odp");
                    message.client.channels.cache.get(baseId).send(`${i}. ${syntax[i]}`);
                }
            }else{
                if(!isInSet(question)){
                    qBase.add(question);
                    message.client.channels.cache.get(baseId).send(`---------------------------\n${question.toUpperCase()}\n---------------------------`);
                    for(let i=1;i<syntax.length;i++){
                        console.log(syntax[i], "odp");
                        message.client.channels.cache.get(baseId).send(`${i}. ${syntax[i]}`);
                    }
                }
            }
        }
    }
})

// Command for clearing question base
client.on('message', (mess) =>{
    if(mess.content =='!baseclear'){
        async function clear(){
            mess.delete();
            await mess.client.channels.cache.get(baseId).bulkDelete(50,true);
        }
        clear();
    }
})

// CLEANING GIVEN NUMBER OF MSGES WITH "!clear number"
client.on('message', (mess) =>{
    if(mess.content == '!clear'){
        const clear = async ()=>{
            mess.channel.bulkDelete(100,true);
        }
        clear();
    }
})


const isInSet = (question) =>{
    var isInBase = false;
    qBase.forEach(dataQ => {
        if(dataQ.toUpperCase().localeCompare(question.toUpperCase())==0){
            isInBase = true;
        }
    })
    return isInBase;
}



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

client.login("");