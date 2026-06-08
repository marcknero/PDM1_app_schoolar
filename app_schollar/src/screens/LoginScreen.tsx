import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenFrame } from '../components/ScreenFrame';
import { TextField } from '../components/TextField';
import { useAuth } from '../contexts/AuthContext';
import { useImmersiveMode } from '../hooks/useImmersiveMode';
import { componentStyles } from '../styles/components.styles';
import { loginStyles } from '../styles/login.styles';

export function LoginScreen() {
  const { signIn } = useAuth();
  useImmersiveMode(true);

  const [email, setEmail] = useState('coordenacao@escola.com');
  const [password, setPassword] = useState('123456');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Informe e-mail e senha para acessar o sistema.');
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn({ email, password });
    } catch (error) {
      Alert.alert('Falha no login', error instanceof Error ? error.message : 'Não foi possível autenticar no momento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenFrame
      tag="Gestão escolar"
      title="Bem-vindo ao Scholar"
      subtitle="Um painel leve para acessar turmas, docentes, disciplinas e boletins em um só lugar."> 

      <View style={loginStyles.formCard}>
        <View style={componentStyles.card}>
          <Text style={componentStyles.cardTitle}>Entrar no sistema</Text>
          <Text style={loginStyles.formIntro}>
            Use o perfil da coordenação para acessar a área principal e começar os cadastros.
          </Text>
        </View>

        <TextField
          label="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholder="coordenacao@escola.com"
        />
        <TextField
          label="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="Digite sua senha"
        />

        <PrimaryButton label={isSubmitting ? 'Entrando...' : 'Acessar painel'} onPress={handleLogin} disabled={isSubmitting} />
      </View>
    </ScreenFrame>
  );
}
