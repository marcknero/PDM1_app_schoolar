import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenFrame } from '../components/ScreenFrame';
import { TextField } from '../components/TextField';
import { deleteRegistration, fetchStudents, persistRegistration, StudentRecord, updateRegistration } from '../services/schoolService';
import { componentStyles } from '../styles/components.styles';
import { formStyles } from '../styles/form.styles';

type StudentFormState = {
  nome: string;
  matricula: string;
  curso: string;
  email: string;
  password?: string;
  telefone: string;
  cep: string;
  endereco: string;
  cidade: string;
  estado: string;
};

const emptyForm: StudentFormState = {
  nome: '',
  matricula: '',
  curso: '',
  email: '',
  password: '',
  telefone: '',
  cep: '',
  endereco: '',
  cidade: '',
  estado: '',
};

export function StudentRegistrationScreen() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [form, setForm] = useState<StudentFormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      const data = await fetchStudents();
      setStudents(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os alunos cadastrados.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (student: StudentRecord) => {
    setEditingId(student.id);
    setForm({
      nome: student.nome ?? '',
      matricula: student.matricula ?? '',
      curso: student.curso ?? '',
      email: student.email ?? '',
      password: '',
      telefone: student.telefone ?? '',
      cep: student.cep ?? '',
      endereco: student.endereco ?? '',
      cidade: student.cidade ?? '',
      estado: student.estado ?? '',
    });
  };

  const handleSave = async () => {
    if (!form.nome.trim() || !form.matricula.trim() || !form.curso.trim()) {
      Alert.alert('Atenção', 'Nome e matrícula são obrigatórios para cadastrar o aluno.');
      return;
    }

    setIsSaving(true);

    const payload = {
      ...form,
      email: form.email.toLowerCase().trim(),
      perfil: 'aluno'
    };

    try {
      if (editingId) {
        await updateRegistration('Aluno', editingId, payload);
        Alert.alert('Atualização realizada', 'Os dados do aluno foram atualizados com sucesso.');
      } else {
        await persistRegistration('Aluno', payload);
        Alert.alert('Cadastro realizado', 'O aluno foi salvo com sucesso.');
      }

      resetForm();
      await loadStudents();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os dados do aluno.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (student: StudentRecord) => {
    Alert.alert('Excluir aluno', `Deseja remover ${student.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteRegistration('Aluno', student.id);
            if (editingId === student.id) {
              resetForm();
            }
            await loadStudents();
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir o aluno.');
          }
        },
      },
    ]);
  };

  const renderStudentItem = ({ item }: { item: StudentRecord }) => (
    <View style={componentStyles.card}>
      <View style={formStyles.rowFooter}>
        <Text style={componentStyles.cardTitle}>{item.nome}</Text>
        <View style={componentStyles.chip}>
          <Text style={componentStyles.chipText}>{item.matricula}</Text>
        </View>
      </View>
      <Text style={formStyles.summaryText}>{item.curso}</Text>
      <Text style={formStyles.summaryText}>{item.email ?? 'Sem e-mail cadastrado'}</Text>
      <Text style={formStyles.summaryText}>{item.telefone ?? 'Sem telefone cadastrado'}</Text>
      <View style={componentStyles.rowWrap}>
        <PrimaryButton label="Editar" onPress={() => startEdit(item)} />
        <PrimaryButton label="Excluir" variant="secondary" onPress={() => handleDelete(item)} />
      </View>
    </View>
  );

  return (
    <ScreenFrame
      tag="Cadastro acadêmico"
      title="Cadastro de alunos"
      subtitle="Registre, edite e remova estudantes já cadastrados no sistema.">
      <View style={componentStyles.card}>
        <Text style={componentStyles.cardTitle}>{editingId ? 'Editar aluno' : 'Novo aluno'}</Text>
        <View style={formStyles.grid}>
          <TextField label="Nome completo" value={form.nome} onChangeText={(value) => setForm((current) => ({ ...current, nome: value }))} placeholder="Informe o nome do aluno" />
          <TextField label="Matrícula" value={form.matricula} onChangeText={(value) => setForm((current) => ({ ...current, matricula: value }))} placeholder="0000" keyboardType="number-pad" />
          <TextField label="Curso" value={form.curso} onChangeText={(value) => setForm((current) => ({ ...current, curso: value }))} placeholder="Técnico em Informática" />
          <View style={formStyles.dualRow}>
            <View style={{ flex: 1 }}>
              <TextField label="E-mail" value={form.email} onChangeText={(value) => setForm((current) => ({ ...current, email: value }))} placeholder="aluno@escola.com" keyboardType="email-address" autoCapitalize="none" />
            </View>
            <View style={{ flex: 1 }}>
              <TextField label="Telefone" value={form.telefone} onChangeText={(value) => setForm((current) => ({ ...current, telefone: value }))} placeholder="(11) 99999-9999" keyboardType="phone-pad" />
            </View>
          </View>
          <TextField
            label={editingId ? "Alterar senha (opcional)" : "Senha de acesso"}
            value={form.password}
            onChangeText={(value) => setForm((current) => ({ ...current, password: value }))}
            placeholder={editingId ? "Deixe vazio para manter a atual" : "Defina uma senha de acesso"}
            secureTextEntry
            autoCapitalize="none"
          />
          <View style={formStyles.dualRow}>
            <View style={{ flex: 1 }}>
              <TextField label="CEP" value={form.cep} onChangeText={(value) => setForm((current) => ({ ...current, cep: value }))} placeholder="00000-000" keyboardType="number-pad" />
            </View>
            <View style={{ flex: 1 }}>
              <TextField label="Estado" value={form.estado} onChangeText={(value) => setForm((current) => ({ ...current, estado: value }))} placeholder="SP" autoCapitalize="characters" />
            </View>
          </View>
          <TextField label="Endereço" value={form.endereco} onChangeText={(value) => setForm((current) => ({ ...current, endereco: value }))} placeholder="Rua, número e complemento" />
          <TextField label="Cidade" value={form.cidade} onChangeText={(value) => setForm((current) => ({ ...current, cidade: value }))} placeholder="Cidade" />
        </View>
      </View>

      <View style={componentStyles.rowWrap}>
        <PrimaryButton label={isSaving ? 'Salvando...' : editingId ? 'Atualizar aluno' : 'Salvar aluno'} onPress={handleSave} disabled={isSaving} />
        {editingId && <PrimaryButton label="Cancelar edição" variant="secondary" onPress={resetForm} />}
      </View>

      <View style={componentStyles.card}>
        <Text style={componentStyles.cardTitle}>Alunos cadastrados</Text>
        <Text style={formStyles.summaryText}>Total de registros: {students.length}</Text>
        {isLoading ? (
          <Text style={formStyles.summaryText}>Carregando alunos...</Text>
        ) : students.length === 0 ? (
          <View style={componentStyles.emptyState}>
            <Text style={componentStyles.emptyStateTitle}>Nenhum aluno encontrado</Text>
            <Text style={componentStyles.emptyStateText}>Cadastre o primeiro aluno para iniciar a gestão acadêmica.</Text>
          </View>
        ) : (
          <FlatList
            data={students}
            renderItem={renderStudentItem}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false}
            contentContainerStyle={{ gap: 16 }}
          />
        )}
      </View>
    </ScreenFrame>
  );
}
