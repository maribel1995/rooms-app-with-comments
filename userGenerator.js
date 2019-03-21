const femNames = ["Adele","Agatha","Ágda","Agnes","Alexa","Alice","Alina","Alícia","Amanda","Amara","Amélie","Anastásia","Ariana","Ariel","Aurora","Beatriz","Benedita","Bianca","Bárbara","Bruna","Camila","Candy","Carolina","Catarina","Cecília","Clara","Constança","Cíntia","Daisy","Dalila","Diana","Dina","Diva","Dora","Dália","Elisa","Emily","Emma","Érica","Esperança","Estela","Eulália","Eva","Fanny","Fátima","Filomena","Flávia","Flora","Francisca","Gina","Giovanna","Gisela","Giselle","Glória","Helena","Helga","Heloísa","Holly","Ianna","Ingrid","Inês","Iolanda","Irina","Iris","Isadora","Ivanna","Ísis","Jade","Janete","Jennifer","Joana","Joyce","Juliana","Kaira","Kamilly","Karen","Keila","Kelly"];
const maleNames = ["Adriano","Afonso","Alexandre","Anthony","Apolo","Ariel","Arthur","Áxel","Ângelo","Baltasar","Benjamin","Bernardo","Bryan","Caetano","Caio","Calisto","Calvin","Camilo","Conrado","Cristiano","Cássio","Daniel","Danilo","Dante","David","Delfim","Denis","Diego","Dimitri","Dino","Dinís","Dionísio","Duarte","Dylan","Dário","Edgar","Enzo","Erik","Eurico","Élton","Fausto","Francisco","Franklin","Frederico","Félix","Gabriel","Gaspar","Gil","Gino","Giovani","Gonçalo","Guilherme","Gustavo","Harry","Haruki","Haruto","Heitor","Henrique","Hermes","Hernâni","Hiêgo","Hugo","Hêber","Iago","Igor","Iker","Infante","Isaac","Ismael","Ivan","Ivo"," Ítalo","Jackson","Johnny","Jonas","Joshua","Julian","Kevin","Kim","Kimi","Kirill","Leonardo","Levi","Lisandro","Lourenço","Lucas","Lucca","Luigi","Marcelo","Marlon","Martin","Micael","Michael","Miguel","Moisés","Muriel","Murilo","Neymar","Nílton","Nícolas","Odin","Omar","Oriel","Osíris","Pascoal","Patrick","Patrício","Rael","Rafael","Raul","Ricardo","Riku","Rodolfo","Rodrigo","Romero","Romeu","Ronaldo","Ryan","Salvador","Samir","Samuel","Santiago","Sergio","Silas","Sidney","Simão","Sálvio","Stefano","Takumi","Thales","Theo","Thiago","Timóteo","Tommy","Tomás","Ulisses","Uriel","Valdo","Valentim","Valter","Vasco","Vicente","William","Wesley","Washington","Xavier","Yanick","Yuri"];
module.exports = () => {
    const data = { users: [] }
    for (let i = 0; i < 100; i++) {
        const sex = random(['male','fem']);
        const selectName = () => sex == 'male' ? random(maleNames) : random(femNames);
        const name = selectName();
      data.users.push({ 
          name: name,
          email: `${name}${i}@mock.com`.toLowerCase(),
          cpf:gerarCPF(),
          phone: 11972616068,
          sex: sex,
          birth: {
            day:verifyDigit(randomNumber(30)+1).toString(),
            month: verifyDigit(randomNumber(11)+1).toString(),
            year: (randomNumber(10)+1990).toString()
          },
          hairType: random(['liso', 'ondulado', 'cacheado', 'crespo']),
          hairLength: random(['longo', 'curto', 'medio']),
          hairColor: random(['loiro', 'ruivo', 'castanho', 'preto', 'grisalho', 'cor artificial']),
          eyeColor: random(['verde', 'castanho escuro', 'castanho claro', 'azul']),
          skinTone: random(['amarela', 'branca', 'indígena', 'afro', 'parda']),
          ethnicity: random(['africano', 'asiatico', 'caucasiano', 'euro-asiatico', 'europeu', 'latino', 'mediterraneo', 'mestico']),
          hip: randomCM(50),
          waist: randomCM(50),
          bust: randomCM(50),
          weight: randomWeight(),
          height: randomCM(100),
          profileImg: 'https://res.cloudinary.com/dxemyxjas/image/upload/v1551523115/rooms-app/profile-no.png',
          instagramProfile: name+i,
          bankAccount: 'conta do banco',
          type: 'user'
      })
    }
    return data
  }

  random = (arr) => {
    const pos = Math.floor(Math.random()*arr.length);
    return arr[pos];
  }
  randomNumber = (num) => Math.floor(Math.random()*num);
  randomCM = (num) => Math.floor(Math.random()*100+num);
  randomWeight = () => {
    const weight = randomCM(0);
    return weight < 50 ? 50 : weight;
  }
  verifyDigit = (num) => { 
    return num.toString().length === 1 ? `0${num}` : num
  };
    
  
  randomBirth = () => {
    const day = randomNumber(30)+1;
    const month = randomNumber(11)+1;
    const year = randomNumber(10)+1990;
    return `${verifyDigit(day)}/${verifyDigit(month)}/${year}`
  }
 
  function mod(dividendo,divisor) {
    return Math.round(dividendo - (Math.floor(dividendo/divisor)*divisor));
  }
  
  function gerarCPF() {
    const comPontos = false; // TRUE para ativar e FALSE para desativar a pontuação.
    
    var n = 9;
    var n1 = randomNumber(n);
    var n2 = randomNumber(n);
    var n3 = randomNumber(n);
    var n4 = randomNumber(n);
    var n5 = randomNumber(n);
    var n6 = randomNumber(n);
    var n7 = randomNumber(n);
    var n8 = randomNumber(n);
    var n9 = randomNumber(n);
    var d1 = n9*2+n8*3+n7*4+n6*5+n5*6+n4*7+n3*8+n2*9+n1*10;
    d1 = 11 - ( mod(d1,11) );
    if (d1>=10) d1 = 0;
    var d2 = d1*2+n9*3+n8*4+n7*5+n6*6+n5*7+n4*8+n3*9+n2*10+n1*11;
    d2 = 11 - ( mod(d2,11) );
    if (d2>=10) d2 = 0;
    retorno = '';
    if (comPontos) cpf = ''+n1+n2+n3+'.'+n4+n5+n6+'.'+n7+n8+n9+'-'+d1+d2;
    else cpf = ''+n1+n2+n3+n4+n5+n6+n7+n8+n9+d1+d2;
    return cpf;
  }
  
  