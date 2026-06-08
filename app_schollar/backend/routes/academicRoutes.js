const express = require('express');
const { summary } = require('../controllers/dashboardController');
const { bulletin, saveGrade } = require('../controllers/gradeController');
const { create: createStudent } = require('../controllers/studentController');
const { create: createSubject } = require('../controllers/subjectController');
const { create: createTeacher } = require('../controllers/teacherController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);
router.get('/dashboard', summary);
router.post('/alunos', createStudent);
router.post('/professores', createTeacher);
router.post('/disciplinas', createSubject);
router.post('/notas', saveGrade);
router.get('/boletim/:matricula', bulletin);

module.exports = router;