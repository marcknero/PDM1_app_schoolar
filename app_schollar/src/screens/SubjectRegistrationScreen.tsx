import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenFrame } from '../components/ScreenFrame';
import { TextField } from '../components/TextField';
import {
  deleteRegistration,
  fetchCurrentProfile,
  fetchSubjects,
  persistRegistration,
  SubjectRecord,
  updateRegistration,
} from '../services/schoolService';
import { useAuth } from '../contexts/AuthContext';
import { componentStyles } from '../styles/components.styles';
import { formStyles } from '../styles/form.styles';

type SubjectFormState = {
  nome: string;
  carga_horaria: string;
  professor_id: string;
  curso: string;
  semestre: string;
};

const emptyForm: SubjectFormState = {
  nome: '',
  carga_horaria: '',
  professor_id: '',
  curso: '',
  semestre: '',
};

export function SubjectRegistrationScreen() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
  const [profileCourse, setProfileCourse] = useState('');
  const [profileTeacherId, setProfileTeacherId] = useState<number | null>(null);
  const [form, setForm] = useState<SubjectFormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  const isCoordinator = user?.perfil === 'coordenacao';
  const isProfessor = user?.perfil === 'professor';
  const isStudent = user?.perfil === 'aluno';

  const loadSubjects = async () => {
    try {
      setIsLoading(true);
      const [data, profile] = await Promise.all([fetchSubjects(), fetchCurrentProfile()]);

      setSubjects(data);
      setProfileCourse(profile.aluno?.curso ?? '');
      setProfileTeacherId(profile.professor?.id ?? null);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as disciplinas.');
    } finally {
      setIsLoading(false);
    }
  };

  const visibleSubjects = useMemo(() => {
    if (isCoordinator) {
      return subjects;
    }

    if (isProfessor && profileTeacherId) {
      return subjects.filter((subject) => subject.professor_id === profileTeacherId);
    }

    if (isStudent && profileCourse) {
      return subjects.filter((subject) => subject.curso === profileCourse);
    }

    return subjects;
  }, [isCoordinator, isProfessor, isStudent, profileCourse, profileTeacherId, subjects]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (subject: SubjectRecord) => {
    setEditingId(subject.id);
    setForm({
      nome: subject.nome ?? '',
      carga_horaria: String(subject.carga_horaria ?? ''),
      professor_id: subject.professor_id ? String(subject.professor_id) : '',
      curso: subject.curso ?? '',
      semestre: String(subject.semestre ?? ''),
    });
  };

  const handleSave = async () => {
    if (!form.nome.trim() || !form.carga_horaria.trim() || !form.curso.trim() || !form.semestre.trim()) {
      Alert.alert('Atenção', 'Nome, carga horária, curso e semestre são obrigatórios para cadastrar a disciplina.');
      return;
    }

    setIsSaving(true);

    const payload = {
      ...form,
      nome: form.nome.trim(),
      carga_horaria: parseInt(form.carga_horaria, 10) || 0,
      semestre: parseInt(form.semestre, 10) || 1,
      professor_id: form.professor_id ? parseInt(form.professor_id, 10) : null,
    };

    try {
      if (editingId) {
        await updateRegistration('Disciplina', editingId, payload);
        Alert.alert('Atualização realizada', 'A disciplina foi atualizada com sucesso.');
      } else {
        await persistRegistration('Disciplina', payload);
        Alert.alert('Cadastro realizado', 'A disciplina foi salva com sucesso.');
      }

      resetForm();
      await loadSubjects();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a disciplina.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (subject: SubjectRecord) => {
    Alert.alert('Excluir disciplina', `Deseja remover ${subject.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteRegistration('Disciplina', subject.id);
            if (editingId === subject.id) {
              resetForm();
            }
            await loadSubjects();
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir a disciplina.');
          }
        },
      },
    ]);
  };

  const renderSubjectItem = ({ item }: { item: SubjectRecord }) => (
    <View style={componentStyles.card}>
      <View style={formStyles.rowFooter}>
        <Text style={componentStyles.cardTitle}>{item.nome}</Text>
        <View style={componentStyles.chip}>
          <Text style={componentStyles.chipText}>{item.curso}</Text>
        </View>
      </View>
      <Text style={formStyles.summaryText}>Carga horária: {item.carga_horaria}h</Text>
      <Text style={formStyles.summaryText}>Semestre: {item.semestre}</Text>
      <Text style={formStyles.summaryText}>Professor ID: {item.professor_id ?? 'Não vinculado'}</Text>
      {isCoordinator ? (
        <View style={componentStyles.rowWrap}>
          <PrimaryButton label="Editar" onPress={() => startEdit(item)} />
          <PrimaryButton label="Excluir" variant="secondary" onPress={() => handleDelete(item)} />
        </View>
      ) : null}
    </View>
  );

  return (
    <ScreenFrame
      tag="Grade curricular"
      title={isCoordinator ? 'Cadastro de disciplinas' : isProfessor ? 'Minhas disciplinas' : 'Minhas disciplinas'}
      subtitle={
        isCoordinator
          ? 'Estruture o currículo com edição, exclusão e visão completa das turmas.'
          : isProfessor
            ? 'Veja as disciplinas vinculadas ao seu perfil.'
            : 'Consulte as matérias em que você está matriculado.'
      }>
      {isCoordinator && (
        <>
          <View style={componentStyles.card}>
            <Text style={componentStyles.cardTitle}>{editingId ? 'Editar disciplina' : 'Nova disciplina'}</Text>
            <View style={formStyles.grid}>
              <TextField label="Nome da disciplina" value={form.nome} onChangeText={(value) => setForm((current) => ({ ...current, nome: value }))} placeholder="Ex.: Ciências" />
              <TextField label="Carga horária" value={form.carga_horaria} onChangeText={(value) => setForm((current) => ({ ...current, carga_horaria: value }))} placeholder="40" keyboardType="number-pad" />
              <TextField label="Professor ID" value={form.professor_id} onChangeText={(value) => setForm((current) => ({ ...current, professor_id: value }))} placeholder="ID do professor" keyboardType="number-pad" />
              <TextField label="Curso" value={form.curso} onChangeText={(value) => setForm((current) => ({ ...current, curso: value }))} placeholder="Técnico em Informática" />
              <TextField label="Semestre" value={form.semestre} onChangeText={(value) => setForm((current) => ({ ...current, semestre: value }))} placeholder="1" keyboardType="number-pad" />
            </View>
          </View>

          <View style={componentStyles.rowWrap}>
            <PrimaryButton label={isSaving ? 'Salvando...' : editingId ? 'Atualizar disciplina' : 'Salvar disciplina'} onPress={handleSave} disabled={isSaving} />
            {editingId && <PrimaryButton label="Cancelar edição" variant="secondary" onPress={resetForm} />}
          </View>
        </>
      )}

      <View style={componentStyles.card}>
        <Text style={componentStyles.cardTitle}>{isCoordinator ? 'Disciplinas cadastradas' : 'Disciplinas disponíveis'}</Text>
        <Text style={formStyles.summaryText}>Total visível: {visibleSubjects.length}</Text>
        {isLoading ? (
          <Text style={formStyles.summaryText}>Carregando disciplinas...</Text>
        ) : visibleSubjects.length === 0 ? (
          <View style={componentStyles.emptyState}>
            <Text style={componentStyles.emptyStateTitle}>Nenhuma disciplina encontrada</Text>
            <Text style={componentStyles.emptyStateText}>
              {isCoordinator
                ? 'Cadastre a primeira disciplina para montar a grade curricular.'
                : 'Ainda não existem disciplinas vinculadas ao seu perfil.'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={visibleSubjects}
            renderItem={renderSubjectItem}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false}
            contentContainerStyle={{ gap: 16 }}
          />
        )}
      </View>
    </ScreenFrame>
  );
}
