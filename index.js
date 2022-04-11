import DiscordJS, { Intents, MessageEmbed } from 'discord.js'
import dotenv from 'dotenv'
import requirejs from 'requirejs'

dotenv.config()

let weeklyGains = 0;

const client = new DiscordJS.Client({
    intents : [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.on('ready', () => {
    console.log('Making Money')

    // guild
    const guildId = '844745315780919315'
    const guild = client.guilds.cache.get(guildId)
    let commands
    if (guild){
        commands = guild.commands
    }else{
        commands = client.application?.commands
    }

    commands?.create({
        name: 'addweeklygains',
        description: 'Add a number to the Weekly Gains',
        options:[
        {
            name: 'number',
            description: 'Number to be added to weeklyGains',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        }
        ]
    })
    commands?.create({
        name: 'setweeklygains',
        description: 'Set number for Weekly Gains',
        options:[{
            name: 'number',
            description: 'Number to be set as weeklyGains',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        }]
    })
    commands?.create({
        name: 'weeklygains',
        description: 'What is currently the Weekly Gain',
    })
    commands?.create({
        name: 'newsignal',
        description: 'Send a new signal to the community',
        options:[{
            name:'stock',
            description: 'Specify which stock is',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'price',
            description: 'Price Target for the contract',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        },{
            name: 'direction',
            description: 'Specify PUTS or CALLS',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },{
            name: 'stoploss',
            description: 'Specify stoploss mark',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        }
        ]
    })
})

//interaction 
client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand()){
        return
    }

    const {commandName, options} = interaction
    let number, stock, price, direction, stoploss;

    switch(commandName){
        case 'addweeklygains':

            number = options.getNumber('number')
            weeklyGains+= number;
            interaction.reply({
                content: `${weeklyGains}`,
                ephemeral: false,
            })

            break;
        case 'setweeklygains':
            number = options.getNumber('number')
            weeklyGains = number;
            interaction.reply({
                content: `${weeklyGains}`,
                ephemeral: false,
            })

            break;
        case 'weeklygains':
            interaction.reply({
                content: `${weeklyGains}`,
                ephemeral: false,
            })

            break;
        case 'newsignal':
            stock = options.getString('stock')
            price = options.getNumber('price')
            direction = options.getString('direction')
            stoploss = options.getNumber('stoploss')

            client.channels.cache.get('963203161445789756').send(`SIGNAL: ${stock} - $${price} - ${direction.toUpperCase()} || StopLoss: ${stoploss}`) 
            
            interaction.reply({
                content: `Your signal has been sent to <#963203161445789756>`,
                ephemeral: false,
            })
            
    }
})

//message
client.on('messageCreate', (message) =>{
    let user = message.author.username;
    let roles = getInfo(message)
    switch (message.content){
        case "me":
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