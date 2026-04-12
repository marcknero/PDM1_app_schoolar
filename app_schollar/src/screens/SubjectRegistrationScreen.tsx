import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenFrame } from '../components/ScreenFrame';
import { TextField } from '../components/TextField';
import { persistRegistration } from '../services/schoolService';
import { componentStyles } from '../styles/components.styles';
import { formStyles } from '../styles/form.styles';

export function SubjectRegistrationScreen() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [workload, setWorkload] = useState('');
  const [teacher, setTeacher] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !code.trim()) {
      Alert.alert('Atenção', 'Nome e código são obrigatórios para cadastrar a disciplina.');
      return;
    }

    setIsSaving(true);

    try {
      await persistRegistration('Disciplina', {
        nome: name,
        codigo: code,
        cargaHoraria: workload,
        professor: teacher,
        descricao: description,
      });
      Alert.alert('Cadastro realizado', 'A disciplina foi salva com sucesso.');
      setName('');
      setCode('');
      setWorkload('');
      setTeacher('');
      setDescription('');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenFrame
      tag="Grade curricular"
      title="Cadastro de disciplinas"
      subtitle="Estruture o currículo com dados diretos, sem ruído visual e com foco no essencial.">
      <View style={componentStyles.card}>
        <Text style={componentStyles.cardTitle}>Dados da disciplina</Text>
        <View style={formStyles.grid}>
          <TextField label="Nome da disciplina" value={name} onChangeText={setName} placeholder="Ex.: Ciências" />
          <TextField label="Código" value={code} onChangeText={setCode} placeholder="CIE-01" />
          <View style={formStyles.dualRow}>
            <View style={{ flex: 1 }}>
              <TextField label="Carga horária" value={workload} onChangeText={setWorkload} placeholder="40h" />
            </View>
            <View style={{ flex: 1 }}>
              <TextField label="Professor responsável" value={teacher} onChangeText={setTeacher} placeholder="Nome do docente" />
            </View>
          </View>
          <TextField
            label="Descrição"
            value={description}
            onChangeText={setDescription}
            placeholder="Resumo da disciplina"
            multiline
          />
        </View>
      </View>


      <PrimaryButton label={isSaving ? 'Salvando...' : 'Salvar disciplina'} onPress={handleSave} disabled={isSaving} />
    </ScreenFrame>
  );
}
