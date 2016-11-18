// The bot token goes here: (This one will not work, at least I don't think it will)
exports.token = 'MjM2MjY5NTgyNjMxOTYwNTc3.CxCUjA.pVr2wXE8eFYfue2_jUnApGCV1zs'
// This is the prefix that you'll use on all commands. Default: '++'
exports.prefix = '++'

// This is the talkshow channel, the one that you can make talkshows in. :P
exports.talkshowChannel = '241950128821370880'

// These are the people that can make the shows.
exports.hosts = ['198942810571931649', '176189647846768640', '220527978025713675', '224708044087361537']

// These are the facts that you get if you do ++tuckerfact
exports.facts = [
  'I can set my own avatar if you are my owner. Go into the image files and make a square image called `image.png`. On bot reload, my avatar will be changed to that image.',
  'Did you know that Tucker\'s personality is based entirely on the book that Blaze is writing? You could even ask Blaze \'What would Tucker do?\' in a situation, and he could tell you.',
  'Did you know that Blaze\'s original Tucker bot had a \'bored post\' feature, where the bot would post if no one had posted for 15 minutes? The feature was removed due to excess spam.',
  'I can quote you! If Blaze or a moderator adds a quote from you, you can access it with the `...` command! Try it!',
  'Blaze is a doofus.',
  'The original Tucker code was over 1200 lines long! KingCodeFish condensed it to 130, but never showed anyone his finished version.',
  'Because of the functionality of `discord.js`, I can never delete more than 1000 messages at a time.',
  'The current Tucker code, when correctly spaced, is 216 lines of code long.',
  'When Blaze codes me while surfing Discord, his computer can stay on battery on an average of six hours and forty-five minutes.',
  'Cloud9 times out after 24 hours of `sh` activity, which is why Blaze hates Cloud9\'s false advertising.',
  'I doubt this options.facts will ever be shown due to the functionality of `Math.random()`.',
  '`Heck` is where you go when you don\'t believe in Gosh.',
  'Memes are interesting, but the only one that was made about me was made by Tariq Jabbar. ONLY. ONE...'
]

// how about these ++8ball commands?
exports.ballResponses = [
  'Yes.',
  'No.',
  'It is certain.',
  ':1',
  'My heart says yes.',
  'My heart says no.',
  'Speculation points to the positive response.',
  'Speculation points to the negative response.'
]

// Logs and welcoming are in these channels:
exports.loggingChannel = '211634505562324992'
exports.welcomeChannel = '229655019467702273'

// User commands:
exports.commands = {
  testExported (message, args) {
    message.channel.sendMessage('Tested.')
  }
}

// ADVANCED OPTIONS FOR ADVANCED PEOPLE WHO ARE TUCKER PROFICIENT
exports.jsonFile = 'data.json'
