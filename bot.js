/**
Tucker3
written by Blaze over the course of a week or so ;)
*/

/* MODULES */
const Discord = require('discord.js')
const fs = require('fs')
const request = require('request')
const Client = new Discord.Client()
const options = require('./options.js')

/* TALKSHOW */
var showing = false
var host = ''
var guests = []
var showtitle = ''
var elapsedseconds = 0

/* WORD GAME */
var usersInGame = []
var currentWord = 'qats'
var pastWords = []
var turn = 0
var objected = 0

/* DATA RECEIVAL/DISTRIBUTION */
var sendDataToFile = (index, datum, callback) => {
  fs.readFile(options.jsonFile, {encoding: 'utf8'}, (error, individualData) => {
    if (error) console.error(error)
    var data = JSON.parse(individualData)
    if (typeof index === 'function') {
      data = index(data, datum)
    } else {
      data[index] = datum
    }
    data = JSON.stringify(data)
    fs.writeFile(options.jsonFile, data, (err) => {
      if (err) return console.log(err)
      console.log('Data has been successfully pushed to ' + options.jsonFile)
      callback()
    })
  })
}
var getDataFromFile = () => {
  return JSON.parse(fs.readFileSync(options.jsonFile, 'utf8'))
}
var stripIDFromMention = (str) => {
  return str.replace(/<|>|!|@/gim, '')
}

/* OTHER FUNCTIONS/VARIABLES */
function DelayPromise (delay) {
  return function (data) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(data)
      }, delay)
    })
  }
} // from https://blog.raananweber.com/2015/12/01/writing-a-promise-delayer/

var commands = {
  // talkshow commands
  startshow (message, args) {
    if (!showing) {
      if (options.hosts.find((x) => x === message.author.id)) {
        host = message.author.id
        showing = true
        showtitle = args[0]

        guests = []
        Client.channels.get(options.talkshowChannel).overwritePermissions(message.author, {
          SEND_MESSAGES: true
        }).then(() => {
          message.channel.sendMessage('Cool! You have an hour to do your show. Let\'s GO!')
        })
      } else {
        message.channel.sendMessage('I\'m afraid that you aren\'t allowed to have a show :sob:\nAsk Blaze if you would like one!')
      }
    } else {
      message.channel.sendMessage('There\'s a show going on right now. Try again later!')
    }
  },
  endshow (message) {
    if (showing) {
      if (message.author.id === host) {
        showing = false
        host = ''
        guests = []
        showtitle = ''
        elapsedseconds = 0
        Client.channels.get(options.talkshowChannel).overwritePermissions(message.author, {
          SEND_MESSAGES: false
        }).then(() => {
          message.channel.sendMessage('Show stopped! Come again next time! :smile:')
        })
      } else {
        message.channel.sendMessage('You cannot stop a show if it is not yours.')
      }
    } else {
      message.channel.sendMessage('There is nothing to stop.')
    }
  },
  statistics (message) {
    if (showing) {
      message.channel.sendMessage('***' + showtitle + '***\nby *<@' + host + '>*\nGuests: \n• ' + guests.join('\n• ') + '\nCurrently Elapsed Time: ' + Math.floor(elapsedseconds / 60) + ' minutes and ' + elapsedseconds + 'seconds.')
    } else {
      message.channel.sendMessage('There is not a show currently going on.')
    }
  },
  addguest (message, args) {
    if (showing && message.author.id === host) {
      guests.push(args[0])
      Client.channels.get(options.talkshowChannel).overwritePermissions(Client.users.get('id', args[0].replace(/<|@|>/gim, '')), {
        'sendMessages': true
      })
      message.channel.sendMessage('Complete.')
    }
  },
  remguest (message, args) {
    if (showing && message.author.id === host) {
      guests.splice(guests.indexOf(args[0]), 1)
      Client.channels.get(options.talkshowChannel).overwritePermissions(Client.users.get('id', args[0].replace(/<|@|>/gim, '')), {
        'sendMessages': false
      })
      message.channel.sendMessage('Complete.')
    }
  },

  // functionality commands
  help (message) {
    message.channel.sendMessage('***Current Command List***\n```' + ((options.prefix === '$') ? 'PowerShell\n' : 'bf\n') + options.prefix + Object.keys(this).join(`, ${options.prefix}`).replace(options.prefix + '.', '.') + '```')
  },
  kill (message) {
    if (message.member.roles.has('235932854687760395')) {
      message.channel.sendMessage('I\'m dying....')
        .then(DelayPromise(1200))
          .then((message) => {
            message.edit('ded')
              .then(() => {
                console.error('Closing')
                Client.destroy()
                process.exit()
              })
          })
    }
  },
  afk (message) {
    // message.channel. (WIP)
  },
  avatar (message) {
    if (message.mentions.users && message.mentions.users[0].id !== message.author.id) {
      message.channel.sendMessage('Their avatar is ' + message.mentions.users[0].avatarURL)
    } else {
      message.channel.sendMessage('Your avatar is ' + message.author.avatarURL)
    }
  },
  'delete': (message, args) => {
    var number = args[0] * 1
    if (isNaN(number)) {
      message.channel.sendMessage('Dat not a number')
    } else {
      message.channel.fetchMessages({limit: number})
        .then((messages) => {
          for (let i = 0; i < messages.array.length; i++) {
            messages.array[i].delete()
          }
        })
    }
  },
  deleteUser (message, args) {
    var user = message.mentions[0]
    var number = args[1] * 1
    if (isNaN(number)) {
      message.channel.sendMessage('Dat not a number')
    } else {
      message.channel.fetchMessages({limit: number})
        .then((messages) => {
          for (let i = 0; i < messages.array.length; i++) {
            if (messages.array[i].author.id === user.id) {
              messages.array[i].delete()
            }
          }
        })
    }
  },

  // test commands
  multicommand (message, args) {
    message.channel.sendMessage(`The first argument is ${args[0]}, and the second argument is ${args[1]}, and the third is ${args[2]}`)
  },
  pm (message, args) {
    message.author.sendMessage('You wanted me to send you the following: ```' + args[0] + '```')
  },
  sendTest (message) {
    message.channel.sendMessage('Test')
    sendDataToFile('test', 16, () => {
      message.channel.sendMessage('Promised and returned.')
    })
  },
  editTest (message) {
    message.channel.sendMessage('1')
      .then(DelayPromise(1000))
        .then((message) => {
          message.edit('2')
          .then(DelayPromise(1000))
            .then((message) => {
              message.edit('3')
                .then(DelayPromise(1000))
                  .then((message) => {
                    message.edit('4')
                      // hmm I need to figure out how to recursion this baby
                  })
            })
        })
  },
  deleteTest (message) {
    // this is mostly a test of promises. I didn't know how to use them before.
    message.channel.sendMessage('regequit')
      .then((message) => {
        message.delete(1200)
          .then(() => {
            message.channel.sendMessage('Did you see it? :wink:')
          })
          .catch(console.error)
      })
      .catch(console.error)
  },

  // fun commands
  tr8r (message) {
    message.channel.sendFile('images/tr-8r.gif', 'tr-8r.gif')
  },
  tuckerfacts (message) {
    message.channel.sendMessage(':point_up_2: ' + options.facts[Math.floor(Math.random() * options.facts.length)])
  },
  '8ball': (message) => {
    // Because this command is irregular in that it cannot be expressed in literal JavaScript without causing an error, the syntax has been changed slightly for this and the next few commands.
    message.channel.sendMessage('```' + options.ballResponses[Math.floor(Math.random() * options.ballResponses.length)] + '```')
  },
  cat: (message) => {
    message.channel.sendMessage('Loading...')
      .then((createdMessage) => {
        request('http://www.random.cat/meow', (error, response, body) => {
          body = JSON.parse(body)
          if (!error && response.statusCode * 1 === 200) {
            message.channel.sendFile(body.file)
              .then(() => {
                createdMessage.delete()
              })
          }
        })
      })
  },
  dog: (message) => {
    request('http://www.random.dog/woof', (error, response, body) => {
      if (!error && response.statusCode * 1 === 200) {
        console.log(body)
        message.channel.sendMessage(`http://www.random.dog/${body}`)
      }
    })
  },

  // game commands
  join (message) {
    if (!usersInGame.find(x => x === message.author)) {
      usersInGame.push(message.author)
      message.channel.sendMessage('You\'ve been added to the game!')
    } else {
      message.channel.sendMessage('You\'re already in the game!')
    }
  },
  leave (message) {
    if (usersInGame.find(x => x === message.author)) {
      usersInGame.splice(usersInGame.indexOf(message.author), 1)
      message.channel.sendMessage('You\'ve been removed from the game!')
    } else {
      message.channel.sendMessage('You\'re not in the game.')
    }
  },
  submit (message, args) {
    if (usersInGame.find(x => x === message.author)) {
      if (usersInGame.indexOf(message.author) === turn && args[0][0] === currentWord[currentWord.length - 1]) {
        pastWords.push(currentWord)
        if (pastWords.length > 5) pastWords.shift()
        currentWord = args[0]
        turn = turn > usersInGame.length ? 0 : turn + 1
        message.channel.sendMessage(`The word is now ${currentWord}. It is ${usersInGame[turn]}'s turn.`)
      } else {
        message.channel.sendMessage(`Either it is not your turn or you submitted a word that doesn't work. The current word is still ${currentWord}`)
      }
    } else {
      message.channel.sendMessage('You\'re not in the game!')
    }
  },
  object (message) {
    if (usersInGame.find(x => x === message.author)) {
      objected++
      if (objected < Math.ceil(usersInGame / 2)) {
        message.channel.sendMessage(`${objected} out of the  ${Math.ceil(usersInGame / 2)} users required have objected to the previous role.`)
      } else {
        if (pastWords.length > 0) {
          objected = 0
          turn--
          currentWord = pastWords[pastWords.length - 1]
          pastWords.pop()
          message.channel.sendMessage(`Objected. It is ${usersInGame[turn]}'s turn. The word is now ${currentWord}`)
        } else {
          message.channel.sendMessage('There are no words to object to.')
        }
      }
    } else {
      message.channel.sendMessage('You\'re not in the game!')
    }
  },
  word (message) {
    console.log(turn, currentWord, usersInGame[turn])
    message.channel.sendMessage(`The current word is \`${currentWord}\`. The past five words were: \`\`\`${pastWords.reverse().join(',')}\`\`\` It is ${usersInGame[turn]}'s turn.'`)
  },

  // quote commands
  '.': (message, args) => {
    message.channel.sendMessage('Writing command to database.')
    sendDataToFile((data) => {
      args[0] = stripIDFromMention(args[0])
      if (!data[args[0]]) {
        message.channel.sendMessage('This data does not exist and thus cannot be deleted.')
      } else {
        data[args[0]].splice(args[1] * 1, 1)
      }
      return data
    }, args[1], () => {
      message.channel.sendMessage('Completed writing to database. Quote deleted.')
    })
  },
  '..': (message, args) => {
    message.channel.sendMessage('Writing command to database.')
    sendDataToFile((data, sentData) => {
      args[0] = stripIDFromMention(args[0])
      if (!data[args[0]]) {
        data[args[0]] = [sentData]
      } else {
        data[args[0]].push(sentData)
      }
      return data
    }, args[1], () => {
      message.channel.sendMessage('Completed writing to database. Quote saved.')
    })
  },
  '...': (message, args) => {
    var data = getDataFromFile()[stripIDFromMention(args[0])] || []
    message.channel.sendMessage(data[Math.floor(Math.random() * data.length)])
  },
  '....': (message, args) => {
    var data = getDataFromFile()[stripIDFromMention(args[0])]
    message.channel.sendMessage('This user\'s current quotes are: ```' + data.join('\n\n') + '```')
  }
}

for (var i in options.commands) {
  if (commands[i]) commands['_' + i] = options.commands[i]
  else commands[i] = options.commands[i]
}

Client.on('message', (message) => {
  try {
    var content = message.content
    var hasAlreadyRunCommand = false
    if (message.author.id !== Client.user.id) {
      Client.channels.get(options.loggingChannel).sendMessage('\uD83D\uDD51 **' + message.author.username + '#' + message.author.discriminator + '** said ```' + message.cleanContent.replace(/`/gim, '') + '``` in `#' + message.channel.name + '`')
    }
    for (var i in commands) {
      if (!hasAlreadyRunCommand) {
        if (typeof commands[i] !== 'function') continue
        if (content.startsWith(i.startsWith('.') ? (i + ' ') : (options.prefix + i + ' '))) {
          var args = content.substr((i.startsWith('.') ? (i + ' ') : (options.prefix + i)).length + 1, content.length).split(options.separator)
          for (var j = 0; j < args.length; j++) {
            args[j] = args[j].trim()
          }
          commands[i](message, args)
          hasAlreadyRunCommand = true
        }
      }
    }
  } catch (e) {
    message.channel.sendMessage('Error: ' + e)
  }
})

Client.on('serverNewMember', (server, member) => {
  Client.channels.get(options.welcomeChannel).sendMessage(member + ', welcome to the chat! Enjoy your stay! :)')
})

Client.on('ready', () => {
  Client.user.setGame(options.prefix + 'help')
  Client.user.setAvatar('./images/image.jpg')
})
setInterval(() => {
  if (showing) {
    elapsedseconds++
  }
}, 1000)
Client.login(options.token)
