import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenFrame } from '../components/ScreenFrame';
import { TextField } from '../components/TextField';
import { persistRegistration } from '../services/schoolService';
import { componentStyles } from '../styles/components.styles';
import { formStyles } from '../styles/form.styles';

export function TeacherRegistrationScreen() {
  const [name, setName] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [email, setEmail] = useState('');
  const [shift, setShift] = useState('');
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !speciality.trim()) {
      Alert.alert('Atenção', 'Nome e especialidade são obrigatórios para cadastrar o professor.');
      return;
    }

    setIsSaving(true);

    try {
      await persistRegistration('Professor', {
        nome: name,
        especialidade: speciality,
        email,
        turno: shift,
        biografia: bio,
      });
      Alert.alert('Cadastro realizado', 'O professor foi salvo com sucesso.');
      setName('');
      setSpeciality('');
      setEmail('');
      setShift('');
      setBio('');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenFrame
      tag="Equipe docente"
      title="Cadastro de professores"
      subtitle="Organize a equipe com campos simples e foco no fluxo rápido de lançamento.">
      <View style={componentStyles.card}>
        <Text style={componentStyles.cardTitle}>Dados do docente</Text>
        <View style={formStyles.grid}>
          <TextField label="Nome completo" value={name} onChangeText={setName} placeholder="Informe o nome do professor" />
          <TextField label="Especialidade" value={speciality} onChangeText={setSpeciality} placeholder="Ex.: Matemática" />
          <TextField
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="professor@escola.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextField label="Turno" value={shift} onChangeText={setShift} placeholder="Manhã, tarde ou noite" />
          <TextField label="Biografia curta" value={bio} onChangeText={setBio} placeholder="Experiência e observações" multiline />
        </View>
      </View>


      <PrimaryButton label={isSaving ? 'Salvando...' : 'Salvar professor'} onPress={handleSave} disabled={isSaving} />
    </ScreenFrame>
  );
}
