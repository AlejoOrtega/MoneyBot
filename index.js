import DiscordJS, { Intents } from 'discord.js'
import dotenv from 'dotenv'

dotenv.config()

let weeklyGains = 0;
const roles = {'737501089301004368':'@everyone',
'737502937642696787':'Führer',
'737506837598961733': 'VIP Pass 🛀🏾',
'870034757998747659': 'DictaBotz',
'911984630209577001': 'Valhalla',
'912004944427622471': 'Hydra',
'939658559879254087': 'Twitch Subscriber',
'939658559879254088': 'Twitch Subscriber: Tier 1',
'939658559879254089': 'Twitch Subscriber: Tier 2',
'939658559879254090': 'Twitch Subscriber: Tier 3',
'939662968281530450': 'MEE6',
'939752952925679646': 'TweetShift',
'940059164951060532': 'Countr',
'940406733413707810': 'Dank Memer',
'944626644335882280': 'AfterLife',
'959477807036104728': 'Money Bot'}

const client = new DiscordJS.Client({
    intents : [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.on('ready', () => {
    console.log('The bot is ready')

    // guild
    const guildId = '737501089301004368'
    const guild = client.guilds.cache.get(guildId)
    let commands
    if (guild){
        commands = guild.commands
    }else{
        commands = client.application?.commands
    }

    commands?.create(
    {
        name: 'addweeklygains',
        description: 'addWeeklyGains',
        options:[
        {
            name: 'numbertoadd',
            description: 'Add number',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        }
        ]
    },
    {
        name: 'ping',
        description: 'Te digo Pong :)',
    }
    )
})

//interaction 
client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand()){
        return
    }

    const {commandName, options} = interaction

    if (commandName === 'ping'){
        interaction.reply({
            content: 'pong',
            ephemeral: false,
        })
    }else if (commandName === 'addweeklygains'){
        const number = options.getNumber('numbertoadd')
        weeklyGains+= number;
        interaction.reply({
            content: `${weeklyGains}`,
            ephemeral: false,
        })
    }
})

//message
client.on('messageCreate', (message) =>{
    let user = message.author.username;
    let roles = getInfo(message)
    switch (message.content){
        case "yo":
            optionYo(user, roles, message)
            break;
        case "ping":
            optionPing(message)
            break;
    }
    
})

const optionYo = (user, roles, message) => {
    message.reply({
        content: `${user}, estos son tus roles:\n\n${roles.join("\n")}`
    })
}
const optionPing = (message) => {
    message.reply({
        content: 'pong',
        ephemeral: false,
    })
}
const getInfo = (message) => {
    let userRoles = [...message.member._roles]
    let userRolesByName=[]
    for (let index = 0; index < userRoles.length; index++) {
        userRolesByName.push(roles[userRoles[index]])
    }
    return userRolesByName
}

client.login(process.env.TOKEN)