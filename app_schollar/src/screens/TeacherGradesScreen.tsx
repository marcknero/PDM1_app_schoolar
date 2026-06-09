import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenFrame } from '../components/ScreenFrame';
import { TextField } from '../components/TextField';
import { useAuth } from '../contexts/AuthContext';
import { request } from '../services/schoolService';
import { componentStyles } from '../styles/components.styles';
import { formStyles } from '../styles/form.styles';

type Grade = {
  id: number;
  aluno_id: number;
  aluno_nome: string;
  matricula: string;
  disciplina_id: number;
  disciplina: string;
  nota1: number;
  nota2: number;
  media: number;
  situacao: string;
};

export function TeacherGradesScreen() {
  const { user } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [nota1, setNota1] = useState('');
  const [nota2, setNota2] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    try {
      setIsLoading(true);
      const data = await request<{ notas: Grade[] }>('/notas/professor/1');
      setGrades(data.notas || []);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as notas.');
    } finally {
      setIsLoading(false);
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
      await request<{ message: string; nota: Grade }>('/notas', {
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
      loadGrades();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as notas.');
    }
  };

  const renderGradeItem = ({ item }: { item: Grade }) => (
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

  return (
    <ScreenFrame tag="Gestão de Notas" title="Lançar Notas" subtitle="Gerencie as notas dos seus alunos">
      {selectedGrade && (
        <View style={componentStyles.card}>
          <Text style={componentStyles.cardTitle}>Editar Notas</Text>
          <Text style={formStyles.summaryText}>Aluno: {selectedGrade.aluno_nome}</Text>
          <Text style={formStyles.summaryText}>Disciplina: {selectedGrade.disciplina}</Text>
          <TextField
            label="Nota 1"
            keyboardType="decimal-pad"
            value={nota1}
            onChangeText={setNota1}
            placeholder="0.0 - 10.0"
          />
          <TextField
            label="Nota 2"
            keyboardType="decimal-pad"
            value={nota2}
            onChangeText={setNota2}
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

      {isLoading ? (
        <Text style={formStyles.summaryText}>Carregando notas...</Text>
      ) : grades.length === 0 ? (
        <Text style={formStyles.summaryText}>Nenhuma nota encontrada.</Text>
      ) : (
        <FlatList
          data={grades}
          renderItem={renderGradeItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ gap: 16 }}
        />
      )}
    </ScreenFrame>
  );
}
