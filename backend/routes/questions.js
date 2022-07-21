const express = require('express');
const {fetchQuestions, fetchQuestion, createQuestion, updateQuestion, deleteQuestion} = require("../services/questions/questions");
const router = express.Router();
//TODO: implement backend functions from ../services/questions/questions.js

router.get('/questions/fetchQuestion/:id', fetchQuestion);
router.get('/questions/fetchQuestions', fetchQuestions);
router.post('/questions/createQuestion', createQuestion);
router.post('/questions/updateQuestion/:id', updateQuestion);
router.delete('questions/deleteQuestions/:id', deleteQuestion)

module.exports = router;