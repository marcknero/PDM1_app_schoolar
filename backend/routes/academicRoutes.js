const express = require('express');
const { summary } = require('../controllers/dashboardController');
const { bulletin, bulletinByAlunoId, saveGrade, getGradesByProfessor, getGradesBySubject, remove: removeGrade } = require('../controllers/gradeController');
const { create: createStudent, getAll: getAllStudents, getById: getStudentById, update: updateStudent, remove: removeStudent } = require('../controllers/studentController');
const { create: createSubject, getAll: getAllSubjects, getById: getSubjectById, getByProfessor: getSubjectsByProfessor, update: updateSubject, remove: removeSubject } = require('../controllers/subjectController');
const { create: createTeacher, getAll: getAllTeachers, getById: getTeacherById, update: updateTeacher, remove: removeTeacher } = require('../controllers/teacherController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);

router.get('/dashboard', summary);

router.post('/alunos', requireRole('coordenacao'), createStudent);
router.get('/alunos', requireRole('coordenacao'), getAllStudents);
router.get('/alunos/:id', requireRole('coordenacao'), getStudentById);
router.put('/alunos/:id', requireRole('coordenacao'), updateStudent);
router.delete('/alunos/:id', requireRole('coordenacao'), removeStudent);

router.post('/professores', requireRole('coordenacao'), createTeacher);
router.get('/professores', requireRole('coordenacao'), getAllTeachers);
router.get('/professores/:id', requireRole('coordenacao'), getTeacherById);
router.put('/professores/:id', requireRole('coordenacao'), updateTeacher);
router.delete('/professores/:id', requireRole('coordenacao'), removeTeacher);

router.post('/disciplinas', requireRole('coordenacao'), createSubject);
router.get('/disciplinas', requireRole('coordenacao'), getAllSubjects);
router.get('/disciplinas/:id', requireRole('coordenacao'), getSubjectById);
router.get('/disciplinas/professor/:professor_id', requireRole('coordenacao', 'professor'), getSubjectsByProfessor);
router.put('/disciplinas/:id', requireRole('coordenacao'), updateSubject);
router.delete('/disciplinas/:id', requireRole('coordenacao'), removeSubject);

router.post('/notas', requireRole('coordenacao', 'professor'), saveGrade);
router.get('/notas/professor/:professor_id', requireRole('coordenacao', 'professor'), getGradesByProfessor);
router.get('/notas/disciplina/:disciplina_id', requireRole('coordenacao', 'professor'), getGradesBySubject);
router.delete('/notas/:id', requireRole('coordenacao', 'professor'), removeGrade);

router.get('/boletim/:matricula', bulletin);
router.get('/boletim/aluno/:aluno_id', bulletinByAlunoId);

module.exports = router;