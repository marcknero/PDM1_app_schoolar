import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenFrame } from '../components/ScreenFrame';
import { TextField } from '../components/TextField';
import { BulletinData, fetchBulletin } from '../services/schoolService';
import { componentStyles } from '../styles/components.styles';
import { formStyles } from '../styles/form.styles';
import { reportStyles } from '../styles/report.styles';

export function ReportScreen() {
  const [report, setReport] = useState<BulletinData | null>(null);
  const [matricula, setMatricula] = useState('2024001');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReport('2024001');
  }, []);

  const loadReport = async (value: string) => {
    try {
      setIsLoading(true);
      const data = await fetchBulletin(value);
      setReport(data);
    } catch (error) {
      setReport(null);
      Alert.alert('Erro', 'Não foi possível carregar o boletim informado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenFrame
      tag="Desempenho"
      title="Visualização de boletim"
      subtitle="Busque um aluno pela matrícula para acompanhar notas, frequência e situação.">
      <View style={componentStyles.card}>
        <Text style={componentStyles.cardTitle}>Consultar boletim</Text>
        <View style={formStyles.grid}>
          <TextField label="Matrícula" value={matricula} onChangeText={setMatricula} placeholder="000000" keyboardType="number-pad" />
          <PrimaryButton label={isLoading ? 'Carregando...' : 'Carregar boletim'} onPress={() => loadReport(matricula)} disabled={isLoading} />
        </View>
      </View>

      <View style={reportStyles.reportHero}>
        <Text style={reportStyles.reportHeroTitle}>{report?.studentName ?? (isLoading ? 'Carregando boletim...' : 'Nenhum boletim carregado')}</Text>
        <Text style={reportStyles.reportHeroText}>{report?.className ?? 'Busque um estudante para visualizar os dados acadêmicos.'}</Text>
      </View>

      <View style={componentStyles.rowWrap}>
        <View style={reportStyles.resultTile}>
          <Text style={reportStyles.resultTitle}>Média geral</Text>
          <Text style={reportStyles.resultValue}>{report ? report.average.toFixed(1) : '--'}</Text>
          <Text style={reportStyles.resultSubvalue}>Resultado consolidado das disciplinas.</Text>
        </View>
        <View style={reportStyles.resultTile}>
          <Text style={reportStyles.resultTitle}>Frequência</Text>
          <Text style={reportStyles.resultValue}>{report?.attendance ?? '--'}</Text>
          <Text style={reportStyles.resultSubvalue}>Presença acumulada no período letivo.</Text>
        </View>
      </View>

      <View style={componentStyles.card}>
        <View style={formStyles.rowFooter}>
          <Text style={componentStyles.cardTitle}>Disciplinas</Text>
          <View style={componentStyles.chip}>
            <Text style={componentStyles.chipText}>{report?.status ?? 'Em andamento'}</Text>
          </View>
        </View>

        <View style={reportStyles.gradeList}>
          {report?.subjects.map((item) => {
            const progress = Math.min(Math.max(item.grade / 10, 0), 1);

            return (
              <View key={item.subject} style={reportStyles.gradeRow}>
                <View style={reportStyles.gradeRowTop}>
                  <Text style={reportStyles.gradeSubject}>{item.subject}</Text>
                  <Text style={reportStyles.gradeValue}>{item.grade.toFixed(1)}</Text>
                </View>
                <View style={reportStyles.progressTrack}>
                  <View style={[reportStyles.progressFill, { width: `${progress * 100}%` }]} />
                </View>
                <View style={reportStyles.gradeMeta}>
                  <Text style={reportStyles.gradeMetaText}>Frequência: {item.attendance}</Text>
                  <Text style={reportStyles.gradeMetaText}>Situação acadêmica regular</Text>
                </View>
              </View>
            );
          }) ?? (
            <View style={componentStyles.emptyState}>
              <Text style={componentStyles.emptyStateTitle}>{isLoading ? 'Carregando boletim...' : 'Nenhum boletim encontrado'}</Text>
              <Text style={componentStyles.emptyStateText}>{isLoading ? 'Os dados chegam em instantes para a análise do desempenho.' : 'Informe uma matrícula válida para localizar o aluno.'}</Text>
            </View>
          )}
        </View>
      </View>
    </ScreenFrame>
  );
}
