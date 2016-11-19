# Tucker2
A made-from-scratch easy-to-use Discord bot with too many hyphens.

<img src="https://img.shields.io/david/BlazeProgramming/Tucker2.svg" />
### Originally created by BlazeProgramming...
...for use on the Khan Academy Discord Server, with many Khan-Academy-specific commands.

### Now available to use on...
...ANY discord server (with a bit of configuration, hehe).

## Dependencies
* [Node.js](https://nodejs.org/)
* [discord.js](https://github.com/hydrabolt/discord.js/)
* [request](https://www.npmjs.com/package/request)

## Stuff
* [Team Members](#team-members)
* [Commands](#commands)
* [Personal Setup](#personal-setup)
* [Personal Commands](#personal-commands)

## Team Members
(Or people who have helped a lot to develop the bot)
* BlazeProgramming
* KingCodeFish
* Raumaankidwai
* EytukanStudios

## Commands
* Talkshow Commands
  * startshow
  * endshow
  * statistics
  * addguest
  * remguest
* Functionality
  * help
  * kill
  * afk
  * avatar
  * delete
* Fun
  * tr8r
  * tuckerfacts
  * 8ball
  * cat
  * dog
* Word game (WIP)
  * join
  * leave
  * submit
  * object
  * word
* Quotes (WIP)
  * .
  * ..
  * ...
  * ....

## Personal Setup
(wip more)

## Personal Commands
You can add your own commands using a (WIP, lol) system from options.js.

Begin with your function name. I'll use `ping` for example. My code will be as follows:
```javascript
exports.commands = {

  // [...]

  ping () {

  }

  // [...]

}
```
Each function takes message and message arguments as parameters. You can include them here.
```javascript
exports.commands = {

  // [...]

  ping (message, args) {

  }

  // [...]

}
```
* message [Object]: An object with many properties about the message itself. See [this](https://discord.js.org/#!/docs/tag/master/class/Message) for more information.
* args [Array]: An array of arguments, separated by the separator you should define in the options when you set up the bot.

You can use any discord.js code you would like in the commands. The code I'm adding comes straight from their website:
```javascript
exports.commands = {

  // [...]

  ping (message, args) {
    // if the message is "ping", send "pong" to the same channel.
    message.channel.sendMessage('pong')
  }

  // [...]

}
```

Save the file and reload the bot. Your custom command should be implemented! Good luck!
