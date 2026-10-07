import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { buildSubjectDraft } from '@/domain/materia';
import { registerSubject } from '@/domain/registerSubject';
import { loadSubjects, saveSubjects } from '@/storage/materiasStorage';
import type { Subject } from '@/types/materia';

const COLORS = {
  background: '#e2e4e9',
  card: '#FFFFFF',
  header: '#001F3F',
  primary: '#357ca5',
  text: '#111111',
  secondary: '#5a6e82',
  border: '#b5bbc8',
  error: '#d33724',
};

export default function HomeScreen() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [name, setName] = useState('');
  const [score, setScore] = useState('');
  const [touched, setTouched] = useState({ name: false, score: false });
  const [duplicateError, setDuplicateError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    loadSubjects()
      .then((savedSubjects) => {
        if (mounted) {
          setSubjects(savedSubjects);
        }
      })
      .catch((error: unknown) => {
        console.error('No se pudieron cargar las materias.', error);
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const draft = useMemo(() => buildSubjectDraft(name, score), [name, score]);
  const canSubmit = draft.valid && !isLoading;

  async function handleSubmit() {
    setTouched({ name: true, score: true });
    setDuplicateError(undefined);
    setFormError(undefined);

    if (!draft.valid) {
      return;
    }

    const result = await registerSubject(
      subjects,
      name,
      score,
      saveSubjects,
      () => `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    );

    if (!result.ok) {
      setDuplicateError(result.errors?.name);
      setFormError(result.formError);
      return;
    }

    setSubjects((current) => [...current, result.subject]);
    setName('');
    setScore('');
    setTouched({ name: false, score: false });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mis materias</Text>
          <Text style={styles.headerSubtitle}>
            Registra tu nota del primer bimestre
          </Text>
        </View>

        <FlatList
          data={subjects}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Registrar materia</Text>

              <Text style={styles.label}>Nombre de la materia</Text>
              <TextInput
                accessibilityLabel="Nombre de la materia"
                value={name}
                onChangeText={(value) => {
                  setName(value);
                  setDuplicateError(undefined);
                  setFormError(undefined);
                }}
                onBlur={() => setTouched((current) => ({ ...current, name: true }))}
                placeholder="Ej. Cálculo"
                placeholderTextColor={COLORS.secondary}
                style={styles.input}
                maxLength={120}
                returnKeyType="next"
              />
              {touched.name && (draft.errors.name || duplicateError) ? (
                <Text style={styles.errorText}>
                  {draft.errors.name || duplicateError}
                </Text>
              ) : null}

              <Text style={styles.label}>Nota del primer bimestre</Text>
              <TextInput
                accessibilityLabel="Nota del primer bimestre"
                value={score}
                onChangeText={(value) => {
                  setScore(value);
                  setFormError(undefined);
                }}
                onBlur={() =>
                  setTouched((current) => ({ ...current, score: true }))
                }
                placeholder="0.00 a 20.00"
                placeholderTextColor={COLORS.secondary}
                style={styles.input}
                keyboardType="decimal-pad"
                inputMode="decimal"
                maxLength={20}
                returnKeyType="done"
              />
              {touched.score && draft.errors.score ? (
                <Text style={styles.errorText}>{draft.errors.score}</Text>
              ) : null}

              {formError ? (
                <Text style={styles.errorText} accessibilityLiveRegion="polite">
                  {formError}
                </Text>
              ) : null}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Guardar materia"
                accessibilityState={{ disabled: !canSubmit }}
                disabled={!canSubmit}
                onPress={handleSubmit}
                style={({ pressed }) => [
                  styles.button,
                  !canSubmit && styles.buttonDisabled,
                  pressed && canSubmit && styles.buttonPressed,
                ]}
              >
                <Text style={styles.buttonText}>Guardar materia</Text>
              </Pressable>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.subjectCard}>
              <View style={styles.subjectCopy}>
                <Text style={styles.subjectName}>{item.name}</Text>
                <Text style={styles.subjectLabel}>Primer bimestre</Text>
              </View>
              <Text style={styles.subjectScore}>{item.firstBim.toFixed(2)}</Text>
            </View>
          )}
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator
                accessibilityLabel="Cargando materias"
                color={COLORS.primary}
                style={styles.loader}
              />
            ) : (
              <Text style={styles.emptyText}>
                Todavía no tienes materias registradas.
              </Text>
            )
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.header,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  label: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    minHeight: 48,
    borderColor: COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    color: COLORS.text,
    fontSize: 16,
    paddingHorizontal: 14,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginTop: 6,
  },
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 48,
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: COLORS.border,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  subjectCard: {
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 76,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  subjectCopy: {
    flex: 1,
  },
  subjectName: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
  },
  subjectLabel: {
    color: COLORS.secondary,
    fontSize: 13,
    marginTop: 4,
  },
  subjectScore: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 16,
  },
  emptyText: {
    color: COLORS.secondary,
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 20,
  },
  loader: {
    paddingVertical: 20,
  },
});
