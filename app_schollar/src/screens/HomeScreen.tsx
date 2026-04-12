import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenFrame } from '../components/ScreenFrame';
import { StatTile } from '../components/StatTile';
import { useAuth } from '../contexts/AuthContext';
import { MainTabParamList } from '../navigation/types';
import { DashboardSummary, fetchDashboardSummary } from '../services/schoolService';
import { componentStyles } from '../styles/components.styles';
import { formStyles } from '../styles/form.styles';
import { homeStyles } from '../styles/home.styles';

type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSummary = async () => {
      const data = await fetchDashboardSummary(user?.name ?? 'Equipe Escolar');

      if (mounted) {
        setSummary(data);
        setIsLoading(false);
      }
    };

    loadSummary();

    return () => {
      mounted = false;
    };
  }, [user?.name]);

  return (
    <ScreenFrame
      tag="Painel inicial"
      title={`Olá, ${user?.name ?? 'coordenador'}`}
      subtitle={summary?.greetings ?? 'Carregando visão geral da escola...'}>
      <View style={componentStyles.card}>
        <Text style={componentStyles.cardTitle}>Resumo rápido</Text>
        <View style={componentStyles.rowWrap}>
          {summary?.stats.map((item) => (
            <StatTile key={item.label} value={item.value} label={item.label} />
          )) ?? (
            <View style={componentStyles.emptyState}>
              <Text style={componentStyles.emptyStateTitle}>{isLoading ? 'Atualizando dados...' : 'Sem dados disponíveis'}</Text>
              <Text style={componentStyles.emptyStateText}>
                A visão geral será exibida assim que a sincronização local terminar.
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={componentStyles.card}>
        <Text style={componentStyles.cardTitle}>Ações rápidas</Text>
        <View style={homeStyles.quickActionList}>
          <PrimaryButton label="Cadastrar aluno" onPress={() => navigation.navigate('Students')} style={homeStyles.quickAction} />
          <PrimaryButton label="Cadastrar professor" onPress={() => navigation.navigate('Teachers')} style={homeStyles.quickAction} />
          <PrimaryButton label="Cadastrar disciplina" onPress={() => navigation.navigate('Subjects')} style={homeStyles.quickAction} />
          <PrimaryButton label="Ver boletim" onPress={() => navigation.navigate('Report')} style={homeStyles.quickAction} />
        </View>
      </View>

      <View style={componentStyles.card}>
        <Text style={componentStyles.cardTitle}>Agenda do dia</Text>
        {summary?.schedule.map((item) => (
          <View key={item.time} style={homeStyles.scheduleItem}>
            <Text style={homeStyles.scheduleTime}>{item.time}</Text>
            <Text style={homeStyles.scheduleTitle}>{item.title}</Text>
            <Text style={homeStyles.scheduleMeta}>{item.meta}</Text>
          </View>
        ))}
      </View>

      <View style={componentStyles.card}>
        <Text style={componentStyles.cardTitle}>Avisos importantes</Text>
        {summary?.announcements.map((item) => (
          <View key={item.title} style={homeStyles.announcementItem}>
            <Text style={homeStyles.announcementTitle}>{item.title}</Text>
            <Text style={homeStyles.announcementText}>{item.text}</Text>
          </View>
        ))}
      </View>

      <PrimaryButton
        label="Sair do sistema"
        variant="secondary"
        onPress={() => {
          signOut();
          Alert.alert('Sessão encerrada', 'Você retornou para a tela de login.');
        }}
      />

      <View style={formStyles.summaryCard}>
        <Text style={formStyles.summaryTitle}>Identidade ativa</Text>
        <Text style={formStyles.summaryText}>{user?.email ?? 'Nenhum usuário autenticado'}</Text>
      </View>
    </ScreenFrame>
  );
}
