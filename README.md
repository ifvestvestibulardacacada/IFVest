# IFVestTCC

- ter a versão mais recente do node js
- (recomendação) usar o cmd do gitbash
- instalar o mysql (workbench e o server)
- configurar o mysql server
- Quando iniciar, modifique a senha do mysql do aquivo config.json (dentro da pasta config) para sua senha e acesso, para ter acesso ao banco de dados
- npm i
- npm install nodemon -g
- npx sequeliza db:create
- npx sequeliza db:migrate
- nodemon index.js
- dentro do navegador digite "http://localhost/"

# Como adicionar Areas (Ex.: Mateamatica)
- Abra o mysql workbench
- escolha a tabela "areas"
- botão direito e selecione "Select rows"
- selecione o campo "area" e de um nome
- selecione o campo "descricao" e deixe uma descrição
- aperte o botão "apply"

# Como adicionar topicos (Ex.: calculo)
- Abra o mysql workbench
- escolha a tabela "topicos"
- botão direito e selecione "Select rows"
- selecione o campo "materia" e de um nome
- selecione o campo "areaId" e coloque o id da area que o topico pertence (pode ser verificado visitando a tabela "area")
- aperte o botão "apply"

# Como alterar o tipo de usuario (Ex.: professor)
- crie um usuario dentro da plataforma (apenas execute a plataforma e se registre)
- Abra o mysql workbench
- escolha a tabela "usuarios"
- botão direito e selecione "Select rows"
- selecione o campo "perfil" do usuario que você quer modificar e escolha sua função
- 0 e 1 para estudante
- 2 para professores
- 3 para administradores
- após modificar o numero, aperte o botão "apply"

# Como criar questões
- para isso você deve ter um perfil de professor
- após isso apenas logue na plataforma e você tera acesso a area de criação de questões

# Como criar/realizar questionarios
- apenas logue e você terá acesso a criação e a realização de questionarios
