const express = require('express');
const {fetchQuestion, fetchQuestions, createQuestion, updateQuestion, deleteQuestion} = require("../services/question/question");
const router = express.Router();
//TODO: implement backend functions from ../services/question/question.js

router.get('/question/:id', fetchQuestion);
router.get('/questions', fetchQuestions);
router.post('/question', createQuestion);
router.put('/question/:id', updateQuestion);
router.delete('/question/delete/:id', deleteQuestion);

module.exports = router;