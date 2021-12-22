import DiscordJS, {Intents} from 'discord.js'
import dotenv from 'dotenv'
import GAME_OPTIONS from "./src/games/constants.js";
import GAMES from "./src/games/index.js";
import {profitHandler} from "./src/commands/profit.js";

dotenv.config()

const client = new DiscordJS.Client(
  {
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES
    ]
  }
)

client.on('ready', () => {
  // Connect to database
  console.log('The bot is ready')

  // Commands
  const GUILD_ID = '891016841030434866'
  const guild = client.guilds.cache.get(GUILD_ID)

  let commands
  if (guild) {
    commands = guild.commands
  } else {
    commands = client.application?.commands
  }

  commands?.create({
    name: 'profit',
    description: 'Returns a profit for a game',
    options: [{
      name: 'game',
      description: 'Name of the game.',
      required: true,
      type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
    },
      {
        name: 'wallet',
        description: 'Your wallet address',
        required: true,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
      }
    ]
  })
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return
  }

  const {commandName, options} = interaction

  if (commandName === 'profit') {
    const gameName = options.getString('game')
    const walletAddress = options.getString('wallet')
    if (GAME_OPTIONS.includes(gameName)) {
      const profit = profitHandler(GAMES[gameName].token, walletAddress)
      interaction.reply({
        content: `Your balance in this game is: ${profit} dols`,
        ephemeral: false
      })
    } else {
      interaction.reply({
        content: 'This game is not available',
        ephemeral: false
      })
    }
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)


