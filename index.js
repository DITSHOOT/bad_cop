const Discord  = require("discord.js")
const bot = new Discord.Client({intents: 3276799})
const config = require('./config')
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

bot.login(process.env.TOKEN)


app.listen(PORT, () => {
  console.log(`Le bot est en cours de lancement sur le port ${PORT}`);
});


let status = [
  {
    name: 'Fatal Bazooka - Fous Ta Cagoule',
    type: Discord.ActivityType.Listening,
  },
  {
    name: 'Beverly Hills Cop',
    type: Discord.ActivityType.Watching,
  },
  {
    name: 'UFC - Fait gaffe, parle moi mieux toi',
    type: Discord.ActivityType.Competing,
  },

  
]


bot.on('ready', () => {
  const channel = bot.channels.cache.get('1163902591768477776');
  if (!channel) return console.error('Le salon spécifié est introuvable.');
  channel.send('Le bot est maintenant connecté ! <@510818650307952640>');
    console.log(`Connecté en tant que ${bot.user.tag}`);



  setInterval(() =>{
    let random = Math.floor(Math.random() * status.length);
    bot.user.setActivity(status[random]);
  },3600000);
});



bot.on('guildMemberAdd', member => {
  let embed = new Discord.EmbedBuilder()
    .setDescription(`Écoute-moi bien, ${member} ! T'as atterri sur le Discord de la classe **BTS SIO Grp1-Grp2**, là où la réussite t'attend au tournant. Accroche-toi bien, petit génie, et que la chance soit avec toi, ou tu vas en avoir besoin, espèce de novice ! <a:dance_cop:1164284513417953420>`)
      // Ajoutez l'URL de l'icône ici si nécessaire
    .setColor('#099EF9')
    .setImage('https://media.tenor.com/GG3uY-0YauYAAAAC/wink-eddie-murphy.gif')
    .setTimestamp();


  // Remplacez 'ID_DU_CANAL' par l'ID du canal où vous souhaitez envoyer le message.
  const channel = member.guild.channels.cache.get('1163482473880092692');
  //   const channel = member.guild.channels.cache.find(ch => ch.name === '🎉-accueil-🤝');

  if (channel) {
    channel.send({ embeds: [embed] });
  }
});



const vilainsMots = ['putain', 'ta mere', 'ta mère', 'pute', 'fdp', 'fils de pute']; // Ajoutez ici la liste de mots que vous souhaitez détecter

const phrasesReponses = [
  "Hé, mec, t'as cru quoi ? T'as pas d'impunité ici. Les règles sont strictes, et ça, ça passera pas. C'est clair ?",
  "Hey, on est pas en train de jouer à cache-cache ici. Si tu cherches à contourner la loi, tu vas vite déchanter, parce que ça, ça passera pas. Capiche ?",
  "Mon pote, tu peux pas faire n'importe quoi dans ce coin. On est vigilants, et si tu crois que ça, ça passera pas, tu te fourres le doigt dans l'œil. Fais gaffe à toi.",
  "Alors, t'as cru que t'étais au-dessus des lois, hein ? Non, non, non, ici, ça, ça passera pas, que t'en sois bien conscient. On veille au grain, mec.",
  "Hé, écoute-moi bien, mon pote. On peut faire des conneries dans ce quartier, ouais, mais faut pas croire que ça, ça passera pas. Les règles sont claires ici, et on veille au grain. Alors, t'as deux choix : tu te tiens à carreau et tu respectes les lois, ou bien tu vas goûter à la justice du quartier. Et je peux te garantir que ça, ça passera pas. Alors, à toi de voir comment tu veux jouer ton coup, mec."
];

bot.on('messageCreate', (message) => {
  if (message.author.bot) return; // Ignorer les messages des bots
  const messageContent = message.content.toLowerCase(); // Convertir le message en minuscules pour une correspondance insensible à la casse

  for (const vilainMot of vilainsMots) {
    if (messageContent.includes(vilainMot)) {
      // Si le message contient un mot inapproprié
      const reponseAleatoire = phrasesReponses[Math.floor(Math.random() * phrasesReponses.length)];
      message.reply(reponseAleatoire);
      break; // Arrêter la boucle après avoir trouvé un mot inapproprié
    }
  }
});



bot.on('messageCreate', (message) => {
  if (message.author.bot) return; // Ne répondez pas aux messages des bots
  if (!message.content.startsWith(config.prefix)) return; // Vérifiez s'il commence par le préfixe

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'say') {
    // Vérifiez si l'utilisateur est un administrateur
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply('Seuls les administrateurs sont autorisés à utiliser cette commande.');
    } 

    // Récupère le message de l'utilisateur, en excluant le préfixe
    const userMessage = args.join(' ');
    if (!userMessage) {
      return message.channel.send('Veuillez écrire un message.');
    }

    // Supprime la commande de l'utilisateur
    message.delete();
  
    // Envoie le message personnalisé de l'utilisateur


    message.channel.send(userMessage);
  } else if (command === 'kick') {
    // Vérifiez les autorisations ici
    if (!message.member.permissions.has('KICK_MEMBERS')) {
      return message.channel.send('Vous n\'avez pas la permission de kick des membres.');
    }

    const member = message.mentions.members.first();

    if (!member) {
      return message.channel.send('Veuillez mentionner un membre à kicker.');
    }

    const reason = args.slice(1).join(' '); // Ignorer la mention du membre et obtenir la raison

    if (!reason) {
      return message.channel.send('Veuillez spécifier une raison pour le kick.');
    }

    member.kick(reason)
      .then((kickedMember) => {
        const kickEmbed = {
          color: 0xFF0000, // Couleur rouge (vous pouvez changer cette couleur)
          title: `Exclusion de Babouins`,
          description: `${kickedMember.user.tag} a été kick avec succès.`,
          
          fields: [
            {
              name: 'Raison',
              value: reason,
            },
          ],
          image: {
            url: 'https://media.tenor.com/nqNpYfKitJoAAAAC/police-car.gif', // Remplacez par l'URL de votre image
          },
        };

        message.channel.send({ embeds: [kickEmbed] });
      })
      .catch((error) => {
        console.error(error);
        message.channel.send('Une erreur s\'est produite lors du kick du membre.');
      });
  }
});




bot.on('messageCreate', (message) => {
  if (message.content === '!ping') {
    const embed = new Discord.EmbedBuilder()
      .setTitle('Ping')
      .setDescription('Pong!')
      .setColor('#0099ff');

    message.channel.send({ embeds: [embed] });
  }

});
