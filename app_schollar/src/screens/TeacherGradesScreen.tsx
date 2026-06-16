import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenFrame } from '../components/ScreenFrame';
import { TextField } from '../components/TextField';
import { fetchCurrentProfile, fetchGradesBySubject, fetchSubjectsByProfessor, GradeRecord, request, SubjectRecord } from '../services/schoolService';
import { componentStyles } from '../styles/components.styles';
import { formStyles } from '../styles/form.styles';

export function TeacherGradesScreen() {
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<GradeRecord | null>(null);
  const [nota1, setNota1] = useState('');
  const [nota2, setNota2] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [teacherName, setTeacherName] = useState('');
  const [teacherId, setTeacherId] = useState<number | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const profile = await fetchCurrentProfile();

      if (!profile.professor) {
        setSubjects([]);
        return;
      }

      setTeacherName(profile.professor.nome);
      setTeacherId(profile.professor.id);
      
      // Busca as disciplinas ministradas por este professor
      const subjectData = await fetchSubjectsByProfessor(profile.professor.id);
      setSubjects(subjectData || []);

      if (selectedSubjectId) {
        await loadGradesForSubject(selectedSubjectId);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as notas.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadGradesForSubject = async (subjectId: number) => {
    try {
      setIsRefreshing(true);
      const data = await fetchGradesBySubject(subjectId);
      setGrades(data || []);
      setSelectedSubjectId(subjectId);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os alunos desta disciplina.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSaveGrade = async () => {
    if (!selectedGrade) return;

    const n1 = parseFloat(nota1);
    const n2 = parseFloat(nota2);

    if (isNaN(n1) || isNaN(n2) || n1 < 0 || n1 > 10 || n2 < 0 || n2 > 10) {
      Alert.alert('Erro', 'As notas devem ser números entre 0 e 10.');
      return;
    }

    try {
      await request<{ message: string; nota: any }>('/notas', {
        method: 'POST',
        body: JSON.stringify({
          aluno_id: selectedGrade.aluno_id,
          disciplina_id: selectedGrade.disciplina_id,
          nota1: n1,
          nota2: n2,
        }),
      });

      Alert.alert('Sucesso', 'Notas salvas com sucesso.');
      setSelectedGrade(null);
      setNota1('');
      setNota2('');
      
      if (selectedSubjectId) {
        // Recarrega a listagem para mostrar o "boletim" atualizado do aluno
        await loadGradesForSubject(selectedSubjectId);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as notas.');
    }
  };

  const renderGradeItem = ({ item }: { item: GradeRecord }) => (
    <View style={componentStyles.card}>
      <Text style={componentStyles.cardTitle}>{item.aluno_nome}</Text>
      <Text style={formStyles.summaryText}>Matrícula: {item.matricula}</Text>
      <Text style={formStyles.summaryText}>Disciplina: {item.disciplina}</Text>
      <View style={componentStyles.rowWrap}>
        <View style={formStyles.summaryCard}>
          <Text style={formStyles.summaryTitle}>Nota 1</Text>
          <Text style={formStyles.summaryText}>{item.nota1}</Text>
        </View>
        <View style={formStyles.summaryCard}>
          <Text style={formStyles.summaryTitle}>Nota 2</Text>
          <Text style={formStyles.summaryText}>{item.nota2}</Text>
        </View>
        <View style={formStyles.summaryCard}>
          <Text style={formStyles.summaryTitle}>Média</Text>
          <Text style={formStyles.summaryText}>{item.media}</Text>
        </View>
        <View style={formStyles.summaryCard}>
          <Text style={formStyles.summaryTitle}>Situação</Text>
          <Text style={formStyles.summaryText}>{item.situacao}</Text>
        </View>
      </View>
      <PrimaryButton
        label="Editar notas"
        onPress={() => {
          setSelectedGrade(item);
          setNota1(String(item.nota1));
          setNota2(String(item.nota2));
        }}
      />
    </View>
  );

  const renderSubjectItem = ({ item }: { item: SubjectRecord }) => (
    <TouchableOpacity 
      style={[componentStyles.card, selectedSubjectId === item.id && { borderColor: '#2E7D32', borderWidth: 2 }]}
      onPress={() => loadGradesForSubject(item.id)}
    >
      <Text style={componentStyles.cardTitle}>{item.nome}</Text>
      <Text style={formStyles.summaryText}>{item.curso} - {item.semestre}º Semestre</Text>
      <Text style={formStyles.summaryText}>Carga horária: {item.carga_horaria}h</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenFrame tag="Gestão de Notas" title="Lançar Notas" subtitle="Gerencie as notas dos seus alunos">
      <View style={componentStyles.card}>
        <Text style={componentStyles.cardTitle}>Professor autenticado</Text>
        <Text style={formStyles.summaryText}>{teacherName || 'Carregando perfil...'}</Text>
      </View>

      {selectedGrade && (
        <View style={componentStyles.card}>
          <Text style={componentStyles.cardTitle}>Editar Notas</Text>
          <Text style={formStyles.summaryText}>Aluno: {selectedGrade.aluno_nome}</Text>
          <Text style={formStyles.summaryText}>Disciplina: {selectedGrade.disciplina}</Text>
          <TextField
            label="Nota 1"
            keyboardType="decimal-pad"
            value={nota1}
            onChangeText={(v) => setNota1(v.replace(',', '.'))}
            placeholder="0.0 - 10.0"
          />
          <TextField
            label="Nota 2"
            keyboardType="decimal-pad"
            value={nota2}
            onChangeText={(v) => setNota2(v.replace(',', '.'))}
            placeholder="0.0 - 10.0"
          />
          <View style={componentStyles.rowWrap}>
            <PrimaryButton label="Salvar" onPress={handleSaveGrade} />
            <PrimaryButton
              label="Cancelar"
              variant="secondary"
              onPress={() => {
                setSelectedGrade(null);
                setNota1('');
                setNota2('');
              }}
            />
          </View>
        </View>
      )}

      <View style={{ marginBottom: 16 }}>
        <Text style={componentStyles.cardTitle}>1. Selecione a Disciplina</Text>
        {isLoading ? (
          <Text style={formStyles.summaryText}>Carregando disciplinas...</Text>
        ) : (
          <FlatList
            data={subjects}
            renderItem={renderSubjectItem}
            keyExtractor={(item) => `subject-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
          />
        )}
      </View>

      {selectedSubjectId && (
        <View style={{ flex: 1 }}>
          <Text style={componentStyles.cardTitle}>2. Alunos e Notas</Text>
          {isRefreshing ? (
            <Text style={formStyles.summaryText}>Atualizando lista de alunos...</Text>
          ) : grades.length === 0 ? (
            <Text style={formStyles.summaryText}>Nenhum aluno matriculado nesta disciplina.</Text>
          ) : (
            <FlatList
              data={grades}
              renderItem={renderGradeItem}
              keyExtractor={(item) => `grade-${item.id}`}
              scrollEnabled={false}
              contentContainerStyle={{ gap: 16 }}
            />
          )}
        </View>
      )}
    </ScreenFrame>
  );
}
