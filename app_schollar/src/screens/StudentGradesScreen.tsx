import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Text, View } from 'react-native';

import { ScreenFrame } from '../components/ScreenFrame';
import { fetchBulletinByAlunoId, fetchCurrentProfile } from '../services/schoolService';
import { componentStyles } from '../styles/components.styles';
import { formStyles } from '../styles/form.styles';

type SubjectGrade = {
  nota_id: number;
  disciplina: string;
  nota1: number;
  nota2: number;
  media: number;
  situacao: string;
};

export function StudentGradesScreen() {
  const [grades, setGrades] = useState<SubjectGrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [className, setClassName] = useState('');

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    try {
      setIsLoading(true);
      const profile = await fetchCurrentProfile();

      if (!profile.aluno) {
        setGrades([]);
        return;
      }

      setStudentName(profile.aluno.nome);
      setClassName(profile.aluno.curso);

      const data = await fetchBulletinByAlunoId(profile.aluno.id);
      setGrades(data || []);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar suas notas.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderGradeItem = ({ item }: { item: SubjectGrade }) => (
    <View style={componentStyles.card}>
      <Text style={componentStyles.cardTitle}>{item.disciplina}</Text>
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
    </View>
  );

  const calculateOverallAverage = () => {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, grade) => acc + grade.media, 0);
    return (sum / grades.length).toFixed(1);
  };

  const getOverallStatus = () => {
    if (grades.length === 0) return '-';
    const hasFailed = grades.some((grade) => grade.situacao === 'Reprovado');
    return hasFailed ? 'Em recuperação' : 'Aprovado';
  };

  return (
    <ScreenFrame tag="Minhas Notas" title="Boletim" subtitle="Acompanhe seu desempenho acadêmico">
      <View style={componentStyles.card}>
        <Text style={componentStyles.cardTitle}>Resumo Geral</Text>
        <Text style={formStyles.summaryText}>{studentName || 'Aluno autenticado'}</Text>
        <Text style={formStyles.summaryText}>{className || 'Curso não informado'}</Text>
        <View style={componentStyles.rowWrap}>
          <View style={formStyles.summaryCard}>
            <Text style={formStyles.summaryTitle}>Média Geral</Text>
            <Text style={formStyles.summaryText}>{calculateOverallAverage()}</Text>
          </View>
          <View style={formStyles.summaryCard}>
            <Text style={formStyles.summaryTitle}>Situação</Text>
            <Text style={formStyles.summaryText}>{getOverallStatus()}</Text>
          </View>
          <View style={formStyles.summaryCard}>
            <Text style={formStyles.summaryTitle}>Disciplinas</Text>
            <Text style={formStyles.summaryText}>{grades.length}</Text>
          </View>
        </View>
      </View>

      {isLoading ? (
        <Text style={formStyles.summaryText}>Carregando notas...</Text>
      ) : grades.length === 0 ? (
        <Text style={formStyles.summaryText}>Nenhuma nota encontrada.</Text>
      ) : (
        <FlatList
          data={grades}
          renderItem={renderGradeItem}
          keyExtractor={(item) => String(item.nota_id)}
          contentContainerStyle={{ gap: 16 }}
        />
      )}
    </ScreenFrame>
  );
}
