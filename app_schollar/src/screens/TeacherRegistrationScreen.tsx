import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenFrame } from '../components/ScreenFrame';
import { TextField } from '../components/TextField';
import { deleteRegistration, fetchTeachers, persistRegistration, TeacherRecord, updateRegistration } from '../services/schoolService';
import { componentStyles } from '../styles/components.styles';
import { formStyles } from '../styles/form.styles';

type TeacherFormState = {
  nome: string;
  titulacao: string;
  area: string;
  email: string;
  password?: string;
  tempo_docencia: string;
};

const emptyForm: TeacherFormState = {
  nome: '',
  titulacao: '',
  area: '',
  email: '',
  password: '',
  tempo_docencia: '',
};

export function TeacherRegistrationScreen() {
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [form, setForm] = useState<TeacherFormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setIsLoading(true);
      const data = await fetchTeachers();
      setTeachers(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os professores cadastrados.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (teacher: TeacherRecord) => {
    setEditingId(teacher.id);
    setForm({
      nome: teacher.nome ?? '',
      titulacao: teacher.titulacao ?? '',
      area: teacher.area ?? '',
      email: teacher.email ?? '',
      password: '',
      tempo_docencia: String(teacher.tempo_docencia ?? ''),
    });
  };

  const handleSave = async () => {
    if (!form.nome.trim() || !form.titulacao.trim() || !form.area.trim() || !form.email.trim()) {
      Alert.alert('Atenção', 'Nome, titulação, área e e-mail são obrigatórios para cadastrar o professor.');
      return;
    }

    setIsSaving(true);

    const payload = {
      ...form,
      email: form.email.toLowerCase().trim(),
      tempo_docencia: parseInt(form.tempo_docencia, 10) || 0,
      perfil: 'professor' // Garante que o backend saiba o tipo de usuário
    };

    try {
      if (editingId) {
        await updateRegistration('Professor', editingId, payload);
        Alert.alert('Atualização realizada', 'Os dados do professor foram atualizados com sucesso.');
      } else {
        await persistRegistration('Professor', payload);
        Alert.alert('Cadastro realizado', 'O professor foi salvo com sucesso.');
      }

      resetForm();
      await loadTeachers();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os dados do professor.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (teacher: TeacherRecord) => {
    Alert.alert('Excluir professor', `Deseja remover ${teacher.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteRegistration('Professor', teacher.id);
            if (editingId === teacher.id) {
              resetForm();
            }
            await loadTeachers();
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir o professor.');
          }
        },
      },
    ]);
  };

  const renderTeacherItem = ({ item }: { item: TeacherRecord }) => (
    <View style={componentStyles.card}>
      <View style={formStyles.rowFooter}>
        <Text style={componentStyles.cardTitle}>{item.nome}</Text>
        <View style={componentStyles.chip}>
          <Text style={componentStyles.chipText}>{item.area}</Text>
        </View>
      </View>
      <Text style={formStyles.summaryText}>{item.titulacao}</Text>
      <Text style={formStyles.summaryText}>{item.email}</Text>
      <Text style={formStyles.summaryText}>{item.tempo_docencia} anos de docência</Text>
      <View style={componentStyles.rowWrap}>
        <PrimaryButton label="Editar" onPress={() => startEdit(item)} />
        <PrimaryButton label="Excluir" variant="secondary" onPress={() => handleDelete(item)} />
      </View>
    </View>
  );

  return (
    <ScreenFrame
      tag="Equipe docente"
      title="Cadastro de professores"
      subtitle="Registre, atualize e remova docentes com visão direta da equipe.">
      <View style={componentStyles.card}>
        <Text style={componentStyles.cardTitle}>{editingId ? 'Editar professor' : 'Novo professor'}</Text>
        <View style={formStyles.grid}>
          <TextField label="Nome completo" value={form.nome} onChangeText={(value) => setForm((current) => ({ ...current, nome: value }))} placeholder="Informe o nome do professor" />
          <TextField label="Titulação" value={form.titulacao} onChangeText={(value) => setForm((current) => ({ ...current, titulacao: value }))} placeholder="Ex.: Mestre" />
          <TextField label="Área" value={form.area} onChangeText={(value) => setForm((current) => ({ ...current, area: value }))} placeholder="Ex.: Matemática" />
          <TextField
            label="E-mail"
            value={form.email}
            onChangeText={(value) => setForm((current) => ({ ...current, email: value }))}
            placeholder="professor@escola.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextField
            label={editingId ? "Alterar senha (opcional)" : "Senha de acesso"}
            value={form.password}
            onChangeText={(value) => setForm((current) => ({ ...current, password: value }))}
            placeholder={editingId ? "Deixe vazio para manter a atual" : "Mínimo 6 caracteres"}
            secureTextEntry
          />
          <TextField label="Tempo de docência" value={form.tempo_docencia} onChangeText={(value) => setForm((current) => ({ ...current, tempo_docencia: value }))} placeholder="0" keyboardType="number-pad" />
        </View>
      </View>

      <View style={componentStyles.rowWrap}>
        <PrimaryButton label={isSaving ? 'Salvando...' : editingId ? 'Atualizar professor' : 'Salvar professor'} onPress={handleSave} disabled={isSaving} />
        {editingId && <PrimaryButton label="Cancelar edição" variant="secondary" onPress={resetForm} />}
      </View>

      <View style={componentStyles.card}>
        <Text style={componentStyles.cardTitle}>Professores cadastrados</Text>
        <Text style={formStyles.summaryText}>Total de registros: {teachers.length}</Text>
        {isLoading ? (
          <Text style={formStyles.summaryText}>Carregando professores...</Text>
        ) : teachers.length === 0 ? (
          <View style={componentStyles.emptyState}>
            <Text style={componentStyles.emptyStateTitle}>Nenhum professor encontrado</Text>
            <Text style={componentStyles.emptyStateText}>Cadastre o primeiro docente para começar a organizar a equipe.</Text>
          </View>
        ) : (
          <FlatList
            data={teachers}
            renderItem={renderTeacherItem}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false}
            contentContainerStyle={{ gap: 16 }}
          />
        )}
      </View>
    </ScreenFrame>
  );
}
