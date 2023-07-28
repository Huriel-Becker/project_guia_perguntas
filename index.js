const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Question = require("./database/Question");
const Answer = require("./database/Answer");

//Database
connection
    .authenticate()
    .then(() => {
        console.log("Conectado com o banco de dados");
    })
    .catch((msgErr) => {
        console.log("Erro ao conectar com o banco de dados: " + msgErr);
    })

// Estou dizendo para o Express usar o EJS como view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rotas
app.get("/", (req, res) => {
    Question.findAll({
        raw: true, order: [
            ['id', 'DESC'] //ASC = Crescente | DESC = decrescente
        ]
    }).then(questions => {
        res.render("index", {
            questions: questions
        });
    });
    // SELECT + all from questions
});

app.get("/ask", (req, res) => {
    res.render("ask");
});

app.post("/savingquestion", (req, res) => {

    const title = req.body.title;
    const description = req.body.description;

    Question.create({
        title: title,
        description: description,
    }).then(() => {
        res.redirect("/");
    });
});

app.get("/ask/:id", (req, res) => {
    const id = req.params.id;
    Question.findOne({
        where: { id: id },
    }).then(question => {
        if (question != undefined) { // Pergunta encontrada
            Answer.findAll({
                where: { questionId: question.id },
                order: [
                    ['id', 'DESC'] //ASC = Crescente | DESC = decrescente
                ]
            }).then(answers => {
                res.render("question", {
                    question: question,
                    answers: answers
                });
            });
        } else { // Pergunta não encontrada
            res.redirect("/");
        }
    });
});

app.post("/reply", (req, res) => {
    const body = req.body.body;
    const questionId = req.body.question;
    Answer.create({
        body: body,
        questionId: questionId
    }).then(() => {
        res.redirect("/ask/" + questionId);
    });
})

app.listen(8080, () => {
    console.log("App rodando");
});