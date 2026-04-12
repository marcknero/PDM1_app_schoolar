import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { ScreenFrame } from '../components/ScreenFrame';
import { BulletinData, fetchBulletin } from '../services/schoolService';
import { componentStyles } from '../styles/components.styles';
import { formStyles } from '../styles/form.styles';
import { reportStyles } from '../styles/report.styles';

export function ReportScreen() {
  const [report, setReport] = useState<BulletinData | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadReport = async () => {
      const data = await fetchBulletin();

      if (mounted) {
        setReport(data);
      }
    };

    loadReport();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ScreenFrame
      tag="Desempenho"
      title="Visualização de boletim"
      subtitle="Resumo acadêmico com notas, frequência e um painel limpo para análise rápida.">
      <View style={reportStyles.reportHero}>
        <Text style={reportStyles.reportHeroTitle}>{report?.studentName ?? 'Carregando boletim...'}</Text>
        <Text style={reportStyles.reportHeroText}>{report?.className ?? 'Buscando dados do estudante e da turma.'}</Text>
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
              <Text style={componentStyles.emptyStateTitle}>Carregando boletim...</Text>
              <Text style={componentStyles.emptyStateText}>Os dados chegam em instantes para a análise do desempenho.</Text>
            </View>
          )}
        </View>
      </View>
    </ScreenFrame>
  );
}
