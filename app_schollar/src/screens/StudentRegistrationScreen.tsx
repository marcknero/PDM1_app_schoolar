import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenFrame } from '../components/ScreenFrame';
import { TextField } from '../components/TextField';
import { persistRegistration } from '../services/schoolService';
import { componentStyles } from '../styles/components.styles';
import { formStyles } from '../styles/form.styles';

export function StudentRegistrationScreen() {
  const [name, setName] = useState('');
  const [registration, setRegistration] = useState('');
  const [classGroup, setClassGroup] = useState('');
  const [guardian, setGuardian] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !registration.trim()) {
      Alert.alert('Atenção', 'Nome e matrícula são obrigatórios para cadastrar o aluno.');
      return;
    }

    setIsSaving(true);

    try {
      await persistRegistration('Aluno', {
        nome: name,
        matricula: registration,
        turma: classGroup,
        responsavel: guardian,
        observacoes: notes,
      });
      Alert.alert('Cadastro realizado', 'O aluno foi salvo com sucesso.');
      setName('');
      setRegistration('');
      setClassGroup('');
      setGuardian('');
      setNotes('');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenFrame
      tag="Cadastro acadêmico"
      title="Cadastro de alunos"
      subtitle="Registre estudantes com dados simples, uma experiência limpa e pronta para uso diário.">
      <View style={componentStyles.card}>
        <Text style={componentStyles.cardTitle}>Dados do aluno</Text>
        <View style={formStyles.grid}>
          <TextField label="Nome completo" value={name} onChangeText={setName} placeholder="Informe o nome do aluno" />
          <TextField label="Matrícula" value={registration} onChangeText={setRegistration} placeholder="0000" keyboardType="number-pad" />
          <View style={formStyles.dualRow}>
            <View style={{ flex: 1 }}>
              <TextField label="Turma" value={classGroup} onChangeText={setClassGroup} placeholder="8A" />
            </View>
            <View style={{ flex: 1 }}>
              <TextField label="Responsável" value={guardian} onChangeText={setGuardian} placeholder="Nome do responsável" />
            </View>
          </View>
          <TextField
            label="Observações"
            value={notes}
            onChangeText={setNotes}
            placeholder="Informações adicionais"
            multiline
          />
        </View>
      </View>

      <PrimaryButton label={isSaving ? 'Salvando...' : 'Salvar aluno'} onPress={handleSave} disabled={isSaving} />
    </ScreenFrame>
  );
}
